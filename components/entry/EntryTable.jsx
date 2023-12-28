import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { EntryService } from '../../service/entryService';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import { useRouter } from 'next/navigation';


const EntryTable = () => {
  const [entries, setEntries] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [first, setFirst] = useState(0); // Para el paginador
  const [rows, setRows] = useState(10);
  const toast = useRef(null);
  const router = useRouter();

  const onRowExpand = (event) => {
    const expandedRow = { [`${event.data.entradaNo}`]: true };
    setExpandedRows((prevRows) => ({ ...prevRows, ...expandedRow }));
  };

  useEffect(() => {
    try {
      EntryService.getEntries().then((data) => {
        console.log('Datos obtenidos:', data);  // Agrega este console.log
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
            <Column field="serials" header="Serials" sortable />
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
      <Button className="p-button-success" icon="pi pi-plus" label="Registrar Entrada" onClick={() => router.push('/entradas/registro')} />
      <Button icon="pi pi-minus" label="Colapsar Todo" onClick={collapseAll} text />

    </div>
  );

  const DocumentColumn = ( data ) => {
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
        paginator // Habilitar paginador
        rows={rows} // Número de filas a mostrar por página
        totalRecords={entries.length} // Total de registros para el paginador
        onPageChange={onPageChange} // Manejador de cambio de página
      >
        <Column expander style={{ width: '3rem', fontSize: '5px' }} />
        <Column field="entradaNo" header="Entrada No." sortable />
        <Column field="fechaEntrada" header="Fecha" sortable />
        <Column field="proveedor" header="Proveedor" sortable />
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
        <Column field="cliente" header="Cliente" sortable />
        <Column field="document" header="Documento" body={DocumentColumn} sortable />
        <Column
          field="asigned_to"
          header="Responsable"
          sortable
          body={(rowData) => rowData.asigned_to.label}
        />
        <Column field="created_by" header="Creado por" sortable />
      </DataTable>

    </div>
  );
};

export default EntryTable;