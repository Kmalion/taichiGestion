'use client'
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { locale, addLocale } from 'primereact/api';
import ClientService from '@/service/clientService';
import EditClientForm from '@/components/clientes/EditClientForm';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import filterTranslations from '@/utils/filterTranslations';
import { useSession } from 'next-auth/react';


const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [first, setFirst] = useState(0);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filterMatchMode, setFilterMatchMode] = useState('contains');
  const { data: session } = useSession();

  const onPageChange = (event) => {
    setFirst(event.first);
  };

  // Ref para el Toast
  const toast = useRef(null);

  useEffect(() => {

    locale('es');
    addLocale('es', { filter: filterTranslations });
    // Obtener la lista de clientes
    ClientService.getClients()
      .then((data) => setClients(data))
      .catch((error) => console.error('Error al obtener clientes:', error));
  }, []);

  const handleEdit = (client) => {
    setSelectedClient(client);
    setEditFormVisible(true);
  };

  const handleDelete = (client) => {
    setSelectedClient(client);
    setDeleteConfirmationVisible(true);
  };

  const confirmDelete = async () => {
    try {
      // Lógica para eliminar el cliente utilizando el servicio
      await ClientService.deleteClient(selectedClient.idc);

      // Refresca la lista de clientes después de la eliminación
      const updatedClients = await ClientService.getClients();
      setClients(updatedClients);

      // Cierra el cuadro de diálogo de confirmación
      setDeleteConfirmationVisible(false);

      // Muestra el Toast de éxito
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado con éxito' });
    } catch (error) {
      console.error('Error al eliminar el cliente:', error.message);
      // Cierra el cuadro de diálogo de confirmación
      setDeleteConfirmationVisible(false);
      // Muestra el Toast de error
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el cliente' });
    }
  };
  const customFilterOptions = [
    { label: 'Contiene', value: 'contains' },
    { label: 'Empieza con', value: 'startsWith' },
    { label: 'Termina con', value: 'endsWith' },
    // Agrega otras opciones según sea necesario
  ];
  const cancelDelete = () => {
    // Cierra el cuadro de diálogo de confirmación
    setDeleteConfirmationVisible(false);
  };

  const closeEditForm = () => {
    // Ocultar el formulario de edición al cerrar
    setEditFormVisible(false);
    // Limpiar el cliente seleccionado
    setSelectedClient(null);
  };

  const handleEditSave = async (formData) => {
    try {
      // Actualiza el cliente utilizando el servicio
      await ClientService.updateClient(selectedClient.idc, formData);

      // Refresca la lista de clientes después de la actualización
      const updatedClients = await ClientService.getClients();
      setClients(updatedClients);

      // Cierra el formulario después de guardar
      setEditFormVisible(false);
      setSelectedClient(null);

      // Muestra el Toast de éxito
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado con éxito' });
    } catch (error) {
      console.error('Error al guardar datos editados:', error.message);
      // Muestra el Toast de error
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el cliente' });
    }
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
      <Dialog
        header={'Confirmar Eliminación'}
        visible={deleteConfirmationVisible}
        style={{ width: '30vw' }}
        onHide={cancelDelete}
      >
        <div>
          ¿Estás seguro de que deseas eliminar este cliente?
        </div>
        <div className=" flex justify-content-center mt-4">
          <Button label="Eliminar" icon="pi pi-trash" onClick={confirmDelete} autoFocus className="p-button-text p-button-rounded p-button-success p-button-outlined" />
          <Button label="Cancelar" icon="pi pi-times" onClick={cancelDelete} className="p-button-text p-button-rounded p-button-danger p-button-outlined" />
        </div>
      </Dialog>

      <Dialog
        header={'Editar Cliente'}
        visible={editFormVisible}
        style={{ width: '30vw' }}
        onHide={closeEditForm}
      >
        <EditClientForm
          client={selectedClient}
          onSave={handleEditSave}
          onClose={closeEditForm}
        />
      </Dialog>
      <DataTable
        value={clients}
        first={first}
        paginator
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rows={10}
        onPage={onPageChange}
        className='mt-4'
        selectionMode="single"
        selection={selectedClient}
        onSelectionChange={(e) => setSelectedClient(e.value)}
        globalFilter={globalFilter}
        emptyMessage="No se encontraron clientes"
      >
        <Column
          field="idc"
          header="C.C. / NIT"
          filter
          filterMatchMode={filterMatchMode}
          filterOptions={customFilterOptions}
        ></Column>
        <Column
          field="nombre"
          header="Nombre"
          filter
          filterMatchMode={filterMatchMode}
          filterOptions={customFilterOptions}
        ></Column>
        <Column field="contacto" header="Contacto" filter
          filterMatchMode={filterMatchMode}></Column>
        <Column field="email" header="Email" filter
          filterMatchMode={filterMatchMode}></Column>
        <Column field="telefono" header="Teléfono" filter
          filterMatchMode={filterMatchMode}></Column>
        <Column field="direccion" header="Dirección" filter
          filterMatchMode={filterMatchMode}></Column>
        <Column field="ciudad" header="Ciudad" filter
          filterMatchMode={filterMatchMode}></Column>
        <Column field="created" header="Fecha de Creación" sortable
          body={(rowData) => formatDate(rowData.created)}></Column>
        <Column body={actionBodyTemplate}></Column>
      </DataTable>

      <Toast ref={toast} />
    </div>
  );

};

export default ClientTable;
