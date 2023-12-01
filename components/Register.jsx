'use client'

import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Accede a los valores de los campos de manera más estructurada usando el 'name'
    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    const { email, password, role, nombre, apellido, cargo, foto } = formObject;

    console.log(email, password, nombre, apellido, cargo, role);
    // Aquí puedes manejar la foto según tu implementación, por ejemplo, subirla a un servidor o almacenar la URL

    if (!isValidEmail(email)) {
      setError('Correo electrónico no válido');
      return;
    }
    if (!password || password.length < 8) {
      setError('Contraseña inválida');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nombre,
          apellido,
          cargo,
          role,
          foto
          // Agrega la lógica para manejar la foto aquí
        }),
      });

      if (res.status === 400) {
        setError('Este correo electrónico ya está registrado');
      }
      if (res.status === 200) {
        setError('');
        // Maneja la redirección aquí si es necesario
      }
    } catch (error) {
      setError('Error, vuelva a intentarlo');
      console.error(error);
    }
  };

  return (

    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: "100vh" }}>
    <Card style={{ width: "100%", padding: "20px", height: "90vh" }}>
      <form onSubmit={handleSubmit}>
        <div className="p-grid p-fluid">
          <div className="p-col-12">
            <h2 className="text-center mt-0">Registro</h2>
          </div>
          <div className="p-col-12 p-md-6">
            <div className="p-field mt-2">
              <label htmlFor="email">Email:</label>
              <InputText
                id="email"
                name="email"
                type="text"
                placeholder="Introduzca su email"
                required
                className="p-inputtext"
              />
            </div>
            <div className="p-field mt-2">
              <label htmlFor="password">Contraseña:</label>
              <InputText
                id="password"
                name="password"
                type="password"
                placeholder="Introduzca su password"
                className="p-inputtext"
              />
            </div>
            <div className="p-field mt-2">
              <label htmlFor="role">Rol:</label>
              <Dropdown
                id="role"
                name="role"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccione su rol"
                value={selectedRole}
                options={[
                  { label: "User", value: "user" },
                  { label: "Admin", value: "admin" },
                  { label: "Premium", value: "premium" },
                ]}
                onChange={(e) => setSelectedRole(e.value)}
              />
            </div>
          </div>
          <div className="p-col-12 p-md-6">
            <div className="p-field mt-2">
              <label htmlFor="nombre">Nombre:</label>
              <InputText
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Introduzca su nombre"
                required
                className="p-inputtext"
              />
            </div>
            <div className="p-field mt-2">
              <label htmlFor="apellido">Apellido:</label>
              <InputText
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Introduzca su apellido"
                required
                className="p-inputtext"
              />
            </div>
            <div className="p-field mt-2">
              <label htmlFor="cargo">Cargo:</label>
              <InputText
                id="cargo"
                name="cargo"
                type="text"
                placeholder="Introduzca su cargo"
                required
                className="p-inputtext"
              />
            </div>
          </div>
          <div className="p-field mt-2">
            <label htmlFor="foto">Foto:</label>
            <InputText
              id="foto"
              name="foto"
              type="text"
              placeholder="Introduzca url de su foto"
              required
              className="p-inputtext"
            />
          </div>
        </div>
        <Button
          label="Registrar"
          type="submit"
          className="p-d-block p-mx-auto p-mt-2 mt-2"
        />
      </form>
      <p className="text-red-600 text-[16px mb-4']">{error && error}</p>
    </Card>
  </div>
  );
};

export default RegisterPage;
