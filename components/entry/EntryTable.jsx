import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { EntryService } from '../../service/entryService';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { deleteSerialFromProduct, getProductByReference } from '@/service/productService'
import { updateProductQuantity } from '@/service/productService';
import { useSession } from 'next-auth/react';



const EntryTable = () => {
  const [commentDialogVisible, setCommentDialogVisible] = useState(false);
  const [selectedEntryComment, setSelectedEntryComment] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedEntryToDelete, setSelectedEntryToDelete] = useState(null);
  const [entries, setEntries] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [first, setFirst] = useState(0); // Para el paginador
  const [rows, setRows] = useState(10);
  const toast = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();

  const isAdminPremium = session?.user?.role === 'admin' || session?.user?.role === 'premium';



  const onRowExpand = (event) => {
    const expandedRow = { [`${event.data.entradaNo}`]: true };
    setExpandedRows((prevRows) => ({ ...prevRows, ...expandedRow }));
  };

  useEffect(() => {
    try {
      EntryService.getEntries().then((data) => {

        setEntries(data);
      });
    } catch (error) {
      console.error('Error al obtener las entradas:', error);
    }
  }, []);


  const onRowCollapse = (event) => {
    const expandedRow = { [`${event.data.entradaNo}`]: false };
    setExpandedRows((prevRows) => ({ ...prevRows, ...expandedRow }));
  };
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const expandAll = () => {
    let _expandedRows = {};

    if (entries && entries.length > 0) {
      entries.forEach((entry) => {
        _expandedRows[`${entry.entradaNo}`] = true;
      });
    }

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const showCommentDialog = (comment) => {
    setSelectedEntryComment(comment);
    setCommentDialogVisible(true);
  };

  const hideCommentDialog = () => {
    setCommentDialogVisible(false);
  };

  const confirmDeleteEntry = (entry) => {
    setSelectedEntryToDelete(entry);
    setConfirmDialogVisible(true);
  };


  const hideConfirmDialog = () => {
    // Oculta el cuadro de diálogo de confirmación
    setConfirmDialogVisible(false);
  };

  const onConfirmDelete = () => {
    // Lógica para confirmar la eliminación
    if (selectedEntryToDelete) {
      deleteEntry(selectedEntryToDelete);
    }

    // Oculta el cuadro de diálogo después de la acción
    hideConfirmDialog();
  };

  const deleteEntry = async (entry) => {
    try {
      // Verifica si hay productos
      if (!entry || !entry.products || entry.products.length === 0) {
        console.warn("La entrada no tiene productos o es undefined.");
        // Puedes manejar esta situación según tus necesidades
      } else {
        // Itera sobre los productos de la entrada
        for (const product of entry.products) {
       

          // Verifica si hay seriales en el producto
          if (!product || !product.serials || product.serials.length === 0) {
            console.warn("El producto no tiene seriales o es undefined.");
            // Puedes manejar esta situación según tus necesidades
          } else {
            try {
              // Obtiene la cantidad anterior del producto
              const oldProduct = await getProductByReference(product.reference);
              const oldQuantity = oldProduct.quantity;
              

              // Calcula la nueva cantidad restando la cantidad de la entrada
              const newQuantity = oldQuantity - product.quantity;
              

              for (const serial of product.serials) {
                

                try {
                  // Llama a la función para eliminar el serial, lote y ubicación
                  await deleteSerialFromProduct(product.reference, serial.serial, product.lote, product.ubicacion);
                  

                  // Actualiza la cantidad de producto existente utilizando la nueva cantidad calculada
                  await updateProductQuantity(product.reference, newQuantity);
                } catch (error) {
                
                  // Puedes manejar el error según tus necesidades
                }
              }
            } catch (error) {
              console.error('Error al obtener la información del producto:', error);
              // Puedes manejar el error según tus necesidades
            }
          }
        }
      }

      // Elimina la entrada
      await EntryService.deleteEntry(entry.entradaNo);

      // Muestra un mensaje de éxito con Toast
      toast.current.show({
        severity: 'success',
        summary: 'Entrada eliminada',
        detail: `La entrada No. ${entry.entradaNo} ha sido eliminada exitosamente.`,
      });

      // Actualiza la lista de entradas después de la eliminación
      setEntries((prevEntries) => prevEntries.filter((e) => e.entradaNo !== entry.entradaNo));

      // Cierra el cuadro de diálogo de confirmación si se utiliza una referencia
      hideConfirmDialog();
    } catch (error) {
      console.error('Error al eliminar la entrada:', error);

      // Muestra un mensaje de error con Toast si la eliminación falla
      toast.current.show({
        severity: 'error',
        summary: 'Error al eliminar la entrada',
        detail: 'Hubo un problema al eliminar la entrada. Por favor, inténtalo de nuevo.',
      });
    }
  };


  const commentColumn = (rowData) => (
    <Button
      icon="pi pi-eye"
      onClick={() => showCommentDialog(rowData.comment)}
      className="p-button-text p-button-rounded"
      disabled={!rowData.comment}
    />
  );

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getEntrySeverity(rowData)}></Tag>;
  };

  const getEntrySeverity = (entry) => {
    switch (entry.status) {
      case 'APPROVED':
        return 'success';

      case 'PENDING':
        return 'warning';

      case 'REJECTED':
        return 'danger';

      default:
        return null;
    }
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h5>Detalles de la Entrada No. {data.entradaNo}</h5>
        {data.products && data.products.length > 0 ? (
          <DataTable value={data.products}>
            <Column field="reference" header="Referencia" sortable />
            <Column field="quantity" header="Cantidad" sortable />
            <Column field="cost" header="Costo" sortable />
            <Column
              field="serials"
              header="Serials"
              body={(rowData) => (
                <ul>
                  {rowData.serials.map((serialData, index) => (
                    <li key={index}>
                      <strong>Serial:</strong> {serialData.serial}, <strong>Status:</strong> {serialData.status}
                    </li>
                  ))}
                </ul>
              )}
            />
            <Column field="lote" header="Lote" sortable />
            <Column field="ubicacion" header="Ubicación" sortable />
            <Column
              field="exp_date"
              header="Fecha de Expiración"
              sortable
              body={(rowData) => (
                <span>
                  {rowData.exp_date
                    ? new Intl.DateTimeFormat('es-ES', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    }).format(new Date(rowData.exp_date))
                    : ''}
                </span>
              )}
            />

            {/* Agrega más columnas según las propiedades de tus productos */}
          </DataTable>
        ) : (
          <p>No hay productos asociados a esta entrada.</p>
        )}
      </div>
    );
  };



  const header = (
  <div className="flex flex-wrap justify-content-between">
    <Button 
      className="p-button-success" 
      icon="pi pi-plus" 
      label="Registrar Entrada" 
      onClick={() => router.push('/entradas/registro')} 
      disabled={!isAdminPremium}  // Deshabilita el botón si no es admin o premium
    />
    <Button icon="pi pi-minus" label="Colapsar Todo" onClick={collapseAll} text />
  </div>
);

  const DocumentColumn = (data) => {
    const handleDownload = () => {
      // Verifica si la propiedad 'document' está definida en data y no es vacía
      if (data && data.document && data.document.trim() !== '') {
        // Redirige a la URL del documento para descargarlo
        window.location.href = data.document;
      } else {
        console.error('No se pudo encontrar la URL del documento o está vacía');
        // Puedes mostrar una notificación al usuario indicando que no se puede descargar el documento
      }
    };

    return (
      <Button
        icon="pi pi-download"
        onClick={handleDownload}
        className="p-button-text p-button-rounded"
        disabled={!data || !data.document || data.document.trim() === ''}
      />
    );
  };
  const renderProveedor = (proveedor) => {
    if (typeof proveedor === 'string') {
      // Si es una cadena (valor anterior), simplemente muéstrala
      return proveedor;
    } else if (typeof proveedor === 'object') {
      // Si es un objeto, probablemente un objeto con label y value
      return proveedor.label || 'N/A'; // Puedes ajustar esto según tus necesidades
    } else {
      // Otros tipos o valores inesperados
      return 'N/A';
    }
  };
  const renderCliente = (cliente) => {
    if (typeof cliente === 'string') {
      // Si es una cadena (valor anterior), simplemente muéstrala
      return cliente;
    } else if (typeof cliente === 'object') {
      // Si es un objeto, probablemente un objeto con label y value
      return cliente.label || 'N/A'; // Puedes ajustar esto según tus necesidades
    } else {
      // Otros tipos o valores inesperados
      return 'N/A';
    }
  };

  const deleteButtonColumn = (rowData) => (
    <Button
      icon="pi pi-trash"
      onClick={() => confirmDeleteEntry(rowData)}
      className="p-button-text p-button-rounded p-button-danger"
    />
  );


  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        value={entries.slice(first, first + rows)} // Aplicar la paginación
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="entradaNo"
        header={header}
        tableStyle={{ minWidth: '60rem' }}
        rows={rows} // Número de filas a mostrar por página
        totalRecords={entries.length} // Total de registros para el paginador
        onPageChange={onPageChange} // Manejador de cambio de página
      >
        <Column expander style={{ width: '3rem', fontSize: '5px' }} />
        <Column field="entradaNo" header="Entrada No." sortable />
        <Column field="fechaEntrada" header="Fecha" sortable />
        <Column field="proveedor" header="Proveedor" sortable body={(rowData) => renderProveedor(rowData.proveedor)} />
        <Column field="tipo" header="Tipo" sortable />
        <Column
          field="totalCost"
          header="Costo Total"
          sortable
          body={(rowData) => (
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(rowData.totalCost)}
            </span>
          )}
        />
        <Column field="totalQuantity" header="Cantidad Total" sortable />
        <Column field="cliente" header="Cliente" sortable body={(rowData) => renderCliente(rowData.cliente)} />
        <Column field="document" header="Documento" body={DocumentColumn} sortable />
        <Column field="comment" header="Comentario" body={commentColumn} sortable />
        <Column
          field="asigned_to"
          header="Responsable"
          sortable
          body={(rowData) => rowData.asigned_to.label}
        />
        <Column field="created_by" header="Creado por" sortable />
        <Column body={deleteButtonColumn} />
      </DataTable>
      <Dialog
        visible={confirmDialogVisible}
        onHide={hideConfirmDialog}
        header="Confirmar Eliminación"
        modal
        footer={
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={hideConfirmDialog} className="p-button-text" />
            <Button label="Confirmar" icon="pi pi-check" onClick={onConfirmDelete} autoFocus />
          </div>
        }
      >
        <div>
          ¿Estás seguro de que deseas eliminar la entrada No. {selectedEntryToDelete?.entradaNo}?
        </div>
      </Dialog>
      <Paginator
        first={first}
        rows={rows}
        totalRecords={entries.length}
        onPageChange={onPageChange}
      />
      <Dialog
        visible={commentDialogVisible}
        onHide={hideCommentDialog}
        header="Comentario"
        modal
        style={{ width: '30vw' }}
      >
        <div>{selectedEntryComment}</div>
      </Dialog>
    </div>
  );
};

export default EntryTable;