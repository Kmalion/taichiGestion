'use client'
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import ProvidersForm from '@/components/proveedores/ProviderForm';
import { Card } from 'primereact/card';
import ProvidersTable from './ProvidersTable';

const ProvidersSummary = () => {
  const [showProvidersForm, setShowProvidersForm] = useState(false);

  const handleShowForm = () => {
    setShowProvidersForm(true);
  };

  const handleHideForm = () => {
    setShowProvidersForm(false);
  };

  return (
    <div>
      <Card>
        <Button label="Nuevo Proveedor" icon="pi pi-plus" onClick={handleShowForm} />
        {showProvidersForm && <ProvidersForm showDialog={showProvidersForm} hideDialog={handleHideForm} />}
      <ProvidersTable></ProvidersTable>
      </Card>
    </div>
  );
};

export default ProvidersSummary;