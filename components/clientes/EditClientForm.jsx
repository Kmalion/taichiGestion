'use client'
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';


const EditClientForm = ({ client, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    idc: '',
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    ubicacion: '',
    tipoCliente: '',
    created: '',
    linea: '',
    asesor: '',
    especialidad: ''

  });

  useEffect(() => {
    // Si hay un cliente proporcionado, actualiza el estado del formulario con sus datos
    if (client) {
      setFormData({
        idc: client.idc || '',
        nombre: client.nombre || '',
        contacto: client.contacto || '',
        email: client.email || '',
        telefono: client.telefono || '',
        direccion: client.direccion || '',
        ubicacion: client.ubicacion || '',
        tipoCliente: client.tipoCliente || '',
        linea: client.linea || '',
        asesor: client.asesor || '',
        especialidad: client.especialidad || '',
     
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

  const lineasOptions = [
    { label: 'Médica', value: 'medica' },
    { label: 'Veterinaria', value: 'veterinaria' },
    { label: 'Simulación', value: 'simulacion' },
    { label: 'Servicio', value: 'servicio' },
    { label: 'Odontología', value: 'odontologia' },
    { label: 'Laboratorio', value: 'laboratorio' },
    { label: 'Externo', value: 'externo' },
  ];

  return (
   
      <div>
        {/* Renderiza tus campos de formulario aquí, por ejemplo: */}
        <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col">
            <label htmlFor="idc">C.C. / NIT </label>
            <InputText id="idc" name="idc" value={formData.idc} onChange={handleInputChange} />
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
          <div className="p-field p-col mt-2">
            <label htmlFor="linea">Linea</label>
            <Dropdown
          id="linea"
          name="linea"
          value={formData.linea}
          options={lineasOptions}
          onChange={(e) => handleInputChange({ target: { name: 'linea', value: e.value } })}
          placeholder="Selecciona una línea"
        />
          </div>
          <div className="p-field p-col mt-2">
            <label htmlFor="asesor">Asesor</label>
            <InputText id="asesor" name="asesor" value={formData.asesor} onChange={handleInputChange} />
          </div>
          <div className="p-field p-col mt-2 mb-3">
            <label htmlFor="ubicacion">Ubicación</label>
            <InputText id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} />
          </div>
          <div className="p-field p-col mt-2 mb-3">
            <label htmlFor="especialidad">Especialidad</label>
            <InputText id="especialidad" name="especialidad" value={formData.especialidad} onChange={handleInputChange} />
          </div><div className="p-field p-col mt-2 mb-3">
            <label htmlFor="tipoCliente">Tipo de cliente</label>
            <InputText id="tipoCliente" name="tipoCliente" value={formData.tipoCliente} onChange={handleInputChange} />
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
