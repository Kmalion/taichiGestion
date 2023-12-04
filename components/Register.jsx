'use client'
import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from 'primereact/toast'


const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const toast = useRef(null);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    const { email, password, role, nombre, apellido, cargo, foto } = formObject;

    if (!isValidEmail(email)) {
      showError("Correo electrónico no válido");
      return;
    }
    if (!password || password.length < 8) {
      showError("Contraseña inválida mínima 8 caracteres");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nombre,
          apellido,
          cargo,
          role,
          foto,
        }),
      });

      if (res.status === 400) {
        showError("Este correo electrónico ya está registrado");
      }
      if (res.status === 200) {
        showSuccess("Registro exitoso");
        const data = await res.json();
        if (data && data.redirect) {
          window.location.href = data.redirect;
        } else {
          console.error("La respuesta no contiene una URL de redirección válida.");
        }
      }
    } catch (error) {
      showError("Error, vuelva a intentarlo");
      console.error(error);
    }
  };

  const showSuccess = (successMessage) => {
    setSuccessMessage(successMessage);
    toast.current.show({ severity: 'success', summary: 'Éxito', detail: successMessage });
  };

  const showError = (errorMessage) => {
    setError(errorMessage);
    toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage });
  };
  return (
    <div className=" " style={{ height: "100vh" }}>
      <Card style={{ width: "100%", padding: "20px", height: "102vh" }}>
        <form onSubmit={handleSubmit}>
      <div className="p-grid p-fluid mt-0">
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
        </div>
        <div className="p-col-12 p-md-6">
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
        </div>
        <div className="p-col-12 p-md-6">
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
        </div>
        <div className="p-col-12 p-md-6">
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
        <div className="p-col-12 p-md-6">
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
        <div className="p-col-12 mt-2">
              <Button
                label="Registrar"
                type="submit"
                className="p-d-block p-mx-auto p-mt-2 mt-2"
              />
            </div>
          </div>
      
        </form>
        <Toast ref={toast} />
  </Card>
</div>

  );
};

export default RegisterPage;
