
'use client '
import React, { useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const EntryProductForm = ({ visible, onHide, onSave, onAddProduct }) => {
  const [form, setForm] = useState({
    reference: '',
    quantity: '',
    cost: '',
    serials: '',
    ubicacion: '',
  });

  const [filteredReferences, setFilteredReferences] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // Realiza la búsqueda en tiempo real al servidor
    searchReferences(value);
  };

  const searchReferences = async (value) => {
    try {
      // Muestra un indicador de carga
      setLoading(true);

      // Llama a la API en el servidor para buscar referencias
      const response = await fetch(`/api/products/searchReferences?query=${value}`);
      const data = await response.json();
      

      // Actualiza la lista de referencias filtradas
      setFilteredReferences(data);
    } catch (error) {
      console.error('Error al buscar referencias:', error);
    } finally {
      // Oculta el indicador de carga
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onAddProduct(form);
    onHide();
  };

  return (
    <Card style={{ width: '100%', padding: '20px' }} onHide={onHide}>
    <h2 className="text-center mt-0">Agregar producto </h2>
    <form onSubmit={handleSubmit}>
      <div className="p-fluid p-formgrid p-grid">
      <div className="p-field p-col-12 p-md-6">
            <label htmlFor="product">Referencia:</label>
            <AutoComplete
              id="reference"
              name="reference"
              value={form.reference}
              suggestions={filteredReferences}
              completeMethod={(e) => searchReferences(e.query)}
              field="label" // Ajusta esto según la estructura de tus datos
              onChange={handleInputChange}
              placeholder="Buscar referencia"
              minLength={3} // Puedes ajustar la longitud mínima para iniciar la búsqueda
              loading={loading}
            />
          </div>
        <div className="p-field p-col-12 p-md-6 mt-2">
          <label htmlFor="quantity">Cantidad:</label>
          <InputText
            id="quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field p-col-12 p-md-6 mt-2">
          <label htmlFor="cost">Costo:</label>
          <InputText
            id="cost"
            name="cost"
            value={form.cost}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field p-col-12 p-md-6 mt-2">
          <label htmlFor="serials">Serial:</label>
          <InputText
            id="serials"
            name="serials"
            value={form.serials}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field p-col-12 p-md-6 mt-2">
          <label htmlFor="ubicacion">Ubicación:</label>
          <InputText
            id="ubicacion"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="p-field p-col-12 mt-3">
        <Button label="Agregar" type="submit" />
      </div>
    </form>
  </Card>
  );
};

export default EntryProductForm;
