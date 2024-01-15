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
import { generateEntryNo } from '../../service/entryService';
import { useRouter } from 'next/navigation';
import 'moment/locale/es';
import '../../app/styles/styles.css'
import * as productService from '../../service/productService';
import { getProductByReference } from '@/service/productService'; // Reemplaza 'ruta/del/servicio' con la ruta real a tu servicio
import jsPDF from 'jspdf';
import 'jspdf-autotable';



// Función para obtener la fecha y hora actuales
const getCurrentDate = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

const getNewEntry = async () => {
  try {
    const newEntry = await generateEntryNo();
    return newEntry;
  } catch (error) {
    console.error('Error al obtener la nueva entrada:', error);
    throw error;
  }
};
const entradaNo = getNewEntry()

const EntrySummary = () => {

  const toast = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [entryData, setEntryData] = useState({
    entradaNo: entradaNo,
    fechaEntrada: getCurrentDate(),
    proveedor: '',
    tipo: '',
    asigned_to: null,
    cliente: '',
    document: "",
    comment: "",
  });

  const [products, setProducts] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const { data: session } = useSession();
  const [userList, setUserList] = useState([]);
  const created_by = session ? session.user.email : null;


  useEffect(() => {

  }, [session, created_by]);




  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/getUsers');
        const updatedOptions = response.data.users.map(user => ({ label: user.nombre, email: user.email }));
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

  const handleUpdateProductQuantity = async (reference, userEnteredQuantity) => {
    try {
      const currentProduct = await productService.getProductByReference(reference);
      const currentQuantity = Number(currentProduct.quantity) || 0;
      const enteredQuantity = Number(userEnteredQuantity) || 0;
      const updatedQuantity = currentQuantity + enteredQuantity;

      await productService.updateProductQuantity(reference, updatedQuantity);
      // Actualiza la cantidad en el estado solo para el producto específico
      setProducts((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.reference === reference) {
            return { ...product, quantity: updatedQuantity };
          }
          return product;
        });
      });

    } catch (error) {
      console.error('Error al obtener o actualizar la cantidad del producto:', error);
    }
  };

  const updateProductInfo = async (reference, updatedInfo) => {
    try {
      const response = await axios.patch(`/api/products/updateProductEntry/${reference}`, updatedInfo);

      // Verifica si la solicitud fue exitosa y maneja según sea necesario
      if (response.status === 200) {

      } else {
        console.error(`Error al actualizar el producto (Reference: ${reference}):`, response.data);
      }
    } catch (error) {
      console.error(`Error al actualizar el producto (Reference: ${reference}):`, error);
    }
  };

  const router = useRouter();


  const handleSaveEntry = async () => {


    // Verifica si la lista de productos está vacía
    if (products.length === 0) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al guardar la entrada',
        detail: 'La lista de productos no puede estar vacía.',
      });
      return;
    }



    const subtotalArray = products.map((product) => calculateSubtotal(product));
    const subtotal = subtotalArray.reduce((acc, current) => acc + current, 0);
    const updatedEntryData = {
      ...entryData,
      entradaNo: entradaNo, // Usa el número de entrada calculado
      products: products.map(({ subtotal, ...product }) => product),
      subtotal: subtotal,
      totalCost: totalCost,
      totalQuantity: totalQuantity,
      created_by: created_by,
      cliente: entryData.cliente, // Mantén el valor de cliente
      document: entryData.document, // Mantén el valor de document  
      comment: entryData.comment,
      serials: entryData.serials
    };
    // Verificar duplicados en serials antes de enviar la entrada
    for (const product of products) {
      try {
        const existingProduct = await getProductByReference(product.reference);

        if (
          existingProduct &&
          (Array.isArray(product.serials) || typeof product.serials === 'string') && // Verifica si es un array o una cadena
          Array.isArray(existingProduct.serials)
        ) {
          const productSerials = Array.isArray(product.serials)
            ? product.serials
            : [product.serials]; // Convierte a array si no lo es


          // Verifica si algún serial ya existe en la base de datos
          const duplicateSerial = productSerials.find((serial) =>
            existingProduct.serials.includes(serial)
          );

         

          if (duplicateSerial) {
            // Muestra una notificación de error y detiene la creación de la entrada
            toast.current.show({
              severity: 'error',
              summary: 'Error al guardar la entrada',
              detail: `El serial '${duplicateSerial}' ya está registrado. Verifica la lista de productos.`,
            });
            return;
          }

      
        } else {
          console.error('product.serials o existingProduct.serials no es un array:', product.serials, existingProduct.serials);
          // Puedes decidir cómo manejar esta situación según tus necesidades
          return;
        }
      } catch (error) {
        // Manejar errores al obtener el producto
        console.error('Error al obtener el producto por referencia:', error);
        toast.current.show({
          severity: 'error',
          summary: 'Error al obtener el producto',
          detail: 'Por favor, inténtalo de nuevo.',
        });
        return;
      }
    }



    for (const product of products) {
      await updateProductInfo(product.reference, {
        cost: product.cost,
        ubicacion: product.ubicacion,
        exp_date: product.exp_date,
        serials: product.serials,
        lote: product.lote,
      });
    }

    for (const product of products) {
      await handleUpdateProductQuantity(product.reference, product.quantity);
    }

    try {
      const entradaNo = await generateEntryNo();

      console.log('Datos a enviar al backend:', updatedEntryData);
      // Envía los datos al backend usando Axios
      const response = await axios.post('/api/entries/createEntry', {
        ...updatedEntryData,
        entradaNo: entradaNo, // Usa el número de entrada obtenido
      });
      // Muestra una notificación de éxito
      toast.current.show({ severity: 'success', summary: 'Entrada guardada con éxito', detail: response.data.message });
      router.push('/entradas');
      // Reinicia el estado del formulario
      setEntryData({
        entradaNo: entradaNo, // Genera un nuevo número para la próxima entrada
        fechaEntrada: getCurrentDate(),
        proveedor: '',
        tipo: '',
        asigned_to: null,
        cliente: entryData.cliente,
        document: entryData.document,
        comment: entryData.comment
      });
      setProducts([]);
      setTotalCost(0);
      setTotalQuantity(0);

      generatePDF({
        entradaNo: entradaNo,
        fechaEntrada: updatedEntryData.fechaEntrada,
        proveedor: updatedEntryData.proveedor,
        tipo: updatedEntryData.tipo,
        asigned_to: updatedEntryData.asigned_to,
        cliente: updatedEntryData.cliente,
        totalCost: updatedEntryData.totalCost,
        products: updatedEntryData.products,
        comment: updatedEntryData.comment
      });

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


  // Función para generar el PDF
  const generatePDF = (entryData) => {
    // Crear un documento PDF con orientación horizontal
    const pdfDoc = new jsPDF({ orientation: 'landscape' });

    // Establecer el tamaño de letra más pequeño
    pdfDoc.setFontSize(10);
    pdfDoc.setTextColor(0, 0, 0); // Color de texto negro

    // Sección de Información de la Entrada
    const entryInfoLines = [
      `Entrada No: ${entryData.entradaNo}`,
      `Fecha: ${entryData.fechaEntrada}`,
      `Proveedor: ${entryData.proveedor}`,
      `Tipo: ${entryData.tipo}`,
      `Asignado a: ${entryData.asigned_to ? entryData.asigned_to.label : 'N/A'}`,
      `Cliente: ${entryData.cliente || 'N/A'}`,
      `Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(entryData.totalCost)}`
    ];

    const lineHeight = 10; // Espaciado entre líneas

    entryInfoLines.forEach((line, index) => {
      const yPosition = 10 + index * lineHeight;
      pdfDoc.text(pdfDoc.splitTextToSize(line, 190), 10, yPosition);
    });

    // Añadir la tabla de productos al PDF
    const productHeaders = ['Referencia', 'Serial', 'Ubicación', 'Lote', 'Costo', 'Cantidad', 'Subtotal'];
    const productData = entryData.products.map(product => {
      const subtotal = calculateSubtotal(product);
      return [
        product.reference,
        Array.isArray(product.serials) ? product.serials.join(', ') : product.serials,
        product.ubicacion,
        Array.isArray(product.lote) ? product.lote.join(', ') : product.lote,
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.cost),
        product.quantity,
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal),
      ];
    });

    // Sección de Tabla de Productos
    pdfDoc.autoTable({
      head: [productHeaders],
      body: productData,
      startY: 120, // Ajustar la posición de inicio de la tabla
      margin: { top: 10 }, // Ajustar el margen superior
    });

    // Guardar el PDF con el nombre personalizado
    const fileName = `EntradaTHC_${entryData.entradaNo}.pdf`;
    pdfDoc.save(fileName);
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
    return isNaN(costo) || isNaN(cantidad) ? 0 : costo * cantidad;
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
      return newProducts;
    });
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
              <Column
                header="Serial"
                body={(rowData) => (
                  <span>
                    {rowData.serials.map((serial) => (
                      <div key={serial.serial}>
                        {`Serial: ${serial.serial}, Status: ${serial.status}`}
                      </div>
                    ))}
                  </span>
                )}
              />
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


