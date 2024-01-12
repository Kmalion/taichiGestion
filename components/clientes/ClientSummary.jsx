'use client'
import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import NewClientForm from './NewClientForm';
import { Card } from 'primereact/card';
import ClientTable from './ClientTable';
import clientService from '@/service/clientService'
import { useRouter } from 'next/navigation'
import { Toast } from 'primereact/toast';

const ClientSummary = () => {
  const [showNewClientForm, setNewShowClientForm] = useState(false);
  const router = useRouter();
  const toast = useRef(null);
  

  const handleShowForm = () => {
    setNewShowClientForm(true);
  };

  const handleHideForm = () => {
    setNewShowClientForm(false);
  };
  const handleSaveClient = async (formData) => {
    try {
      // Guarda el cliente utilizando el servicio
      await clientService.createClient(formData);

      // Cierra el formulario después de guardar
      setNewShowClientForm(false);

      // Muestra un mensaje de éxito utilizando Toast
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cliente guardado con éxito' });

      // Redirige a la página de clientes después de guardar
      router.push('/clientes');
    } catch (error) {
      console.error('Error al guardar el cliente:', error.message);

      // Muestra un mensaje de error utilizando Toast
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el cliente' });
    }
  };

  return (
    <div>
      <Card>
        <Button label="Nuevo Cliente" icon="pi pi-plus" onClick={handleShowForm} />
        <Toast ref={toast} />
        {showNewClientForm && <NewClientForm  visible={showNewClientForm} onSave={handleSaveClient} onCancel={handleHideForm}  />}
      <ClientTable></ClientTable>
      </Card>
    </div>
  );
};

export default ClientSummary;
