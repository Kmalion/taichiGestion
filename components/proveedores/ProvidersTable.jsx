'use client'
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import ProviderService from '@/service/providerService'; // Asegúrate de tener tu servicio de proveedores

const ProvidersTable = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);

  // Ref para el Toast
  const toast = useRef(null);

  useEffect(() => {
    ProviderService.getProviders()
      .then((data) => setProviders(data))
      .catch((error) => console.error('Error al obtener proveedores:', error));
  }, []);

  const handleEdit = (provider) => {
    setSelectedProvider(provider);
    setEditFormVisible(true);
  };

  const handleDelete = (provider) => {
    setSelectedProvider(provider);
    setDeleteConfirmationVisible(true);
  };

  // Resto del código de manejo de edición y eliminación similar al de ClientTable

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('es-ES', options);
    return formattedDate;
  };
  
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {isAdminOrPremium && (
          <div className=" flex justify-content-center mt-4">
            <Button
              icon="pi pi-pencil"
              rounded
              outlined
              className="p-button-sm mr-2" // Agregado p-button-sm para hacerlo más pequeño
              onClick={() => handleEdit(rowData)}
              style={{ fontSize: '0.875rem' }} // Establecer el tamaño del texto según tus preferencias
            />
            <Button
              icon="pi pi-trash"
              rounded
              outlined
              severity="danger"
              className="p-button-sm"
              onClick={() => handleDelete(rowData)}
              style={{ fontSize: '0.875rem' }}
            />

          </div>
        )}
      </React.Fragment>
    );
  };
  return (
    <div>
      {/* Código similar al de ClientTable, adaptado para ProvidersTable */}
      <DataTable value={providers} className='mt-4' selectionMode="single" selection={selectedProvider} onSelectionChange={(e) => setSelectedProvider(e.value)}>
        <Column field="idp" header="ID Proveedor"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <Column field="contacto" header="Contacto"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="telefono" header="Teléfono"></Column>
        <Column field="direccion" header="Dirección"></Column>
        <Column field="ciudad" header="Ciudad"></Column>
        <Column field="created" header="Fecha de Creación" body={(rowData) => formatDate(rowData.created)}></Column>
        <Column body={actionBodyTemplate}></Column>
      </DataTable>

      <Toast ref={toast} />
    </div>
  );



};

export default ProvidersTable;
