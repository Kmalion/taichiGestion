'use client'
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import { useState, useEffect } from 'react';
import userService from '@/service/userService';


const NewClientForm = ({ visible, onSave, onCancel }) => {
  const [userList, setUserList] = useState([]);
  const formik = useFormik({
    initialValues: {
      idc: '',
      nombre: '',
      contacto: '',
      email: '',
      telefono: '',
      direccion: '',
      created: new Date(),
      linea: 'medica', // Establecer el valor predeterminado para la línea
      asesor: '', // Ajustar según sea necesario
      especialidad: '',
      ubicación: '',
      tipoCliente: 'Cliente potencial', // Establecer el valor predeterminado para el tipo de cliente
    },
    validate: (values) => {
      const errors = {};
      if (!values.idc.trim()) {
        errors.idc = 'ID de cliente es requerido';
      }
      if (!values.nombre.trim()) {
        errors.nombre = 'El nombre es requerido';
      }
      if (!values.contacto.trim()) {
        errors.contacto = 'El contacto es requerido';
      }
      if (!values.email.trim()) {
        errors.email = 'El email es requerido';
      }
      if (!values.telefono.trim()) {
        errors.telefono = 'El teléfono es requerido';
      }
      if (!values.direccion.trim()) {
        errors.direccion = 'La dirección es requerida';
      }
      if (!values.ubicación.trim()) {
        errors.ubicación = 'La ciudad es requerida';
      }
      // if (!values.asesor.trim()) {
      //   errors.asesor = 'El nombre del asesor es requerido';
      // }

      if (!values.especialidad.trim()) {
        errors.especialidad = 'La especialidad es requerida';
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log(values)
      onSave(values);

    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers()
        const updatedOptions = response.users.map(user => ({
          label: `${user.nombre} ${user.apellido}`,
          value: user.nombre,
        }));

        setUserList(updatedOptions);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
console.log('Lista de usuarios ', userList)
  const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };
  const lineas = [
    { label: 'Medica', value: 'medica' },
    { label: 'Veterinaria', value: 'veterinaria' },
    { label: 'Simulacion', value: 'simulacion' },
    { label: 'Servicio', value: 'servicio' },
    { label: 'Odontologia', value: 'odontologia' },
    { label: 'Laboratorio', value: 'laboratorio' },
    { label: 'Externo', value: 'externo' },
  ];

  const tiposCliente = [
    { label: 'Cliente potencial', value: 'Cliente potencial' },
    { label: 'Distribuidor', value: 'Distribuidor' },
    { label: 'Speaker', value: 'Speaker' },
    { label: 'Otro', value: 'Otro' },
  ];


  const handleCancel = () => {
    onCancel();
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: '30vw' }}
      header="Nuevo Cliente"
      onHide={handleCancel}
    >

      <form onSubmit={formik.handleSubmit}>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12">
            <span className="p-float-label mt-4">
              <InputText
                id="idc"
                name="idc"
                value={formik.values.idc}
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('idc') })}
              />
              <label htmlFor="idc">C.C. / NIT</label>
            </span>
            {getFormErrorMessage('idc')}
          </div>
          <div className="p-field p-col-12">
            <span className="p-float-label mt-4">
              <InputText
                id="nombre"
                name="nombre"
                value={formik.values.nombre}
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('nombre') })}
              />
              <label htmlFor="nombre">Nombre</label>
            </span>
            {getFormErrorMessage('nombre')}
          </div>

          <div className="p-field p-col-12">
            <span className="p-float-label mt-4">
              <InputText
                id="contacto"
                name="contacto"
                value={formik.values.contacto}
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('contacto') })}
              />
              <label htmlFor="contacto">Contacto</label>
            </span>
            {getFormErrorMessage('contacto')}
          </div>

          <div className="p-field p-col-12">
            <span className="p-float-label mt-4">
              <InputText
                id="email"
                name="email"
                value={formik.values.email}
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('email') })}
              />
              <label htmlFor="email">Email</label>
            </span>
            {getFormErrorMessage('email')}
          </div>

          <div className="p-field p-col-12">
            <span className="p-float-label mt-4">
              <InputText
                id="telefono"
                name="telefono"
                value={formik.values.telefono}
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('telefono') })}
              />
              <label htmlFor="telefono">Teléfono</label>
            </span>
            {getFormErrorMessage('telefono')}
          </div>

          <div className="p-field p-col-12">
            <span className="p-float-label mt-4">
              <InputText
                id="direccion"
                name="direccion"
                value={formik.values.direccion}
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('direccion') })}
              />
              <label htmlFor="direccion">Dirección</label>
            </span>
            {getFormErrorMessage('direccion')}
          </div>

          <div className="p-field p-col-12">
            <span className="p-float-label mt-4">
              <InputText
                id="ubicación"
                name="ubicación"
                value={formik.values.ubicación}
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('ubicación') })}
              />
              <label htmlFor="ubicación">Ubicación</label>
            </span>
            {getFormErrorMessage('ubicación')}
          </div>

          <div className="p-field p-col-12">
            <span className="p-float-label mt-4">
              <Dropdown
                id="linea"
                name="linea"
                options={lineas}
                onChange={(e) => {
                  const { value } = e.target;
                  formik.handleChange(e);
                  formik.setFieldValue('linea', value);
                }}
                value={formik.values.linea}
                placeholder="Seleccione una línea"
              />
              <label htmlFor="linea">Línea</label>
            </span>
            {getFormErrorMessage('linea')}
          </div>

          <div className="p-field p-col-12">
            <span className="p-float-label mt-4">
              <Dropdown
                id="asesor"
                name="asesor"
                options={userList}
                value={formik.values.asesor}  // Deberías cambiar esto al valor correcto (p. ej., .email)
                onChange={(e) => {
                  const { value } = e.target;
                  formik.setFieldValue('asesor', value);
                }}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('asesor') })}
                optionLabel="label"  // Especifica la propiedad del objeto a mostrar en el Dropdown
              />
              <label htmlFor="asesor">Asesor</label>
            </span>
            {getFormErrorMessage('asesor')}
          </div>

          <div className="p-field p-col-12">

            <span className="p-float-label mt-4">
              <InputText
                id="especialidad"
                name="especialidad"
                value={formik.values.especialidad}
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('especialidad') })}
              />
              <label htmlFor="especialidad">Especialidad</label>
            </span>
            {getFormErrorMessage('especialidad')}
          </div>

          <div className="p-field p-col-12">
            <span className="p-float-label mt-4">
              <Dropdown
                id="tipoCliente"
                name="tipoCliente"
                options={tiposCliente}
                onChange={(e) => {
                  const { value } = e.target;
                  formik.handleChange(e);
                  formik.setFieldValue('tipoCliente', value);
                }}
                value={formik.values.tipoCliente}
                placeholder="Seleccione un tipo de cliente"
              />
              <label htmlFor="tipoCliente">Tipo de Cliente</label>
            </span>
          </div>

          <div className="p-col-12 mt-4">
            <Button type="submit" label="Registrar" />
          </div>
        </div>
      </form>

    </Dialog>
  );
};

export default NewClientForm;
