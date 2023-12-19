
'use client '
import React, { useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import '../app/styles/styles.css';

const EntryProductForm = ({ onHide, onSave, onAddProduct }) => {
  const [form, setForm] = useState({
    reference: '',
    quantity: '',
    cost: '',
    serials: '',
    lote: '',
    ubicacion: '',
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
    console.log('Form before onSave:', form);
    onSave(form);
    console.log('Form before onAddProduct:', form);
    onAddProduct(form);
    console.log('Form after onAddProduct:', form);
    onHide();
  };


  return (
    <Card style={{ width: '100%', padding: '20px' }} onHide={onHide}>
      <h2 className="text-center mt-0">Agregar producto </h2>
      <form onSubmit={handleSubmit}>
        <div className="p-fluid p-formgrid p-grid">
      <div className="p-field p-col-12 p-md-6">
    <label htmlFor="reference">Referencia:</label>
    {console.log('Labels de las sugerencias:', filteredReferences.map(suggestion => suggestion.label))}
    <AutoComplete
        key={filteredReferences.length.toString()} // Usar la longitud para forzar la actualización
        id="reference"
        name="reference"
        value={form.reference}
        suggestions={filteredReferences}
        completeMethod={searchReferences}
        field="label" // Usar 'label' como campo para las sugerencias
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
              required // Campo requerido
              type="number" // Solo acepta números
            />
          </div>

          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="cost">Costo:</label>
            <InputText
              id="cost"
              name="cost"
              value={form.cost}
              onChange={handleInputChange}
              required // Campo requerido
              type="number" // Solo acepta números
            />
          </div>

          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="serials">Serial:</label>
            <InputText
              id="serials"
              name="serials"
              value={form.serials}
              onChange={handleInputChange}
              required // Campo requerido
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

          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="ubicacion">Ubicación:</label>
            <InputText
              id="ubicacion"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleInputChange}
              required // Campo requerido
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
