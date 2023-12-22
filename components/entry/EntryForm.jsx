'use client'
import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';

const EntryForm = ({ entryData, setEntryData, userList, handleSaveEntry }) => {
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      entradaNo: entryData.entradaNo || '',
      fechaEntrada: entryData.fechaEntrada || '',
      proveedor: entryData.proveedor || '',
      cliente: entryData.cliente || '',
      asigned_to: entryData.asigned_to || null,
      tipo: entryData.tipo || null,
    },
    validate: (data) => {
      const errors = {};

      if (!data.entradaNo.trim()) {
        errors.entradaNo = 'Entrada No. es requerido';
      }

      if (!data.fechaEntrada.trim()) {
        errors.fechaEntrada = 'Fecha de Entrada es requerido';
      }

      if (!data.proveedor.trim()) {
        errors.proveedor = 'Proveedor es requerido';
      }

      if (!data.cliente.trim()) {
        errors.cliente = 'Cliente es requerido';
      }

      if (!data.asigned_to) {
        errors.asigned_to = 'Asignado a es requerido';
      }

      if (!data.tipo) {
        errors.tipo = 'Tipo es requerido';
      }

      return errors;
    },
    onSubmit: (data) => {
      handleSaveEntry(data);
      toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: data.entradaNo });
      formik.resetForm();
    },
  });

  const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const tipoOptions = [
    { label: 'Compras', value: 'compras' },
    { label: 'Devoluciones', value: 'devoluciones' },
    { label: 'Ajuste', value: 'ajuste' },
  ];

  return (
    <div>
      <h3 className="text-center mt-3">Datos de entrada</h3>
      <Card className="flex flex-wrap mt-1">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-wrap gap-2 mt-2">
          <div className="p-col-12">
            <span className="p-float-label">
              <Toast ref={toast} />
              <InputText
                id="entradaNo"
                name="entradaNo"
                value={formik.values.entradaNo}
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
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
                value={formik.values.fechaEntrada}
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
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
                value={formik.values.proveedor || ''}
                onChange={(e) => {
                  setEntryData({ ...entryData, proveedor: e.target.value });
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': isFormFieldInvalid('proveedor') })}
              />
              <label htmlFor="proveedor">Proveedor</label>
            </span>
            {getFormErrorMessage('proveedor')}
          </div>

          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="cliente"
                name="cliente"
                value={formik.values.cliente || ''}
                onChange={(e) => {
                  setEntryData({ ...entryData, cliente: e.target.value });
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
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
                value={formik.values.asigned_to}
                options={userList}
                onChange={(e) => {
                  setEntryData({ ...entryData, asigned_to: e.value });
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
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
                value={formik.values.tipo}
                onChange={(e) => {
                  setEntryData({ ...entryData, tipo: e.value });
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                placeholder="Seleccionar tipo"
                className={classNames({ 'p-invalid': isFormFieldInvalid('tipo') })}
              />
              <label htmlFor="tipo">Tipo</label>
            </span>
            {getFormErrorMessage('tipo')}
          </div>

          <div className="p-col-12">
            <Button
              type="button"
              className="m-3 p-3"
              size="small"
              label="Registrar entrada"
              onClick={() => {
                // Marcar todos los campos como tocados
                formik.setTouched({
                  entradaNo: true,
                  fechaEntrada: true,
                  proveedor: true,
                  cliente: true,
                  asigned_to: true,
                  tipo: true,
                });

                // Realizar la validación manualmente
                const errors = formik.validateForm();

                // Verificar si hay errores antes de enviar
                if (Object.keys(errors).length === 0) {
                  formik.submitForm();
                }
              }}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EntryForm;
