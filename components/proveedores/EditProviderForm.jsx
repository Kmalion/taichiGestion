'use client'
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const EditProviderForm = ({ provider, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    idp: '',
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    ubicacion: '',
    especialidad:''
    // Agrega otros campos según sea necesario
  });

  useEffect(() => {
    // Si hay un proveedor proporcionado, actualiza el estado del formulario con sus datos
    if (provider) {
      setFormData({
        idp: provider.idp || '',
        nombre: provider.nombre || '',
        contacto: provider.contacto || '',
        email: provider.email || '',
        telefono: provider.telefono || '',
        direccion: provider.direccion || '',
        ubicacion: provider.ubicacion || '',
        especialidad: provider.especialidad || '',
        // Actualiza otros campos según sea necesario
      });
    }
  }, [provider]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div>
      <h3>Editar Proveedor</h3>
      <div className="p-fluid p-formgrid p-grid">
      <div className="p-field p-col mt-2 mb-3">
          <label htmlFor="idp">C.C. / NIT</label>
          <InputText id="idp" name="idp" value={formData.idp} onChange={handleInputChange} />
        </div>
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
          <label htmlFor="ubicacion">Ubicacion</label>
          <InputText id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} />
        </div>
        <div className="p-field p-col mt-2 mb-3">
          <label htmlFor="especialidad">Especialidad</label>
          <InputText id="especialidad" name="especialidad" value={formData.especialidad} onChange={handleInputChange} />
        </div>
      </div>

      <div className="flex justify-content-center mt-4 gap-3">
        <Button label="Guardar" onClick={handleSave} className="p-button-rounded p-button-success p-button-outlined" />
        <Button label="Cancelar" onClick={onClose} className="p-button-rounded p-button-danger p-button-outlined" />
      </div>
    </div>
  );
};

export default EditProviderForm;
