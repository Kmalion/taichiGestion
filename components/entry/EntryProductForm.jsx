
'use client '
// Importa las dependencias necesarias y define el componente

import React, { useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

const EntryProductForm = ({ onHide, onAddProduct }) => {
  const [form, setForm] = useState({
    reference: '',
    quantity: '',
    cost: '',
    serials: '',
    lote: '',
    ubicacion: '',
    exp_date: '', // Agrega el campo de fecha
  });

  const [filteredReferences, setFilteredReferences] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    console.log(`Input changed - Name: ${name}, Value: ${JSON.stringify(value)}`);

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value.label || value,
    }));
  };

  const searchReferences = async (searchQuery) => {
    const query = String(searchQuery).toLowerCase();

    try {
      const response = await fetch(`/api/products/getProducts?query=${query}`);
      const suggestions = await response.json();
      console.log('Sugerencias recibidas:', suggestions);
      const data = suggestions.map((product) => product.reference);
      console.log('data:', data);
      const references = suggestions.map((product) => ({ label: product.reference }));
      console.log('Referencias filtradas:', references);

      setFilteredReferences(references);
    } catch (error) {
      console.error('Error al buscar referencias:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form before onAddProduct:', form);
    onAddProduct(form);
    console.log('Form after onAddProduct:', form);
    onHide();
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Card style={{ width: '100%', padding: '20px' }} onHide={onHide}>
      <h2 className="text-center mt-0">Agregar producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="reference">Referencia:</label>
            <AutoComplete
              key={filteredReferences.length.toString()}
              id="reference"
              name="reference"
              value={form.reference}
              suggestions={filteredReferences}
              completeMethod={searchReferences}
              field="label"
              onChange={handleInputChange}
              placeholder="Buscar referencia"
              minLength={1}
              loading={loading}
              className="p-autocomplete-item"
              dropdownClassName="p-autocomplete-panel"
              required
            />
          </div>

          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="quantity">Cantidad:</label>
            <InputText
              id="quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleInputChange}
              required
              type="number"
            />
          </div>

          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="cost">Costo:</label>
            <InputText
              id="cost"
              name="cost"
              value={form.cost}
              onChange={handleInputChange}
              required
              type="number"
            />
          </div>

          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="serials">Serial:</label>
            <InputText
              id="serials"
              name="serials"
              value={form.serials}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="p-field p-col-12 mt-2">
            <label htmlFor="lote">Lote:</label>
            <InputText
              id="lote"
              name="lote"
              value={form.lote}
              onChange={handleInputChange}
            />
          </div>

          <div className="p-field p-col-12 mt-2">
            <label htmlFor="exp_date">Fecha de vencimiento:</label>
            <Calendar
              id="exp_date"
              name="exp_date"
              value={form.exp_date}
              onChange={(e) => setForm({ ...form, exp_date: e.value })}
              minDate={new Date(getCurrentDate())}
            />
          </div>

          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="ubicacion">Ubicación:</label>
            <InputText
              id="ubicacion"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleInputChange}
              required
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
