'use client'
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const NewProviderForm = ({ visible, onSave, onCancel }) => {
  const initialValues = {
    idp: '',
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    created: new Date(),

  };

  const handleSubmit = (values) => {
    onSave(values);
    // Puedes agregar lógica adicional aquí, como cerrar el diálogo después de guardar
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: '30vw' }}
      header="Nuevo Proveedor"
      onHide={handleCancel}
    >
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors = {};
          if (!values.idp.trim()) {
            errors.idp = 'CC / NIT es requerido';
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

          if (!values.ciudad.trim()) {
            errors.ciudad = 'La ciudad es requerida';
          }

          return errors;
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12">
              <span className="p-float-label mt-4">
                <Field type="text" id="idp" name="idp" as={InputText} />
                <label htmlFor="idp">C.C. / NIT</label>
              </span>
              <ErrorMessage name="idp" component="small" className="p-error" />
            </div>

            <div className="p-field p-col-12">
              <span className="p-float-label mt-4">
                <Field type="text" id="nombre" name="nombre" as={InputText} />
                <label htmlFor="nombre">Nombre</label>
              </span>
              <ErrorMessage name="nombre" component="small" className="p-error" />
            </div>

            <div className="p-field p-col-12">
              <span className="p-float-label mt-4">
                <Field type="text" id="contacto" name="contacto" as={InputText} />
                <label htmlFor="contacto">Contacto</label>
              </span>
              <ErrorMessage name="contacto" component="small" className="p-error" />
            </div>

            <div className="p-field p-col-12">
              <span className="p-float-label mt-4">
                <Field type="text" id="email" name="email" as={InputText} />
                <label htmlFor="email">Email</label>
              </span>
              <ErrorMessage name="email" component="small" className="p-error" />
            </div>

            <div className="p-field p-col-12">
              <span className="p-float-label mt-4">
                <Field type="text" id="telefono" name="telefono" as={InputText} />
                <label htmlFor="telefono">Teléfono</label>
              </span>
              <ErrorMessage name="telefono" component="small" className="p-error" />
            </div>

            <div className="p-field p-col-12">
              <span className="p-float-label mt-4">
                <Field type="text" id="direccion" name="direccion" as={InputText} />
                <label htmlFor="direccion">Dirección</label>
              </span>
              <ErrorMessage name="direccion" component="small" className="p-error" />
            </div>

            <div className="p-field p-col-12">
              <span className="p-float-label mt-4">
                <Field type="text" id="ciudad" name="ciudad" as={InputText} />
                <label htmlFor="ciudad">Ciudad</label>
              </span>
              <ErrorMessage name="ciudad" component="small" className="p-error" />
            </div>

            <div className="p-col-12 mt-4">
              <Button type="submit" label="Registrar" />
            </div>
          </div>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default NewProviderForm;