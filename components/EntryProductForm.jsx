
'use client '
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const EntryProductForm = ({ visible, onHide, onSave }) => {
  const [form, setForm] = useState({
    producto: '',
    comprobante: '',
    cantidad: '',
    costo: '',
    serial: '',
    ubicacion: '',
  });



  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onHide();
  };

  return (
    <Card style={{ width: '100%', padding: '20px' }}>
    <h2 className="text-center mt-0">Agregar a la entrada</h2>
    <form onSubmit={handleSubmit}>
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="producto">Referencia:</label>
          <InputText
            id="producto"
            name="producto"
            value={form.producto}
            onChange={handleInputChange}
          />
          {/* Lógica de búsqueda aquí */}
        </div>
        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="cantidad">Cantidad:</label>
          <InputText
            id="cantidad"
            name="cantidad"
            value={form.cantidad}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="costo">Costo:</label>
          <InputText
            id="costo"
            name="costo"
            value={form.costo}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="serial">Serial:</label>
          <InputText
            id="serial"
            name="serial"
            value={form.serial}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="ubicacion">Ubicación:</label>
          <InputText
            id="ubicacion"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="p-field p-col-12">
        <Button label="Agregar" type="submit" />
      </div>
    </form>
  </Card>
  );
};

export default EntryProductForm;
