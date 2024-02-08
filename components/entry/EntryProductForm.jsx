
'use client '
// Importa las dependencias necesarias y define el componente

import React, { useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { searchProducts } from '@/service/entryService';
import { InputNumber } from 'primereact/inputnumber';




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
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value.label || value,
    }));
  };

  const handleSerialsChange = (e) => {
    const value = e.target.value;

    // Añade lógica para establecer el estado en "disponible" automáticamente para serials
    setForm((prevForm) => ({
      ...prevForm,
      serials: [
        { label: value,
          serial: value,
          status: 'disponible',
        },
      ],
    }));
  };
  const handleLotesChange = (e) => {
    const value = e.target.value;
  
    // Añade lógica para establecer el estado en "disponible" automáticamente para el lote
    setForm((prevForm) => ({
      ...prevForm,
      lotes: [
        { label: value,
          lote: value,
          status: 'disponible',
        },
      ],
    }));
  };
  const searchReferences = async (event) => {
    try {
      setLoading(true);
      const query = event.query || '';
      console.log("Query: ", query)// Obtener la consulta del evento
      const products = await searchProducts(query);
      console.log("Products FRONT: ", products);

      // Filtrar las referencias basadas en la consulta
      const references = products.map((product) => ({ label: product.reference }));
      setFilteredReferences(references);
    } catch (error) {
      console.error('Error al buscar referencias:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(form);
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
            <InputNumber
              id="quantity"
              name="quantity"
              value={form.quantity}
              onValueChange={(e) => setForm({ ...form, quantity: e.value })}
              placeholder="Ingrese la cantidad"
              showButtons={false}
              required
            />
          </div>

          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="cost">Costo:</label>
            <InputNumber
              id="cost"
              name="cost"
              value={form.cost}
              onValueChange={(e) => setForm({ ...form, cost: e.value })}
              placeholder="Ingrese el costo"
              mode="decimal"
              locale="en-US"
              suffix=" USD"
              showButtons={false}
              required
            />
          </div>



          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="serials">Serial:</label>
            <InputText
              id="serials"
              name="serials"
              value={form.serials.length > 0 ? form.serials[0].serial : ''}
              onChange={handleSerialsChange}
              required
            />
          </div>

          <div className="p-field p-col-12 mt-2">
            <label htmlFor="lote">Lote:</label>
            <InputText
              id="lote"
              name="lote"
              value={form.lote.length > 0 ? form.lote[0].lotes : ''}
              onChange={handleLotesChange}
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