
'use client '
// Importa las dependencias necesarias y define el componente

import React, { useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Card } from 'primereact/card';

import { Button } from 'primereact/button';

import { getAllSerials, searchProducts, getAllLotes } from '@/service/outflowService';
import { InputNumber } from 'primereact/inputnumber';



const OutflowProductForm = ({ onHide, onAddProduct }) => {
  const [form, setForm] = useState({
    reference: '',
    quantity: '',
    price: '',
    serials: '',
    lote: '',
    ubicacion: '',
    exp_date: '', // Agrega el campo de fecha
  });

  const [filteredReferences, setFilteredReferences] = useState([]);
  const [filteredSerials, setFilteredSerials] = useState([]);
  const [filteredLotes, setFilteredLotes] = useState([]);
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
        {
          serial: value,
          status: 'noDisponible',
        },
      ],
    }));
  };


  const searchReferences = async (event) => {
    try {
      setLoading(true);
      const query = event.query || ''; // Obtener la consulta del evento
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

  const searchSerials = async (event) => {
    try {
      setLoading(true);
      const query = event.query || ''; // Obtener la consulta del evento
      const serials = await getAllSerials();

      // Filtrar los serials basados en la consulta
      const filteredSerials = serials.filter((serial) =>
        serial.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSerials(filteredSerials);
    } catch (error) {
      console.error('Error al buscar serials:', error);
    } finally {
      setLoading(false);
    }
  };
  const searchLotes = async (event) => {
    try {
      setLoading(true);
      const query = event.query || ''; // Obtener la consulta del evento
      const lotes = await getAllLotes();
      console.log("Lotes FRONT: ", lotes);

      // Filtrar los lotes basados en la consulta
      setFilteredLotes(lotes);
    } catch (error) {
      console.error('Error al buscar lotes:', error);
    } finally {
      setLoading(false);
    }
  };


  // Función para manejar el cambio en el input de lotes
  const handleLoteChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
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

  const formatCurrency = (value) => {
    return value.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
    });
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
    mode="decimal"
    placeholder="Ingrese la cantidad"
    showButtons={false} 
    required
  />
</div>

          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="price">Precio de venta:</label>
            <InputNumber
              id="price"
              name="price"
              value={form.price}
              onValueChange={(e) => setForm({ ...form, price: e.value })}
              format={true}
              showButtons={false} 
              placeholder="Ingrese el precio"
              mode="currency"
              currency="COP"
            />
          </div>

          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="serials">Serial:</label>
            <AutoComplete
              id="serials"
              name="serials"
              value={form.serials.length > 0 ? form.serials[0].serial : ''}
              suggestions={filteredSerials}
              completeMethod={searchSerials}
              onChange={handleSerialsChange}
              placeholder="Buscar serial"
              minLength={1}
              loading={loading}
              className="p-autocomplete-item"
              dropdownClassName="p-autocomplete-panel"
              required
            />

          </div>

          <div className="p-field p-col-12 mt-2">
            <label htmlFor="lote">Lote:</label>
            <AutoComplete
              id="lote"
              name="lote"
              value={form.lote}
              suggestions={filteredLotes}
              completeMethod={searchLotes}
              onChange={handleLoteChange}
              placeholder="Buscar lote"
              minLength={1}
              loading={loading}
              className="p-autocomplete-item"
              dropdownClassName="p-autocomplete-panel"
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

export default OutflowProductForm;