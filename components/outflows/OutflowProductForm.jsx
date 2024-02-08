
'use client '
// Importa las dependencias necesarias y define el componente

import React, { useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import { getAllSerials, searchProducts, getAllLotes } from '@/service/outflowService';
import { InputNumber } from 'primereact/inputnumber';



const OutflowProductForm = ({ onHide, onAddProduct }) => {

  const [filteredReferenceSerials, setFilteredReferenceSerials] = useState([]);

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


  const handleSerialsChange = (e) => {
    const value = e.target.value;

    // Añade lógica para establecer el estado en "noDisponible" automáticamente para serials
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
      const query = event.query || '';
      const products = await searchProducts(query);
      console.log("Productos:", products);
  
      // Filtrar las referencias basadas en la consulta
      const references = products.map((product) => ({ label: product.reference, value: product.reference }));
      setFilteredReferences(references);
      console.log("Referencias:", references);
  
      let allSerials = [];
  
      // Recorrer cada producto y extraer los serials
      products.forEach((product) => {
        if (product.serials) {
          allSerials = allSerials.concat(product.serials);
        }
      });
  
      console.log("Seriales relacionados: ", allSerials);
  
      // Actualizar el estado con los seriales relacionados
      setFilteredReferenceSerials(allSerials);
  
    } catch (error) {
      console.error('Error al buscar referencias:', error);
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
              onChange={(e) => setForm((prevForm) => ({ ...prevForm, reference: e.value }))}
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
            <Dropdown
              id="serials"
              name="serials"
              value={form.serials.length > 0 ? form.serials[0].serial : null}
              options={filteredReferenceSerials}
              onChange={handleSerialsChange}
              placeholder="Seleccione un serial"
              filter
              showClear
              optionLabel="label"
              disabled={!filteredReferenceSerials || filteredReferenceSerials.length === 0}
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