'use client'
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import ClientForm from './ClientForm';
import { Card } from 'primereact/card';
import ClientTable from './ClientTable';

const ClientSummary = () => {
  const [showClientForm, setShowClientForm] = useState(false);

  const handleShowForm = () => {
    setShowClientForm(true);
  };

  const handleHideForm = () => {
    setShowClientForm(false);
  };

  return (
    <div>
      <Card>
        <Button label="Nuevo Cliente" icon="pi pi-plus" onClick={handleShowForm} />
        {showClientForm && <ClientForm showDialog={showClientForm} hideDialog={handleHideForm} />}
      <ClientTable></ClientTable>
      </Card>
    </div>
  );
};

export default ClientSummary;
