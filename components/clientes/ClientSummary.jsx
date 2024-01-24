'use client'
import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import NewClientForm from './NewClientForm';
import { Card } from 'primereact/card';
import ClientTable from './ClientTable';
import clientService from '@/service/clientService'
import { useRouter } from 'next/navigation'
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';

const ClientSummary = () => {
  const [showNewClientForm, setNewShowClientForm] = useState(false);
  const [processing, setProcessing] = useState(false);
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
      // Muestra el Dialog de progreso
      setProcessing(true);

      // Guarda el cliente utilizando el servicio
      await clientService.createClient(formData);

      // Cierra el formulario después de guardar
       setNewShowClientForm(false);

      // Muestra un mensaje de éxito utilizando Toast
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cliente guardado con éxito' });

      // Redirige a la página de clientes después de un breve retraso para dar tiempo al Toast
      setTimeout(() => {
        router.push('/clientes');
      }, 1000);
    } catch (error) {
      console.error('Error al guardar el cliente:', error.message);

      // Muestra un mensaje de error utilizando Toast
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el cliente' });
    } finally {
      // Oculta el Dialog de progreso después de la solicitud, incluso si hay un error
      setProcessing(false);
    }
  };


  return (
    <div>
      <Card>
      <div className="flex justify-content-between mb-4">
          <Button label="Nuevo Cliente" icon="pi pi-plus" onClick={handleShowForm} />
        </div>
        <Toast ref={toast} />
        <Dialog
          visible={processing}
          style={{ width: '30vw' }}
          header="Guardando"
          onHide={() => {}}
          modal
        >
             <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12">
              <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
            </div>
          </div>
        </Dialog>
        {showNewClientForm && <NewClientForm  visible={showNewClientForm} onSave={handleSaveClient} onCancel={handleHideForm}  />}
      <ClientTable></ClientTable>
      </Card>
    </div>
  );
};

export default ClientSummary;
