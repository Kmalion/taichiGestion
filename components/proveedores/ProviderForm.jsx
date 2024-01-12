import React, { useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import providerService from '@/service/providerService'; // Ajusta la importación según tu estructura de carpetas
import { useRouter } from 'next/navigation';

const ProvidersForm = ({ showDialog, hideDialog, onSubmit }) => {
  const toast = useRef(null);
  const router = useRouter();

  const showToast = (severity, summary, detail) => {
    toast.current.show({
      severity,
      summary,
      detail,
      life: 3000,
      onClose: () => {
        hideDialog && hideDialog();
        router.push('/proveedores');
      },
    });
  };
  return (
    <Dialog
      visible={showDialog}
      style={{ width: '30vw' }}
      header="Nuevo Proveedor"
      onHide={() => hideDialog && hideDialog()}
    >
      <Toast ref={toast} />
      <Formik
        initialValues={{
          idp: '',
          nombre: '',
          contacto: '',
          email: '',
          telefono: '',
          direccion: '',
          ciudad: '',
          created: new Date(),
          // Agrega más campos aquí
        }}
        validate={(values) => {
            const errors = {};
  
            if (!values.idp.trim()) {
              errors.idp = 'ID Proveedor es requerido';
            }
  
            if (!values.nombre.trim()) {
              errors.nombre = 'El nombre es requerido';
            }
  
            if (!values.contacto.trim()) {
              errors.contacto = 'El contacto es requerido';
            }
  
            if (!values.email.trim()) {
              errors.email = 'El email es requerido';
            } else if (
              !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,4}$/.test(values.email)
            ) {
              errors.email = 'Ingrese un correo electrónico válido';
            }
  
            if (!values.telefono.trim()) {
              errors.telefono = 'El teléfono es requerido';
            } else if (!/^\d+$/.test(values.telefono)) {
              errors.telefono = 'Ingrese un número de teléfono válido';
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
          providerService
            .createProvider(values)
            .then(() => {
              showToast('success', 'Éxito', 'Proveedor registrado correctamente');
              resetForm();
            })
            .catch((error) => {
              showToast(
                'error',
                'Error al crear el proveedor',
                'Hubo un problema al crear el proveedor. Por favor, inténtalo de nuevo.'
              );
            });
        }}
      >
        <Form>
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12">
              <span className="p-float-label mt-4">
                <Field type="text" id="idp" name="idp" as={InputText} />
                <label htmlFor="idp">ID Proveedor</label>
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

            {/* Agrega más campos aquí */}

            <div className="p-col-12 mt-4">
              <Button type="submit" label="Registrar" />
            </div>
          </div>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default ProvidersForm;