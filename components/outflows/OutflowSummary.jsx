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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ProgressBar } from 'primereact/progressbar';




// Función para obtener la fecha y hora actuales
const getCurrentDate = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};


const OutflowSummary = () => {

  const toast = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outflowData, setOutflowData] = useState({
    salidaNo: '',
    fechaSalida: getCurrentDate(),
    proveedor: '',
    tipo: '',
    asigned_to: null,
    cliente: '',
    document: "",
    comment: "",
  });

  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const { data: session } = useSession();
  const [userList, setUserList] = useState([]);
  const created_by = session ? session.user.email : null;


  useEffect(() => {

  }, [session, created_by]);




  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleUpdateProductQuantity = async (reference, userEnteredQuantity) => {
    try {
      console.log("Referencia: ", reference)
      const currentProduct = await productService.getProductByReference(reference);
      const currentQuantity = Number(currentProduct.quantity) || 0;
      const enteredQuantity = Number(userEnteredQuantity) || 0;
      const updatedQuantity = currentQuantity - enteredQuantity;

      console.log("Cantidad actualizada: ", updatedQuantity)

      await productService.updateProductQuantityOutflow(reference, updatedQuantity);

      // Actualiza la cantidad en el estado solo para el producto específico
      setProducts((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.reference.value === reference) {
            return { ...product, quantity: updatedQuantity };
          }
          return product;
        });
      });

      // Muestra un Toast de éxito usando toast.current.show
      toast.current.show({
        severity: 'success',
        summary: 'Cantidad del producto actualizada con éxito',
        detail: '', // Puedes personalizar el detalle según sea necesario
      });
    } catch (error) {
      console.error('Error al obtener o actualizar la cantidad del producto:', error);

      // Muestra un Toast de error usando toast.current.show
      toast.current.show({
        severity: 'error',
        summary: 'Error al actualizar la cantidad del producto',
        detail: error.response && error.response.status === 400
          ? error.response.data  // Muestra el mensaje personalizado del backend
          : `Error: ${error.message}`,  // Muestra el mensaje genérico si no hay mensaje personalizado
      });
      return;
    }
  };


  const updateProductInfo = async (reference, updatedInfo) => {
    try {
      console.log("Informacion actualizada: ", updatedInfo)
      console.log("Referencia en actualizar producto", reference)
      const response = await axios.patch(`/api/products/updateProductOutflow/${reference}`, updatedInfo);

      // Verifica si la solicitud fue exitosa y maneja según sea necesario
      if (response.status === 200) {

        if (updatedInfo.status === 'noDisponible') {
          // Encuentra la salida (Outflow) asociada al producto por su referencia
          const outflow = await outflow.findOne({ 'products.reference': reference });

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
      return;
    }
  };

  const router = useRouter();


  const handleSaveOutflow = async () => {
    console.log("Productos en salida: ", products)
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

    const updatedProducts = products.map(({ subtotal, ...product }) => {
      return {
          ...product,
          reference: product.reference.value, // Asignar solo el valor de reference
      };
  });

    const updatedOutflowData = {
      ...outflowData,
      salidaNo: salidaNo, // Usa el número de salida calculado
      products: updatedProducts,
      subtotal: subtotal,
      totalPrice: totalPrice,
      totalQuantity: totalQuantity,
      created_by: created_by,
      cliente: outflowData.cliente, // Mantén el valor de cliente
      document: outflowData.document, // Mantén el valor de document  
      comment: outflowData.comment,
    };
    // Verificar duplicados en serials antes de enviar la salida

    try {
      // Primer bloque de código
      for (const product of updatedProducts) {
        if (outflowData.tipo === 'demostracion') {
            // Si el tipo es demostración, marca el serial como noDisponible
            product.serials.forEach((serial) => {
                serial.status = 'noDisponible';
            });
        } else if (outflowData.tipo === 'facturado' || outflowData.tipo === 'ajuste') {
            // Si el tipo es facturado o ajuste, elimina el serial específico del producto
            const updatedSerials = product.serials.filter((serial) => {
                // Filtra el serial que se debe eliminar, basándote en alguna condición
                // Por ejemplo, si hay una propiedad 'selected' que indica si el serial fue seleccionado
                return !serial.selected;
            });
            product.serials = updatedSerials;
        }

        // Actualiza la información del producto en la base de datos
        await updateProductInfo(product.reference, {
            price: product.price,
            serials: product.serials,
            lotes: product.lotes,
        });

        // Actualiza la cantidad del producto en la base de datos
        await handleUpdateProductQuantity(product.reference, product.quantity);
    }

    

    } catch (error) {
      // Maneja errores si alguna de las operaciones anteriores falla
      console.error('Error al actualizar productos:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error al actualizar productos',
        detail: 'Por favor, inténtalo de nuevo.',
      });
      setLoading(false); // Asegúrate de ajustar el estado según tus necesidades
      return; // Detiene la ejecución del resto del código
    }

    try {
      const salidaNo = await generateOutflowNo();

      console.log('Datos a enviar al backend:', updatedOutflowData);
      // Envía los datos al backend usando Axios
      const response = await axios.post('/api/outflows/createOutflow', {
        ...updatedOutflowData,
        salidaNo: salidaNo, // Usa el número de salida obtenido
      });
      setLoading(false);
      toast.current.show({ severity: 'success', summary: 'Salida guardada con éxito', detail: response.data.message });
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
      setTotalPrice(0);
      setTotalQuantity(0);

      generatePDF({
        salidaNo: salidaNo,
        fechaSalida: updatedOutflowData.fechaSalida,
        proveedor: updatedOutflowData.proveedor,
        tipo: updatedOutflowData.tipo,
        asigned_to: updatedOutflowData.asigned_to,
        cliente: updatedOutflowData.cliente,
        totalPrice: updatedOutflowData.totalPrice,
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
      return;
    }
  };

  // Función para generar el PDF
  const generatePDF = (outflowData) => {
    // Crear un documento PDF con orientación horizontal
    const pdfDoc = new jsPDF({ orientation: 'landscape' });

    // Establecer el tamaño de letra más pequeño
    pdfDoc.setFontSize(10);
    pdfDoc.setTextColor(0, 0, 0); // Color de texto negro

    // Sección de Información de la Salida
    const outflowInfoLines = [
      `Salida No: ${outflowData.salidaNo}`,
      `Fecha: ${outflowData.fechaSalida}`,
      `Proveedor: ${outflowData.proveedor.value || 'N/A'}`,
      `Tipo: ${outflowData.tipo}`,
      `Asignado a: ${outflowData.asigned_to ? outflowData.asigned_to.label : 'N/A'}`,
      `Cliente: ${outflowData.cliente.value || 'N/A'}`,
      `Total: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(outflowData.totalPrice)}`
    ];

    const lineHeight = 10; // Espaciado entre líneas

    outflowInfoLines.forEach((line, index) => {
      const yPosition = index * lineHeight;
      pdfDoc.text(pdfDoc.splitTextToSize(line, 190), 10, yPosition);
    });


    // Añadir la tabla de productos al PDF
    const productHeaders = ['Referencia', 'Serial', 'Lotes', 'Precio', 'Cantidad', 'Subtotal'];
    const productData = outflowData.products.map(product => {
      const formattedSerials = formatSerials(product.serials);
      const formattedLotes = formatLotes(product.lotes);
      const subtotal = calculateSubtotal(product);

      return [
        product.reference,
        formattedSerials,
        formattedLotes,
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(product.price),
        product.quantity,
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(subtotal),
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
    console.log("Seriales a visualizar: ", serials)
    if (!serials || !Array.isArray(serials)) {

      return '';
    }

    return serials.map(serialObj => `${serialObj.label} (${serialObj.status})`).join(', ');
  };

  const formatLotes = (lotes) => {
    console.log("Lotes a visualizar: ", lotes)
    if (!lotes || !Array.isArray(lotes)) {

      return '';
    }

    return lotes.map(loteObj => `${loteObj.label} (${loteObj.status})`).join(', ');
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
    setTotalPrice(total);
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
    console.log("Productos agregados: ", product)
    const price = parseFloat(product.price) || 0;
    const subtotal = calculateSubtotal(product);

    // Actualiza el estado de los productos
    setProducts((prevProducts) => {
      const newProducts = [...prevProducts, { ...product, price, subtotal }];
      console.log("Productos muevos agregados: ", newProducts)
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
              {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'COP',
              }).format(totalPrice)}
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
          <Button className='flex m-3 p-3 text-center mt-1 ' size="small" label='Agregar producto' severity="help" onClick={handleOpenForm}>
          </Button>
        </div>
        <OutflowForm
          outflowData={outflowData}
          setOutflowData={setOutflowData}
          handleSaveOutflow={handleSaveOutflow}  // Pasa la función como prop
        />

        <DataTable value={products}  responsive="true" footerColumnGroup={footerGroup}>
          <Column field="reference.label" header="Referencia" />
          <Column
            field="serials"
            header="Serials"
            body={(rowData) => (
              <ul>
                <li>
                  <strong>Serials:</strong> {formatSerials(rowData.serials)}
                </li>
              </ul>
            )}
          />
          <Column field="ubicacion" header="Ubicación" />
          <Column
            field="lotes"
            header="Lotes"
            body={(rowData) => (
              <ul>
                <li>
                  <strong>Lotes:</strong> {formatLotes(rowData.lotes)}
                </li>
              </ul>
            )}
          />
          <Column
            field="price"
            header="Precio"
            body={(rowData) => (
              <span>
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'COP',
                }).format(rowData.price)}
              </span>
            )}
          />
          <Column field="quantity" header="Cantidad" />
          <Column
            field="subtotal"
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
        
      </Card>

      <Column field="lastYearSale" body={footerGroup} />
      <Dialog
        visible={loading}
        modal
        onHide={() => setLoading(false)}
        header="Procesando solicitud"
      >
        <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
      </Dialog>
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


