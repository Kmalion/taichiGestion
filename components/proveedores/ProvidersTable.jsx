'use client'
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import EditProviderForm from '@/components/proveedores/EditProviderForm'
import { Toast } from 'primereact/toast';
import ProviderService from '@/service/providerService';
import { useSession } from 'next-auth/react';
import { Dialog } from 'primereact/dialog';

const ProvidersTable = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const { data: session } = useSession();

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

  const handleEditFormClose = () => {
    setEditFormVisible(false);
    // Puedes realizar otras acciones después de cerrar el formulario si es necesario
  };

  const handleSaveEditForm = async (formData) => {
    try {
      // Actualiza el proveedor utilizando el servicio
      await ProviderService.updateProvider(selectedProvider.idp, formData);
  
      // Refresca la lista de proveedores después de la actualización
      const updatedProviders = await ProviderService.getProviders();
      setProviders(updatedProviders);
  
      // Cierra el formulario después de guardar
      setEditFormVisible(false);
      setSelectedProvider(null);
  
      // Muestra el Toast de éxito
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Proveedor actualizado con éxito' });
    } catch (error) {
      console.error('Error al guardar datos editados:', error.message);
      // Muestra el Toast de error
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el proveedor' });
    }
  };
  const handleDelete = (provider) => {
    setSelectedProvider(provider);
    setDeleteConfirmationVisible(true);
  };

  const confirmDelete = async () => {
    try {
      // Lógica para eliminar el proveedor utilizando el servicio
      await ProviderService.deleteProvider(selectedProvider.idp);

      // Refresca la lista de proveedores después de la eliminación
      const updatedProviders = await ProviderService.getProviders();
      setProviders(updatedProviders);

      // Cierra el cuadro de diálogo de confirmación
      setDeleteConfirmationVisible(false);

      // Muestra el Toast de éxito
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Proveedor eliminado con éxito' });
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error.message);
      // Cierra el cuadro de diálogo de confirmación
      setDeleteConfirmationVisible(false);
      // Muestra el Toast de error
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el proveedor' });
    }
  };

  const cancelDelete = () => {
    // Cierra el cuadro de diálogo de confirmación
    setDeleteConfirmationVisible(false);
  };


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('es-ES', options);
    return formattedDate;
  };
  const isAdminOrPremium = session?.user?.role && (session.user.role.includes('admin') || session.user.role.includes('premium'));
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {isAdminOrPremium && (
          <div className="flex justify-content-center mt-4">
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
     <Dialog
        header={'Confirmar Eliminación'}
        visible={deleteConfirmationVisible}
        style={{ width: '30vw' }}
        onHide={cancelDelete}
      >
        <div>
          ¿Estás seguro de que deseas eliminar este proveedor?
        </div>
        <div className=" flex justify-content-center mt-4">
          <Button label="Eliminar" icon="pi pi-trash" onClick={confirmDelete} autoFocus className="p-button-text p-button-rounded p-button-success p-button-outlined" />
          <Button label="Cancelar" icon="pi pi-times" onClick={cancelDelete} className="p-button-text p-button-rounded p-button-danger p-button-outlined" />
        </div>
      </Dialog>
      <DataTable value={providers} className="mt-4" selectionMode="single" selection={selectedProvider} onSelectionChange={(e) => setSelectedProvider(e.value)}>
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

      <Dialog visible={editFormVisible} onHide={handleEditFormClose}>
        <EditProviderForm provider={selectedProvider} onSave={handleSaveEditForm} onClose={handleEditFormClose} />
      </Dialog>
    </div>
  );
};

export default ProvidersTable;