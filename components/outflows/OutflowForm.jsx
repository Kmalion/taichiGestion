'use client'
import React, { useRef, useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import { FileUpload } from 'primereact/fileupload'
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import uploadFile from '../../service/fileUploadService'
import providersService from '@/service/providerService'
import clientService from '@/service/clientService';
import { Dropdown } from 'primereact/dropdown';
import { generateOutflowNo } from '@/service/outflowService';
import userService from '@/service/userService'


const OutflowForm = ({ outflowData, setOutflowData, handleSaveOutflow }) => {
  const toast = useRef(null);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outflowNo, setOutflowNo] = useState('');
  const [userList, setUserList] = useState([]);


  const searchProviders = async (event) => {
    try {
      setLoading(true);
      const query = event.query || '';

      // Obtén la URL del servidor en el lado del cliente
      const serverURL = window.location.origin;

      // Llama a la función que se ajusta al entorno (cliente o servidor)
      const providers = await providersService.searchProviders(query, serverURL);

      console.log("Respuesta desde el backend Proveedores: ", providers);

      const filteredProviders = providers.map((provider) => ({ label: provider.nombre }));

      setFilteredProviders(filteredProviders);
    } catch (error) {
      console.error('Error al buscar proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchClients = async (event) => {
    try {
      setLoading(true);
      const query = event.query || '';
      const clients = await clientService.searchClients(query);

      // Filtrar los clientes basados en la consulta
      const filteredClients = clients.map((client) => ({ label: client.nombre }));
      setFilteredClients(filteredClients);
    } catch (error) {
      console.error('Error al buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };


  const formik = useFormik({
    initialValues: {
      salidaNo: outflowData.salidaNo || '',
      fechaSalida: outflowData.fechaSalida || '',
      proveedor: outflowData.proveedor || '',
      cliente: outflowData.cliente || '',
      asigned_to: outflowData.asigned_to || null,
      tipo: outflowData.tipo || null,
      document: outflowData.document || '',
      comment: outflowData.comment || '',
    },
    validate: (data) => {
      const errors = {};

      if (!data.salidaNo.trim()) {
        errors.salidaNo = 'Salida No. es requerido';
      }

      if (!data.fechaSalida.trim()) {
        errors.fechaSalida = 'Fecha de Salida es requerido';
      }


      if (data.tipo === 'demostracion' && !data.cliente.trim()) {
        errors.cliente = 'Cliente es requerido para devoluciones';
      }

      if (!data.asigned_to) {
        errors.asigned_to = 'Asignado a es requerido';
      }

      if (!data.tipo) {
        errors.tipo = 'Tipo es requerido';
      }

      return errors;
    },
    onSubmit: (data) => {
      // Agrega la propiedad 'comment' a data antes de llamar a handleSaveOutflow
      const dataWithComment = { ...data, comment: formik.values.comentario };
      handleSaveOutflow(dataWithComment);
      formik.resetForm();
    },
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const newOutflow = await generateOutflowNo();

        setOutflowNo(newOutflow);

        const response = await userService.getUsers();


        if (!response || !Array.isArray(response.users)) {
          throw new Error('La respuesta del servidor no contiene un array de usuarios.');
        }

        const updatedOptions = response.users.map((user) => ({
          label: `${user.nombre} ${user.apellido}`,
          email: user.email,
        }));

        setUserList(updatedOptions);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();

  }, []);

  const onUpload = async (event) => {
    // Manejar la lógica de la carga de archivos aquí
    // event.files contiene los archivos cargados

    const selectedFile = event.files && event.files[0];

    if (selectedFile) {
      try {
        const fileUrl = await uploadFile(selectedFile);


        // Muestra el Toast de éxito
        toast.current.show({
          severity: 'success',
          summary: 'Archivo subido exitosamente',
          detail: 'El archivo se ha subido con éxito.',
        });

        // Actualiza la URL del archivo en el estado
        setOutflowData({ ...outflowData, document: fileUrl });

      } catch (error) {
        // Manejar errores al subir el archivo
        console.error('Error al subir el archivo:', error);

        // Muestra el Toast de error
        toast.current.show({
          severity: 'error',
          summary: 'Error al subir el archivo',
          detail: 'Hubo un problema al subir el archivo. Por favor, inténtalo de nuevo.',
        });
      }
    }
  };



  const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const tipoOptions = [
    { label: 'Facturado', value: 'facturado' },
    { label: 'Demostracion', value: 'demostracion' },
    { label: 'Ajuste', value: 'ajuste' },
  ];
  return (
    <div>
      <h3 className="text-center mt-1">Datos de salida</h3>
      <Card>
          <form onSubmit={(e) => e.preventDefault()}  >
            <div className='grid flex flex justify-content-start flex-wrap'>
            <div className="col-12 md:col-6 lg:col-2  flex align-items-center justify-content-center mt-2 mx-auto">
              <span className="p-float-label">
                <Toast ref={toast} />
                <InputText
                  id="salidaNo"
                  name="salidaNo"
                  value={outflowNo}
                  readOnly
                  onChange={(e) => formik.handleChange(e)}
                  onBlur={formik.handleBlur}
                  className={classNames({ 'p-invalid': isFormFieldInvalid('salidaNo') })}
                  filter={true.toString()}
                />
                <label htmlFor="salidaNo">Salida No.</label>
              </span>
              {getFormErrorMessage('salidaNo')}
            </div>

            <div className="col-12 md:col-6 lg:col-2 flex align-items-center justify-content-center mt-2 mx-auto">
              <span className="p-float-label">
                <InputText
                  id="fechaSalida"
                  name="fechaSalida"
                  value={formik.values.fechaSalida}
                  readOnly
                  onChange={(e) => formik.handleChange(e)}
                  onBlur={formik.handleBlur}
                  className={classNames({ 'p-invalid': isFormFieldInvalid('fechaSalida') })}
                />
                <label htmlFor="fechaSalida">Fecha de Salida</label>
              </span>
              {getFormErrorMessage('fechaSalida')}
            </div>

            <div className="col-12 md:col-6 lg:col-2 flex align-items-center justify-content-center mt-2 mx-auto">
              <span className="p-float-label">
                <AutoComplete
                  id="proveedor"
                  name="proveedor"
                  value={formik.values.proveedor || ''}
                  suggestions={filteredProviders}
                  completeMethod={searchProviders}
                  field="label"
                  onChange={(e) => {
                    setOutflowData({ ...outflowData, proveedor: e.value });
                    formik.handleChange({ target: { name: 'proveedor', value: e.value } });
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Seleccionar proveedor"
                  filter={formik.values.proveedor ? "true" : "false"}
                  className={classNames({ 'p-invalid': isFormFieldInvalid('proveedor') })}
                />
                <label htmlFor="proveedor">Proveedor</label>
              </span>
              {getFormErrorMessage('proveedor')}
            </div>

            <div className="col-12 md:col-6 lg:col-2 flex align-items-center justify-content-center mt-2 mx-auto">
              <span className="p-float-label">
                <AutoComplete
                  id="cliente"
                  name="cliente"
                  value={formik.values.cliente || ''}
                  suggestions={filteredClients}
                  completeMethod={searchClients}
                  field="label"
                  onChange={(e) => {
                    setOutflowData({ ...outflowData, cliente: e.value });
                    formik.handleChange({ target: { name: 'cliente', value: e.value } });
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Seleccionar cliente"
                  filter={formik.values.cliente ? "true" : "false"}
                  className={classNames({ 'p-invalid': isFormFieldInvalid('cliente') })}
                />
                <label htmlFor="cliente">Cliente</label>
              </span>
              {getFormErrorMessage('cliente')}
            </div>

            <div className="col-12 md:col-6 lg:col-2 flex align-items-center justify-content-center mt-2 mx-auto">
              <span className="p-float-label">
                <Dropdown
                  id="asigned_to"
                  name="asigned_to"
                  optionLabel="label"
                  value={formik.values.asigned_to}
                  options={userList}
                  onChange={(e) => {
                    setOutflowData({ ...outflowData, asigned_to: e.value });
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Seleccionar usuario"
                  className={classNames({ 'p-invalid': isFormFieldInvalid('asigned_to') })}
                />
                <label htmlFor="asigned_to">Asignado a</label>
              </span>
              {getFormErrorMessage('asigned_to')}
            </div>

            <div className="col-12 md:col-6 lg:col-2 flex align-items-center justify-content-center mt-2 ">
              <span className="p-float-label">
                <Dropdown
                  id="tipo"
                  name="tipo"
                  options={tipoOptions}
                  value={formik.values.tipo}
                  onChange={(e) => {
                    setOutflowData({ ...outflowData, tipo: e.value });
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Seleccionar tipo"
                  className={classNames({ 'p-invalid': isFormFieldInvalid('tipo') })}
                />
                <label htmlFor="tipo">Tipo</label>
              </span>
              {getFormErrorMessage('tipo')}
            </div>
            <div className="col-12 md:col-6 lg:col-2 flex align-items-center justify-content-center mx-auto">
              <span className="p-float-label">
                <FileUpload
                  mode="basic"
                  accept="image/*,application/pdf"
                  maxFileSize={1000000}
                  customUpload
                  uploadHandler={onUpload}
                  chooseLabel="Documento"
                />
              </span>
            </div>
            <div className="col-12 md:col-6 lg:col-2 flex align-items-center justify-content-center mt-2 mx-auto">
              <span className="p-float-label">
                <InputTextarea
                  id="comment"
                  name="comment"
                  value={formik.values.comment}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // Actualiza el estado usando setOutflowData
                    setOutflowData({ ...outflowData, comment: e.target.value });
                  }}
                  onBlur={formik.handleBlur}
                  className={classNames({ 'p-invalid': isFormFieldInvalid('comment') })}
                  rows={5}
                  cols={30}
                  autoResize
                />
                <label htmlFor="comment">Comentarios</label>
              </span>
              {getFormErrorMessage('comentario')}
            </div>
            <div className="col md:col-6 lg:col-2 flex align-items-center justify-content-center mt-2 mx-auto">
              <Button
                type="button"
                className="p-button-success"
                size="small"
                label="Registrar salida"
                onClick={() => {
                  // Marcar todos los campos como tocados
                  formik.setTouched({
                    salidaNo: true,
                    fechaSalida: true,
                    proveedor: true,
                    cliente: true,
                    asigned_to: true,
                    tipo: true,
                  });

                  // Realizar la validación manualmente
                  const errors = formik.validateForm();

                  // Verificar si hay errores antes de enviar
                  if (Object.keys(errors).length === 0) {
                    formik.submitForm();
                  }
                }}
              />
            </div>
            </div>
          </form>
          </Card>
          </div>
  );
};

export default OutflowForm;
