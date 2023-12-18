'use client'
import React, { useState, useEffect } from 'react';
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
import '../app/styles/styles.css'



const EntrySummary = () => {
  const [showForm, setShowForm] = useState(false);
  const [entryData, setEntryData] = useState({
    entradaNo: generateEntryNo(),
    fechaEntrada: getCurrentDate(),
    clienteProveedor: '',
    tipo: '',
  });

  const [products, setProducts] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);



  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSaveEntry = (entryForm) => {
    setEntryData((prevEntryData) => {
      const updatedEntryData = {
        ...prevEntryData,
        clienteProveedor: entryForm.clienteProveedor,
        tipo: entryForm.tipo,
        products: [...products],
        totalCost: totalCost,
        totalQuantity: totalQuantity,
      };
      console.log('EntryData después de guardar la entrada:', updatedEntryData);
      return updatedEntryData;
    });
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
      return accumulator + costo;
    }, 0);
    setTotalCost(total);
  };
  const calculateTotalQuantity = () => {
    const quantityTotal = products.reduce((accumulator, product) => {
      const cantidad = parseInt(product.quantity, 10) || 0;
      return accumulator + cantidad;
    }, 0);
    setTotalQuantity(quantityTotal);
  };


  const handleAddProduct = (product) => {
    const costo = parseFloat(product.cost) || 0;
    setProducts((prevProducts) => {
      const newProducts = [...prevProducts, { ...product, costo }];
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

  // Función para obtener la fecha y hora actuales
  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
        <Column footer="Total:" colSpan={3} footerStyle={{ textAlign: 'right' }} />
        <Column
          footer={() => (
            <span>
              <strong>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(totalCost)}
              </strong>
            </span>
          )}
        />
        <Column footer={totalQuantity} />
      </Row>
    </ColumnGroup>
  );

  return (
    <div>
      <Card className='flex flex-wrap mt-1'>
        <h3 className='text-center'>Datos de entrada</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSaveEntry(entryData);
        }}>
          <div className="flex flex-column lg:flex-row">
            <div className="p-2">
              <label htmlFor="entradaNo">Entrada No.:</label>
              <InputText id="entradaNo" name="entradaNo" value={entryData.entradaNo} readOnly />
            </div>
            <div className="p-2">
              <label htmlFor="fechaEntrada">Fecha de Entrada:</label>
              <InputText id="fechaEntrada" name="fechaEntrada" value={entryData.fechaEntrada} readOnly />
            </div>
            <div className="p-2">
              <label htmlFor="clienteProveedor">Cliente/Proveedor:</label>
              <InputText
                id="clienteProveedor"
                name="clienteProveedor"
                value={entryData.clienteProveedor || ''}
                onChange={(e) => setEntryData({ ...entryData, clienteProveedor: e.target.value })}
              />
            </div>
            <div className="p-2">
              <label htmlFor="tipo">Tipo:</label>
              <Dropdown
                id="tipo"
                name="tipo"
                options={tipoOptions}
                value={entryData.tipo}
                onChange={(e) => setEntryData({ ...entryData, tipo: e.value })}
                placeholder="Seleccionar tipo"
              />
            </div>
            <div className="flex justify-content-end mt-4 p-2">
              <FileUpload
                mode="basic"
                name="demo[]"
                url="/api/upload"
                accept="image/*"
                customUpload
                uploadHandler={customBase64Uploader}
                chooseLabel="Subir Soporte"
              />
            </div>
            <div className='flex justify-content-end mt-4 p-2'>
              <Button
                className='p-button-success' size="small"
                label='Registrar Entrada'
                icon='pi pi-check'
                onClick={() => handleSaveEntry(entryData)}
              />
            </div>
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
