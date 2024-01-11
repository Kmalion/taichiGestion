'use client'
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';


const EditClientForm = ({ client, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',

  });

  useEffect(() => {
    // Si hay un cliente proporcionado, actualiza el estado del formulario con sus datos
    if (client) {
      setFormData({
        nombre: client.nombre || '',
        contacto: client.contacto || '',
        email: client.email || '',
        telefono: client.telefono || '',
        direccion: client.direccion || '',
        ciudad: client.ciudad || '',
     
      });
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
   
      <div>
        {/* Renderiza tus campos de formulario aquí, por ejemplo: */}
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
          </div>
          <div className="p-field p-col mt-2">
            <label htmlFor="contacto">Contacto</label>
            <InputText id="contacto" name="contacto" value={formData.contacto} onChange={handleInputChange} />
          </div>
          <div className="p-field p-col mt-2">
            <label htmlFor="email">Email</label>
            <InputText id="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="p-field p-col mt-2">
            <label htmlFor="telefono">Teléfono</label>
            <InputText id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} />
          </div>
          <div className="p-field p-col mt-2">
            <label htmlFor="direccion">Dirección</label>
            <InputText id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} />
          </div>
          <div className="p-field p-col mt-2 mb-3">
            <label htmlFor="ciudad">Ciudad</label>
            <InputText id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
          </div>
          {/* Agrega otros campos según sea necesario */}
        </div>

        <div className=" flex justify-content-center mt-4 gap-3">
        <Button label="Guardar" onClick={handleSave}  className="p-button-rounded p-button-success p-button-outlined" />
        <Button label="Cancelar" onClick={onClose} className="p-button-rounded p-button-danger p-button-outlined"/>
        </div>
      </div>
    
  );
};

export default EditClientForm;
