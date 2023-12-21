'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable, FooterGroup } from 'primereact/datatable';
import { Column } from 'primereact/column';
import EntryProductForm from './EntryProductForm';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import EntryForm from './EntryForm';
import { Toast } from 'primereact/toast';
import 'moment/locale/es';
import '../../app/styles/styles.css'


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
    cliente: ''
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


  const show = (data) => {
    toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: data.value });
  };

  return (
    <div>
      <Card className='flex flex-wrap mt-1'>
        <EntryForm
          entryData={entryData}
          setEntryData={setEntryData}
          userList={userList}
          handleSaveEntry={handleSaveEntry}  // Pasa la función como prop
        />
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

      <Dialog visible={showForm} onHide={handleCloseForm}>
        <EntryProductForm
          onClose={handleCloseForm}
          onSave={handleSaveEntry}
          onAddProduct={handleAddProduct}
          entradaNo={entryData.entradaNo}
          onHide={handleCloseForm}
        />
      </Dialog>
      <Column field="lastYearSale" body={footerGroup} />
      <Toast ref={toast} />
    </div>
  );
};

export default EntrySummary;


