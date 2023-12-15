'use client'
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import EntryProductForm from './EntryProductForm';

const EntrySummary = () => {
  const [showForm, setShowForm] = useState(false);
  const [entryData, setEntryData] = useState({
    entradaNo: generateEntryNo(),
    fechaEntrada: getCurrentDate(), // Establecer la fecha actual
    clienteProveedor: '',
    tipo: '',
  });

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSaveEntry = (entryForm) => {
    setEntryData({
      ...entryData,
      clienteProveedor: entryForm.clienteProveedor,
      tipo: entryForm.tipo,
    });
  };

  // Función para generar el ID de entrada
  function generateEntryNo() {
    const currentYear = new Date().getFullYear();
    const initialConsecutive = 1; // Puedes ajustar según sea necesario

    // Puedes ajustar el formato del ID según tus necesidades
    const entryNumber = String(initialConsecutive).padStart(4, '0');
    return `${currentYear}-${entryNumber}`;
  }

  // Función para obtener la fecha y hora actuales
  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div>
      <h3 className='pagetitle text-center'>Historial de entradas</h3>
      <Card>
    

        <Dialog visible={showForm} onHide={handleCloseForm}>
          <EntryProductForm
            onClose={handleCloseForm}
            onSave={handleSaveEntry}
            entradaNo={entryData.entradaNo}
          />
        </Dialog>

        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="entradaNo">Entrada No.:</label>
            <InputText id="entradaNo" name="entradaNo" value={entryData.entradaNo} readOnly />
          </div>
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="fechaEntrada">Fecha de Entrada:</label>
            <InputText id="fechaEntrada" name="fechaEntrada" value={entryData.fechaEntrada} readOnly />
          </div>
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="clienteProveedor">Cliente/Proveedor:</label>
            <InputText
              id="clienteProveedor"
              name="clienteProveedor"
              value={entryData.clienteProveedor}
              readOnly
            />
          </div>
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="tipo">Tipo:</label>
            <InputText id="tipo" name="tipo" value={entryData.tipo} readOnly />
          </div>
          {/* Otros campos que desees mostrar */}
          <div>
          </div>
        </div>
      </Card>
      <Card>
      <Button onClick={handleOpenForm}>Agregar Producto</Button>
      </Card>
    </div>
  );
};

export default EntrySummary;
