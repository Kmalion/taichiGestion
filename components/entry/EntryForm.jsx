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


const EntryForm = ({ entryData, setEntryData, userList, handleSaveEntry }) => {
  const toast = useRef(null);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]); 
  const [loading, setLoading] = useState(false);



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
  

  const loadAsignedToOptions = async () => {
    try {
      // Lógica para obtener los datos desde el servidor, por ejemplo, mediante una solicitud HTTP
      const response = await axios.get('/api/asignedTo/getAsignedToOptions');
      const data = response.data;

      // Actualiza el estado con los datos obtenidos
      setTipoOptions(data);
    } catch (error) {
      console.error('Error al obtener opciones de "Asignado a":', error);
      // Manejar el error según tus necesidades
    }
  };



  const formik = useFormik({
    initialValues: {
      entradaNo: entryData.entradaNo || '',
      fechaEntrada: entryData.fechaEntrada || '',
      proveedor: entryData.proveedor || '',
      cliente: entryData.cliente || '',
      asigned_to: entryData.asigned_to || null,
      tipo: entryData.tipo || null,
      document: entryData.document || '',
      comment: entryData.comment || '',
    },
    validate: (data) => {
      const errors = {};

      if (!data.entradaNo.trim()) {
        errors.entradaNo = 'Entrada No. es requerido';
      }

      if (!data.fechaEntrada.trim()) {
        errors.fechaEntrada = 'Fecha de Entrada es requerido';
      }


      if (data.tipo === 'devoluciones' && !data.cliente.trim()) {
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
      // Agrega la propiedad 'comment' a data antes de llamar a handleSaveEntry
      const dataWithComment = { ...data, comment: formik.values.comentario };
      handleSaveEntry(dataWithComment);
      formik.resetForm();
    },
  });
  
  useEffect(() => {
    // Cargar los datos de "Asignado a" al montar el componente
    loadAsignedToOptions();
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
        setEntryData({ ...entryData, document: fileUrl });

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

  useEffect(() => {
    // Actualiza el valor de entradaNo cuando cambia entryData
    if (entryData.entradaNo instanceof Promise) {
      entryData.entradaNo.then((resolvedValue) => {
        formik.setFieldValue('entradaNo', resolvedValue);
      });
    } else {
      formik.setFieldValue('entradaNo', entryData.entradaNo || '');
    }
  }, [entryData]);

  const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const tipoOptions = [
    { label: 'Compras', value: 'compras' },
    { label: 'Devoluciones', value: 'devoluciones' },
    { label: 'Ajuste', value: 'ajuste' },
  ];
  return (
    <div>
      <h3 className="text-center mt-3">Datos de entrada</h3>
      <Card className="flex flex-wrap mt-1">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-wrap gap-2 mt-2">
          <div className="p-col-12">
            <span className="p-float-label">
              <Toast ref={toast} />
              <InputText
                id="entradaNo"
                name="entradaNo"
                value={formik.values.entradaNo}
                readOnly
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('entradaNo') })}
              />
              <label htmlFor="entradaNo">Entrada No.</label>
            </span>
            {getFormErrorMessage('entradaNo')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="fechaEntrada"
                name="fechaEntrada"
                value={formik.values.fechaEntrada}
                readOnly
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('fechaEntrada') })}
              />
              <label htmlFor="fechaEntrada">Fecha de Entrada</label>
            </span>
            {getFormErrorMessage('fechaEntrada')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <AutoComplete
                id="proveedor"
                name="proveedor"
                value={formik.values.proveedor || ''}
                suggestions={filteredProviders}
                completeMethod={searchProviders}
                field="label"
                onChange={(e) => {
                  setEntryData({ ...entryData, proveedor: e.value });
                  formik.handleChange({ target: { name: 'proveedor', value: e.value } });
                }}
                onBlur={formik.handleBlur}
                placeholder="Seleccionar proveedor"
                filter
                className={classNames({ 'p-invalid': isFormFieldInvalid('proveedor') })}
              />
              <label htmlFor="proveedor">Proveedor</label>
            </span>
            {getFormErrorMessage('proveedor')}
          </div>`

          <div className="p-col-12">
  <span className="p-float-label">
    <AutoComplete
      id="cliente"
      name="cliente"
      value={formik.values.cliente || ''}
      suggestions={filteredClients}
      completeMethod={searchClients}
      field="label" 
      onChange={(e) => {
        setEntryData({ ...entryData, cliente: e.value });
        formik.handleChange({ target: { name: 'cliente', value: e.value } });
      }}
      onBlur={formik.handleBlur}
      placeholder="Seleccionar cliente"
      filter
      className={classNames({ 'p-invalid': isFormFieldInvalid('cliente') })}
    />
    <label htmlFor="cliente">Cliente</label>
  </span>
  {getFormErrorMessage('cliente')}
</div>

    <div className="p-col-12">
            <span className="p-float-label">
              <Dropdown
                id="asigned_to"
                name="asigned_to"
                optionLabel="label"
                value={formik.values.asigned_to}
                options={userList}
                onChange={(e) => {
                  setEntryData({ ...entryData, asigned_to: e.value });
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                placeholder="Seleccionar usuario"
                onShow={loadAsignedToOptions}  // Llama a la función solo para el Dropdown de "Asignado a"
                className={classNames({ 'p-invalid': isFormFieldInvalid('asigned_to') })}
              />
              <label htmlFor="asigned_to">Asignado a</label>
            </span>
            {getFormErrorMessage('asigned_to')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <Dropdown
                id="tipo"
                name="tipo"
                options={tipoOptions}
                value={formik.values.tipo}
                onChange={(e) => {
                  setEntryData({ ...entryData, tipo: e.value });
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
          <div className="p-col-12">
            <span className="p-float-label">
              <FileUpload
                mode="basic"
                accept="image/*,application/pdf"
                maxFileSize={1000000}
                customUpload
                uploadHandler={onUpload}
                className="p-inputtext p-d-block"
                chooseLabel="Seleccionar Archivo"
              />
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputTextarea
                id="comment"
                name="comment"
                value={formik.values.comment}
                onChange={(e) => {
                  formik.handleChange(e);
                  // Actualiza el estado usando setEntryData
                  setEntryData({ ...entryData, comment: e.target.value });
                }}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('comment') })}
                rows={5}
                cols={60}
                autoResize
              />
              <label htmlFor="comment">Comentarios</label>
            </span>
            {getFormErrorMessage('comentario')}
          </div>
          <div className="p-col-12">
            <Button
              type="button"
              className="p-button-success m-3 p-3"
              size="small"
              label="Registrar entrada"
              onClick={() => {
                // Marcar todos los campos como tocados
                formik.setTouched({
                  entradaNo: true,
                  fechaEntrada: true,
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
        </form>
      </Card>
    </div>
  );
};

export default EntryForm;
