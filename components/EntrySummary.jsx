'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable, FooterGroup } from 'primereact/datatable';
import { Column } from 'primereact/column';
import EntryProductForm from './EntryProductForm';
import { FileUpload } from 'primereact/fileupload';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { classNames } from 'primereact/utils';
import { useFormik } from 'formik';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import 'moment/locale/es';  // Importa el idioma español

import '../app/styles/styles.css'


 // Función para obtener la fecha y hora actuales
 const getCurrentDate = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

const EntrySummary = () => {
  const toast = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [entryData, setEntryData] = useState({
    entradaNo: generateEntryNo(),
    fechaEntrada: getCurrentDate(),
    proveedor: '',
    tipo: '',
    asigned_to: null,
  });



  const [products, setProducts] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const { data: session } = useSession();
  const [userList, setUserList] = useState([]);
  const created_by = session ? session.user.email : null;


  useEffect(() => {
    console.log('Información de la sesión:', session);
    console.log('Creado por:', created_by);
  }, [session, created_by]);


  console.log("creado por fuera de use: ", created_by);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/getUsers');

        console.log("Respuesta de opciones users: ", response);

        const updatedOptions = response.data.users.map(user => ({ label: user.nombre, email: user.email }));

        console.log("Updated User: ", updatedOptions);

        setUserList(updatedOptions);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);


  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSaveEntry = async () => {
    const subtotalArray = products.map((product) => calculateSubtotal(product));
    const subtotal = subtotalArray.reduce((acc, current) => acc + current, 0);
  
    const updatedEntryData = {
      ...entryData,
      products: products.map(({ subtotal, ...product }) => product), // Elimina la propiedad subtotal de cada producto
      subtotal: subtotal,
      totalCost: totalCost,
      totalQuantity: totalQuantity,
      created_by: created_by,
    };
  
    console.log('Datos que se enviarán al backend:', {
      ...updatedEntryData,
      products: updatedEntryData.products.map((product) => ({
        ...product,

      })),
    });
  
    try {
      // Envía los datos al backend usando Axios
      const response = await axios.post('/api/entries/createEntry', updatedEntryData);
  
      // Muestra una notificación de éxito
      toast.current.show({ severity: 'success', summary: 'Entrada guardada con éxito', detail: response.data.message });
  
      // Reinicia el estado del formulario
      setEntryData({
        entradaNo: generateEntryNo(),
        fechaEntrada: getCurrentDate(),
        proveedor: '',
        tipo: '',
        asigned_to: null,
      });
      setProducts([]);
      setTotalCost(0);
      setTotalQuantity(0);
    } catch (error) {
      // Maneja errores si la solicitud al backend falla
      console.error('Error al guardar la entrada:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error al guardar la entrada',
        detail: 'Por favor, inténtalo de nuevo.',
      });
    }
  };
  


  useEffect(() => {
    calculateTotal();
    calculateTotalQuantity();
  }, [products]);

  const handleDeleteProduct = (index) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts.splice(index, 1);
      return updatedProducts;
    });
    calculateTotal();
  };
  const calculateTotal = () => {
    const total = products.reduce((accumulator, product) => {
      const costo = parseFloat(product.cost) || 0;
      const cantidad = parseInt(product.quantity, 10) || 0;
      const totalPorProducto = costo * cantidad; // Nueva línea para calcular el total por producto
      return accumulator + totalPorProducto; // Actualizado para acumular el total por producto
    }, 0);
    setTotalCost(total);
  };

  const calculateSubtotal = (product) => {
    const costo = parseFloat(product.cost) || 0;
    const cantidad = parseInt(product.quantity, 10) || 0;
    return costo * cantidad;
  };
  const calculateTotalQuantity = () => {
    const quantityTotal = products.reduce((accumulator, product) => {
      const cantidad = parseInt(product.quantity, 10) || 0;
      return accumulator + cantidad;
    }, 0);
    setTotalQuantity(quantityTotal);
  };


  const handleAddProduct = (product) => {
    const cost = parseFloat(product.cost) || 0;
    const subtotal = calculateSubtotal(product);
    setProducts((prevProducts) => {
      const newProducts = [...prevProducts, { ...product, cost, subtotal }];
      console.log('Products después de agregar:', newProducts);
      return newProducts;
    });
  };

  // Función para generar el ID de entrada
  function generateEntryNo() {
    const currentYear = new Date().getFullYear();
    const initialConsecutive = 1; // Puedes ajustar según sea necesario

    // Puedes ajustar el formato del ID según tus necesidades
    const entryNumber = String(initialConsecutive).padStart(4, '0');
    return `${currentYear}-${entryNumber}`;
  }

 

  const tipoOptions = [
    { label: 'Compras', value: 'compras' },
    { label: 'Devoluciones', value: 'devoluciones' },
    { label: 'Ajuste', value: 'ajuste' },
  ];

  const customBase64Uploader = async (event) => {
    // convert file to base64 encoded
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

    reader.readAsDataURL(blob);

    reader.onloadend = function () {
      const base64data = reader.result;
    };
  };
  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer={`Total items: ${totalQuantity}`} colSpan={5} footerStyle={{ textAlign: 'right' }} />
        <Column />
        <Column colSpan={3} footer={
          <span> Total :
            <strong>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(totalCost)}
            </strong>
          </span>
        } />
      </Row>
    </ColumnGroup>
  );
  const formik = useFormik({
    initialValues: {
      value: ''
    },
    validate: (data) => {
      // ...
    },
    onSubmit: (data) => {
      // Cambia esta línea para utilizar los valores del formulario en el handleSaveEntry
      handleSaveEntry(data);
      formik.resetForm();
    }
  });

  const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
  };

  const show = (data) => {
    toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: data.value });
  };

  return (
    <div>   <h3 className='text-center mt-3'>Datos de entrada</h3>
      <Card className='flex flex-wrap mt-1'>
        <form onSubmit={formik.handleSubmit} className="flex flex-wrap gap-2 mt-2">
          <div className="p-col-12">
            <span className="p-float-label">
              <Toast ref={toast} />
              <InputText
                id="entradaNo"
                name="entradaNo"
                value={entryData.entradaNo}
                onChange={(e) => setEntryData({ ...entryData, entradaNo: e.target.value })}
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
                value={entryData.fechaEntrada}
                onChange={(e) => setEntryData({ ...entryData, fechaEntrada: e.target.value })}
                className={classNames({ 'p-invalid': isFormFieldInvalid('fechaEntrada') })}
              />
              <label htmlFor="fechaEntrada">Fecha de Entrada</label>
            </span>
            {getFormErrorMessage('fechaEntrada')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="proveedor"
                name="proveedor"
                value={entryData.proveedor || ''}
                onChange={(e) => {
                  console.log('Proveedor cambiado:', e.target.value);
                  setEntryData({ ...entryData, proveedor: e.target.value });
                }}
                className={classNames({ 'p-invalid': isFormFieldInvalid('proveedor') })}
              />

              <label htmlFor="proveedor">Proveedor</label>
            </span>
            {getFormErrorMessage('proveedor')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <Dropdown
                id="asigned_to"
                name="asigned_to"
                optionLabel="label"
                value={entryData.asigned_to}
                options={userList}
                onChange={(e) => setEntryData({ ...entryData, asigned_to: e.value })}
                placeholder="Seleccionar usuario"
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
                value={entryData.tipo}
                onChange={(e) => {
                  console.log('Tipo cambiado:', e.value);
                  setEntryData({ ...entryData, tipo: e.value });
                }}
                placeholder="Seleccionar tipo"
                className={classNames({ 'p-invalid': isFormFieldInvalid('tipo') })}
              />

              <label htmlFor="tipo">Tipo</label>
            </span>
            {getFormErrorMessage('tipo')}
          </div>

          <div className="p-col-12">
            <Button type="button" label="Crear" onClick={handleSaveEntry} />
          </div>
        </form>
      </Card>

      <Dialog visible={showForm} onHide={handleCloseForm}>
        <EntryProductForm
          onClose={handleCloseForm}
          onSave={handleSaveEntry}
          onAddProduct={handleAddProduct}
          entradaNo={entryData.entradaNo}
          onHide={handleCloseForm}
        />
      </Dialog>
      <Card className='mt-1'>

        <Button className="m-3 p-3" size="small" label='Agregar producto' onClick={handleOpenForm}>
        </Button>
        {products.length > 0 && (
          <div className='p-1'>
            <h4>Productos Agregados:</h4>
            <DataTable value={products} footerColumnGroup={footerGroup}>
              <Column field="reference" header="Referencia" />
              <Column field="serials" header="Serial" />
              <Column field="ubicacion" header="Ubicación" />
              <Column field="lote" header="Lote" />
              <Column
                field="cost"
                header="Costo"
                body={(rowData) => (
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(rowData.cost)}
                  </span>
                )}
              />
              <Column field="quantity" header="Cantidad" />
              <Column
                field="subtotal" // Nueva columna para mostrar el subtotal
                header="Subtotal"
                body={(rowData) => (
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(rowData.subtotal)}
                  </span>
                )}
              />

              <Column
                body={(rowData, column) => (
                  <Button
                    icon="pi pi-trash"
                    onClick={() => handleDeleteProduct(products.indexOf(rowData))}
                  />
                )}
              />
            </DataTable>
          </div>
        )}
      </Card>
      <Column field="lastYearSale" body={footerGroup} />
    </div>
  );
};

export default EntrySummary;


