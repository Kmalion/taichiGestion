'use client'
import React, { useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import clientService from '@/service/clientService';
import { useRouter } from 'next/navigation';

const ClientForm = ({ showDialog, hideDialog, onSubmit}) => {
  const toast = useRef(null);
  const router = useRouter();

const showToast = (severity, summary, detail) => {
  toast.current.show({
    severity,
    summary,
    detail,
    life: 3000,
    onClose: () => {
      // Cerrar el diálogo
      hideDialog && hideDialog();
      
      // Redirigir a /clientes después de cerrar el diálogo
      router.push('/clientes');
    },
  });
};

  return (
    <Dialog
    visible={showDialog}
    style={{ width: '30vw' }}
    header="Nuevo Cliente"
    onHide={() => {
      // Cerrar el diálogo y, si es necesario, llamar a la función hideDialog proporcionada
      hideDialog && hideDialog();
    }}
  >
      <Toast ref={toast} />
      <Formik
        initialValues={{
          idc: '',
          nombre: '',
          contacto: '',
          email: '',
          telefono: '',
          direccion: '',
          ciudad: '',
          created: new Date(), // Inicializar 'created' con la fecha actual
        }}
        validate={(values) => {
          const errors = {};

          // Validaciones
          if (!values.idc.trim()) {
            errors.idc = 'CC / NIT es requerido';
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
        onSubmit={(values, { resetForm }) => {
          // ... (lógica de validación y envío)

          clientService
          .createClient(values)
          .then(() => {
            // Muestra el Toast de éxito
            showToast('success', 'Éxito', 'Cliente registrado correctamente');
            // También puedes intentar resetear el formulario después de mostrar el Toast
            resetForm();
          })
          .catch((error) => {
            // Muestra el Toast de error
            showToast(
              'error',
              'Error al crear el cliente',
              'Hubo un problema al crear el cliente. Por favor, inténtalo de nuevo.'
            );
          });
      }}
    >
        <Form>
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12">
              <span className="p-float-label mt-4">
                <Field type="text" id="idc" name="idc" as={InputText} />
                <label htmlFor="idc">C.C. / NIT</label>
              </span>
              <ErrorMessage name="idc" component="small" className="p-error" />
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

export default ClientForm;
