'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable, FooterGroup } from 'primereact/datatable';
import { Column } from 'primereact/column';
import OutflowProductForm from '@/components/outflows/OutflowProductForm';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import OutflowForm from '../../components/outflows/OutflowForm';
import { Toast } from 'primereact/toast';
import { generateOutflowNo } from '../../service/outflowService';
import { useRouter } from 'next/navigation';
import 'moment/locale/es';
import '../../app/styles/styles.css'
import * as productService from '../../service/productService';
import { getProductByReference } from '@/service/productService'; // Reemplaza 'ruta/del/servicio' con la ruta real a tu servicio
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ProgressBar } from 'primereact/progressbar';




// Función para obtener la fecha y hora actuales
const getCurrentDate = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};
const getNewOutflow = async () => {
  try {
    const newOutflow = await generateOutflowNo();
    return newOutflow;
  } catch (error) {
    console.error('Error al obtener la nueva salida:', error);
    throw error;
  }
};
const salidaNo = getNewOutflow()

const OutflowSummary = () => {

  const toast = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outflowData, setOutflowData] = useState({
    salidaNo: salidaNo,
    fechaSalida: getCurrentDate(),
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
        const updatedOptions = response.data.users.map(user => ({ label: `${user.nombre} ${user.apellido}`, email: user.email }));
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
      const updatedQuantity = currentQuantity - enteredQuantity;

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
      // Realiza una solicitud PATCH a la API para actualizar la información del producto
      const response = await axios.patch(`/api/products/updateProductOutflow/${reference}`, updatedInfo);
  
      // Verifica si la solicitud fue exitosa y maneja según sea necesario
      if (response.status === 200) {
        // Si la actualización fue exitosa, también puedes realizar cambios en el modelo Outflow
        // Aquí, asumiré que `updatedInfo` tiene una propiedad `status` que contiene el nuevo valor
        // Puedes ajustar esto según la estructura real de `updatedInfo` y cómo planeas usarlo
  
        // Ejemplo: Si `updatedInfo.status` es "noDisponible", puedes realizar la actualización en el modelo Outflow
        if (updatedInfo.status === 'noDisponible') {
          // Encuentra la salida (Outflow) asociada al producto por su referencia
          const outflow = await Outflow.findOne({ 'products.reference': reference });
  
          // Verifica si se encontró la salida y actualiza el campo `status` en la sección `serials`
          if (outflow) {
            const productIndex = outflow.products.findIndex(product => product.reference === reference);
            
            if (productIndex !== -1) {
              // Actualiza el campo `status` en la sección `serials` del producto
              outflow.products[productIndex].serials.forEach(serial => {
                serial.status = 'noDisponible';
              });
  
              // Guarda la salida actualizada en la base de datos
              await outflow.save();
            }
          }
        }
      } else {
        console.error(`Error al actualizar el producto (Reference: ${reference}):`, response.data);
      }
    } catch (error) {
      console.error(`Error al actualizar el producto (Reference: ${reference}):`, error);
    }
  };

  const router = useRouter();


  const handleSaveOutflow = async () => {
    setLoading(true)
    if (products.length === 0) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al guardar la salida',
        detail: 'La lista de productos no puede estar vacía.',
      });
      return;
    }



    const subtotalArray = products.map((product) => calculateSubtotal(product));
    const subtotal = subtotalArray.reduce((acc, current) => acc + current, 0);
    const updatedOutflowData = {
      ...outflowData,
      salidaNo: salidaNo, // Usa el número de salida calculado
      products: products.map(({ subtotal, ...product }) => product),
      subtotal: subtotal,
      totalCost: totalCost,
      totalQuantity: totalQuantity,
      created_by: created_by,
      cliente: outflowData.cliente, // Mantén el valor de cliente
      document: outflowData.document, // Mantén el valor de document  
      comment: outflowData.comment,
      serials: outflowData.serials
    };
    // Verificar duplicados en serials antes de enviar la salida
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
            // Muestra una notificación de error y detiene la creación de la salida
            toast.current.show({
              severity: 'error',
              summary: 'Error al guardar la salida',
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
        price: product.price,
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
      const salidaNo = await generateOutflowNo();

      console.log('Datos a enviar al backend:', updatedOutflowData);
      // Envía los datos al backend usando Axios
      const response = await axios.post('/api/entries/createOutflow', {
        ...updatedOutflowData,
        salidaNo: salidaNo, // Usa el número de salida obtenido
      });
      setLoading(false);
      toast.current.show({ severity: 'success', summary: 'Entrada guardada con éxito', detail: response.data.message });
      router.push('/salidas');
      // Reinicia el estado del formulario
      setOutflowData({
        salidaNo: salidaNo, // Genera un nuevo número para la próxima salida
        fechaSalida: getCurrentDate(),
        proveedor: '',
        tipo: '',
        asigned_to: null,
        cliente: outflowData.cliente,
        document: outflowData.document,
        comment: outflowData.comment
      });
      setProducts([]);
      setTotalCost(0);
      setTotalQuantity(0);

      generatePDF({
        salidaNo: salidaNo,
        fechaSalida: updatedOutflowData.fechaSalida,
        proveedor: updatedOutflowData.proveedor,
        tipo: updatedOutflowData.tipo,
        asigned_to: updatedOutflowData.asigned_to,
        cliente: updatedOutflowData.cliente,
        totalCost: updatedOutflowData.totalCost,
        products: updatedOutflowData.products,
        comment: updatedOutflowData.comment
      });

    } catch (error) {
      setLoading(false);
      // Maneja errores si la solicitud al backend falla
      console.error('Error al guardar la salida:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error al guardar la salida',
        detail: 'Por favor, inténtalo de nuevo.',
      });
    }
  };

  // Función para generar el PDF
  const generatePDF = (outflowData) => {
    // Crear un documento PDF con orientación horizontal
    const pdfDoc = new jsPDF({ orientation: 'landscape' });

    // Establecer el tamaño de letra más pequeño
    pdfDoc.setFontSize(10);
    pdfDoc.setTextColor(0, 0, 0); // Color de texto negro

    // Sección de Información de la Entrada
    const outflowInfoLines = [
      `Entrada No: ${outflowData.salidaNo}`,
      `Fecha: ${outflowData.fechaSalida}`,
      `Proveedor: ${outflowData.proveedor.value}`,
      `Tipo: ${outflowData.tipo}`,
      `Asignado a: ${outflowData.asigned_to ? outflowData.asigned_to.label : 'N/A'}`,
      `Cliente: ${outflowData.cliente.value || 'N/A'}`,
      `Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(outflowData.totalCost)}`
    ];

    const lineHeight = 10; // Espaciado entre líneas

    outflowInfoLines.forEach((line, index) => {
      const yPosition = index * lineHeight;
      pdfDoc.text(pdfDoc.splitTextToSize(line, 190), 10, yPosition);
    });


    // Añadir la tabla de productos al PDF
    const productHeaders = ['Referencia', 'Serial', 'Ubicación', 'Lote', 'Precio', 'Cantidad', 'Subtotal'];
    const productData = outflowData.products.map(product => {
      const formattedSerials = formatSerials(product.serials);
      const formattedLote = Array.isArray(product.lote) ? product.lote.join(', ') : product.lote;
      const subtotal = calculateSubtotal(product);

      return [
        product.reference,
        formattedSerials, // Usa la variable, no la función
        product.ubicacion,
        formattedLote,
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price),
        product.quantity,
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal),
      ];
    });


    // Sección de Tabla de Productos
    pdfDoc.autoTable({
      head: [productHeaders],
      body: productData,
      startY: 70, // Ajustar la posición de inicio de la tabla
      margin: { top: 10 }, // Ajustar el margen superior
    });

    // Guardar el PDF con el nombre personalizado
    const fileName = `SalidaTHC_${outflowData.salidaNo}.pdf`;
    pdfDoc.save(fileName);
  };


  const formatSerials = (serials) => {
    if (!serials || !Array.isArray(serials)) {
      return ''; // O cualquier valor predeterminado que desees mostrar
    }

    return serials.map(serialObj => {
      const { serial, status } = serialObj;
      return `${serial} (${status})`;
    }).join(', ');
  };




  const handleDeleteProduct = (index) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts.splice(index, 1);
      return updatedProducts;
    });
    calculateTotal();
  };

  const calculateTotal = useCallback(() => {
    const total = products.reduce((accumulator, product) => {
      const price = parseFloat(product.price) || 0;
      const cantidad = parseInt(product.quantity, 10) || 0;
      const totalPorProducto = price * cantidad; // Nueva línea para calcular el total por producto
      return accumulator + totalPorProducto; // Actualizado para acumular el total por producto
    }, 0);
    setTotalCost(total);
  }, [products]);


  const calculateSubtotal = (product) => {
    const price = parseFloat(product.price) || 0;
    const cantidad = parseInt(product.quantity, 10) || 0;
    return isNaN(price) || isNaN(cantidad) ? 0 : price * cantidad;
  };
  const calculateTotalQuantity = useCallback(() => {
    const quantityTotal = products.reduce((accumulator, product) => {
      const cantidad = parseInt(product.quantity, 10) || 0;
      return accumulator + cantidad;
    }, 0);
    setTotalQuantity(quantityTotal);
  }, [products]);

  const calculateTotalCallback = useCallback(() => {
    calculateTotal();
  }, [calculateTotal]);

  const calculateTotalQuantityCallback = useCallback(() => {
    calculateTotalQuantity();
  }, [calculateTotalQuantity]);


  useEffect(() => {
    calculateTotalCallback();
    calculateTotalQuantityCallback();
  }, [products, calculateTotalCallback, calculateTotalQuantityCallback]);



  const handleAddProduct = (product) => {
    const price = parseFloat(product.price) || 0;
    const subtotal = calculateSubtotal(product);
    setProducts((prevProducts) => {
      const newProducts = [...prevProducts, { ...product, price, subtotal }];
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
    <div className='flex align-items-center justify-content-center'>
      <Card >
      <h3 className="text-center mt-1">Agrega productos</h3>

      <div className='flex align-items-center justify-content-center '>
      <i className="pi pi-arrow-right font-size: 24px"></i>
      <Button  className='flex m-3 p-3 text-center mt-1 ' size="small" label='Agregar producto' severity="help" onClick={handleOpenForm}>
      </Button>
      </div>
        <OutflowForm
          outflowData={outflowData}
          setOutflowData={setOutflowData}
          userList={userList}
          handleSaveOutflow={handleSaveOutflow}  // Pasa la función como prop
        />
   
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
                field="price"
                header="Precio"
                body={(rowData) => (
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(rowData.price)}
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
            <Dialog
              visible={loading}
              modal
              onHide={() => setLoading(false)}
              header="Procesando solicitud"
            >
              <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
            </Dialog>
          </div>
        )}
      </Card>

      <Dialog visible={showForm} onHide={handleCloseForm}>
        <OutflowProductForm
          onClose={handleCloseForm}
          onAddProduct={handleAddProduct}
          salidaNo={outflowData.salidaNo}
          onHide={handleCloseForm}
        />
      </Dialog>

      <Column field="lastYearSale" body={footerGroup} />
      <Toast ref={toast} />
    </div>
  );
};

export default OutflowSummary;


