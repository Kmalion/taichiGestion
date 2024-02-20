
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


  const [form, setForm] = useState({
    reference: '',
    quantity: '',
    price: '',
    serials: '',
    lotes: '',
    ubicacion: '',
    exp_date: '', // Agrega el campo de fecha
  });
  const [filteredReferenceSerials, setFilteredReferenceSerials] = useState([]);
  const [filteredReferenceLotes, setFilteredReferenceLotes] = useState([]);
  const [filteredReferences, setFilteredReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);


  const handleSerialsChange = (e) => {
    const value = e.target.value;

    // Añade lógica para establecer el estado en "noDisponible" automáticamente para serials
    setForm((prevForm) => ({
      ...prevForm,
      serials: [{ label: value, value, status: 'noDisponible' }],
    }));
  };

  const handleLoteChange = (e) => {
    const value = e.target.value;


    setForm((prevForm) => ({
      ...prevForm,
      lotes: [{ label: value, value, status: 'noDisponible' }],
    }));
  };

  const searchReferences = async (event) => {
    try {
      setLoading(true);
      const query = event.query || '';
      const products = await searchProducts(query);


      // Filtrar las referencias basadas en la consulta
      const references = products.map((product) => ({ label: product.reference, value: product.reference }));
      setFilteredReferences(references);

      let allSerials = [];
      let allLotes = [];
      // Recorrer cada producto y extraer los serials
      products.forEach((product) => {
        if (product.serials) {
          allSerials = allSerials.concat(product.serials);
        }
        if (product.lotes) {
          allLotes = allLotes.concat(product.lotes);
        }
      });
      // Actualizar el estado con los seriales relacionados
      setFilteredReferenceSerials(allSerials);
      setFilteredReferenceLotes(allLotes)

    } catch (error) {
      console.error('Error al buscar referencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(form);
    onHide(false);  
  };

  return (
    <Card style={{ width: '100%', padding: '20px' }} >
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
              loading={loading ? 'true' : 'false'} 
              className="p-autocomplete-item"
              dropdownclassname="p-autocomplete-panel"
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
              value={form.serials.length > 0 ? form.serials[0].label : null}
              options={filteredReferenceSerials.map((serialObj) => ({
                label: serialObj.serial,
                value: serialObj.serial,
              }))}
              onChange={handleSerialsChange}
              placeholder="Seleccione un serial"
              filter
              showClear
              optionLabel="label"
              disabled={!filteredReferenceSerials || filteredReferenceSerials.length === 0}
              required
            />
          </div>


          <div className="p-field p-col-12 p-md-6 mt-2">
            <label htmlFor="lotes">Lote:</label>
            <Dropdown
              id="lotes"
              name="lotes"
              value={form.lotes.length > 0 ? form.lotes[0].label : null}
              options={filteredReferenceLotes.map((loteObj) => ({
                label: loteObj.lote,
                value: loteObj.lote,
              }))}
              onChange={handleLoteChange}
              placeholder="Seleccione un lote"
              filter
              showClear
              optionLabel="label"
              disabled={!filteredReferenceLotes || filteredReferenceLotes.length === 0}
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

export default OutflowProductForm;