'use client'
import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';

// Crea el componente del primer formulario
const EntryForm = ({ entryData, setEntryData, userList, handleSaveEntry }) => {
  const toast = useRef(null);
  const formik = useFormik({
    initialValues: {
      value: ''
    },
    validate: (data) => {
      // ...
    },
    onSubmit: (data) => {
      // Cambia esta línea para utilizar los valores del formulario en el handleSaveEntry
      handleSaveEntry(data);
      formik.resetForm();
    }
  });

  const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
  };

  const tipoOptions = [
    { label: 'Compras', value: 'compras' },
    { label: 'Devoluciones', value: 'devoluciones' },
    { label: 'Ajuste', value: 'ajuste' },
  ];

  return (
    <div>   <h3 className='text-center mt-3'>Datos de entrada</h3>
      <Card className='flex flex-wrap mt-1'>
        <form onSubmit={formik.handleSubmit} className="flex flex-wrap gap-2 mt-2">
          <div className="p-col-12">
            <span className="p-float-label">
              <Toast ref={toast} />
              <InputText
                id="entradaNo"
                name="entradaNo"
                value={entryData.entradaNo}
                onChange={(e) => setEntryData({ ...entryData, entradaNo: e.target.value })}
                className={classNames({ 'p-invalid': isFormFieldInvalid('entradaNo') })}
              />
              <label htmlFor="entradaNo">Entrada No.</label>
            </span>
            {getFormErrorMessage('entradaNo')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="fechaEntrada"
                name="fechaEntrada"
                value={entryData.fechaEntrada}
                onChange={(e) => setEntryData({ ...entryData, fechaEntrada: e.target.value })}
                className={classNames({ 'p-invalid': isFormFieldInvalid('fechaEntrada') })}
              />
              <label htmlFor="fechaEntrada">Fecha de Entrada</label>
            </span>
            {getFormErrorMessage('fechaEntrada')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="proveedor"
                name="proveedor"
                value={entryData.proveedor || ''}
                onChange={(e) => {
                  console.log('Proveedor cambiado:', e.target.value);
                  setEntryData({ ...entryData, proveedor: e.target.value });
                }}
                className={classNames({ 'p-invalid': isFormFieldInvalid('proveedor') })}
              />

              <label htmlFor="proveedor">Proveedor</label>
            </span>
            {getFormErrorMessage('proveedor')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="cliente" // Nuevo campo para el cliente
                name="cliente"
                value={entryData.cliente || ''}
                onChange={(e) => {
                  console.log('Cliente cambiado:', e.target.value);
                  setEntryData({ ...entryData, cliente: e.target.value });
                }}
                className={classNames({ 'p-invalid': isFormFieldInvalid('cliente') })}
              />
              <label htmlFor="cliente">Cliente</label>
            </span>
            {getFormErrorMessage('cliente')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <Dropdown
                id="asigned_to"
                name="asigned_to"
                optionLabel="label"
                value={entryData.asigned_to}
                options={userList}
                onChange={(e) => setEntryData({ ...entryData, asigned_to: e.value })}
                placeholder="Seleccionar usuario"
                className={classNames({ 'p-invalid': isFormFieldInvalid('asigned_to') })}
              />
              <label htmlFor="asigned_to">Asignado a</label>
            </span>
            {getFormErrorMessage('asigned_to')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <Dropdown
                id="tipo"
                name="tipo"
                options={tipoOptions}
                value={entryData.tipo}
                onChange={(e) => {
                  console.log('Tipo cambiado:', e.value);
                  setEntryData({ ...entryData, tipo: e.value });
                }}
                placeholder="Seleccionar tipo"
                className={classNames({ 'p-invalid': isFormFieldInvalid('tipo') })}
              />

              <label htmlFor="tipo">Tipo</label>
            </span>
            {getFormErrorMessage('tipo')}
          </div>

          <div className="p-col-12">
          <Button
  className="m-3 p-3"
  size="small"
  label="Registar entrada"
  onClick={(e) => {
    handleSaveEntry();
  }}
/>
          </div>
        </form>
      </Card>
      </div>  
  );
};

export default EntryForm;
