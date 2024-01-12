'use client'
import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import NewProviderForm from '@/components/proveedores/NewProviderForm';
import ProvidersTable from './ProvidersTable';
import providerService from '@/service/providerService';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';

const ProvidersSummary = () => {
  const [showNewProviderForm, setShowNewProviderForm] = useState(false);
  const toast = useRef(null); 
  const router = useRouter()

  const handleShowForm = () => {
    setShowNewProviderForm(true);
  };

  const handleHideForm = () => {
    setShowNewProviderForm(false);
  };

  const handleSaveProvider = async (formData) => {
    try {
      // Guarda el proveedor utilizando el servicio
      await providerService.createProvider(formData);

      // Cierra el formulario después de guardar
      setShowNewProviderForm(false);

      // Muestra un mensaje de éxito utilizando Toast
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Proveedor guardado con éxito' });

      router.push('/proveedores');
    } catch (error) {
      console.error('Error al guardar el proveedor:', error.message);

      // Muestra un mensaje de error utilizando Toast
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el proveedor' });
    }
  };

  return (
    <div>
      <Card>
        <div className="flex justify-content-between mb-4">
          <Button label="Nuevo Proveedor" icon="pi pi-plus" onClick={handleShowForm} />
        </div>
        <Toast ref={toast} />
        {showNewProviderForm && <NewProviderForm visible={showNewProviderForm} onSave={handleSaveProvider} onCancel={handleHideForm} />}
        
        <ProvidersTable />
      </Card>
    </div>
  );
};

export default ProvidersSummary;
