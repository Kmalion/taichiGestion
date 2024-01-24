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
import { ProgressBar } from 'primereact/progressbar';
import { useRouter } from 'next/navigation';



const ProvidersTable = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const { data: session } = useSession();
  const [processing, setProcessing] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [first, setFirst] = useState(0);
  const [filterMatchMode, setFilterMatchMode] = useState('contains');
  const router = useRouter()


  const onPageChange = (event) => {
    setFirst(event.first);
  };

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
      // Muestra el ProgressBar al inicio de la solicitud
      setProcessing(true);

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
    } finally {
      // Oculta el ProgressBar después de la solicitud, incluso si hay un error
      setProcessing(false);
      router.push('/proveedores')
    }
  };
  const handleDelete = (provider) => {
    setSelectedProvider(provider);
    setDeleteConfirmationVisible(true);
  };

  const confirmDelete = async () => {
    try {
      // Muestra el ProgressBar al inicio de la solicitud de eliminación
      setProcessing(true);

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
    } finally {
      // Oculta el ProgressBar después de la solicitud, incluso si hay un error
      setProcessing(false);
      router.push('/proveedores')
    }
  };

  const cancelDelete = () => {
    // Cierra el cuadro de diálogo de confirmación
    setDeleteConfirmationVisible(false);
  };
  const customFilterOptions = [
    { label: 'Contiene', value: 'contains' },
    { label: 'Empieza con', value: 'startsWith' },
    { label: 'Termina con', value: 'endsWith' },
    // Agrega otras opciones según sea necesario
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('es-ES', options);
    return formattedDate;
  };
  const isAdminOrPremium = session?.user?.role && (session.user.role.includes('admin') || session.user.role.includes('premium'));
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        
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
        
      </React.Fragment>
    );
  };
  return (
    <div>
  <Dialog
        header={processing ? 'Eliminando...' : 'Confirmar Eliminación'}
        visible={deleteConfirmationVisible}
        style={{ width: '30vw' }}
        onHide={cancelDelete}
        modal
      >
        <div className="flex flex-col items-center">
          {processing && (
            // Muestra el ProgressBar mientras se está procesando
            <ProgressBar mode="indeterminate" style={{ width: '100%', marginTop: '1rem' }}></ProgressBar>
          )}
          <div>
            {!processing && '¿Estás seguro de que deseas eliminar este proveedor?'}
          </div>
          {!processing && (
            <div className="flex justify-content-center mt-4">
              {/* Muestra los botones de confirmar o cancelar cuando no hay procesamiento */}
              <Button
                label="Eliminar"
                icon="pi pi-trash"
                onClick={confirmDelete}
                autoFocus
                className="p-button-text p-button-rounded p-button-success p-button-outlined"
              />
              <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={cancelDelete}
                className="p-button-text p-button-rounded p-button-danger p-button-outlined"
              />
            </div>
          )}
        </div>
      </Dialog>

      
      <DataTable value={providers} first={first}
        paginator
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rows={10}
        onPage={onPageChange}
        className='mt-4'
        selectionMode="single"
        selection={selectedProvider} 
        onSelectionChange={(e) => setSelectedProvider(e.value)}
        globalFilter={globalFilter}
        emptyMessage="No se encontraron clientes"
        >
        <Column field="idp" header="ID Proveedor"></Column>
        <Column field="nombre" header="Nombre" filter
          filterMatchMode={filterMatchMode}
          filterOptions={customFilterOptions}></Column>
        <Column field="contacto" header="Contacto" filter
          filterMatchMode={filterMatchMode}
          filterOptions={customFilterOptions}></Column>
        <Column field="email" header="Email" filter
          filterMatchMode={filterMatchMode}
          filterOptions={customFilterOptions}></Column>
        <Column field="telefono" header="Teléfono" filter
          filterMatchMode={filterMatchMode}
          filterOptions={customFilterOptions}></Column>
        <Column field="direccion" header="Dirección" filter
          filterMatchMode={filterMatchMode}
          filterOptions={customFilterOptions}></Column>
        <Column field="ubicacion" header="Ubicacion" filter
          filterMatchMode={filterMatchMode}
          filterOptions={customFilterOptions}></Column>
          <Column field="especialidad" header="Especialidad" filter
          filterMatchMode={filterMatchMode}
          filterOptions={customFilterOptions}></Column>
        <Column field="created" header="Fecha de Creación" sortable body={(rowData) => formatDate(rowData.created)}></Column>
        <Column body={actionBodyTemplate}></Column>
      </DataTable>

      <Toast ref={toast} />
      
    
      <Dialog visible={editFormVisible} style={{ width: '30vw' }} onHide={handleEditFormClose} modal header="Guardando">
        {processing ? (
          // Muestra el ProgressBar mientras se está procesando
          <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
        ) : (
          // Muestra el formulario de edición cuando no hay procesamiento
          <EditProviderForm provider={selectedProvider} onSave={handleSaveEditForm} onClose={handleEditFormClose} />
        )}
      </Dialog>
    </div>
  );
};

export default ProvidersTable;