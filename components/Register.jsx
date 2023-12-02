'use client'
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dialogClass = successMessage ? "success-dialog" : "error-dialog";

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
      }
    } catch (error) {
      showError("Error, vuelva a intentarlo");
      console.error(error);
    }
  };

  const showDialog = (message) => {
    setDialogMessage(message);
    setDialogVisible(true);
    // Limpiar mensajes de éxito y error después de un tiempo
    setTimeout(() => {
      setDialogMessage("");
      setSuccessMessage("");
      setError("");
      setDialogVisible(false);
    }, 3000);
  };

  const showSuccess = (successMessage) => {
    setSuccessMessage(successMessage);
    showDialog(successMessage);
  };

  const showError = (errorMessage) => {
    setError(errorMessage);
    showDialog(errorMessage);
  };

  return (
    <div className=" " style={{ height: "100vh" }}>
      <Card style={{ width: "250%", padding: "20px", height: "115vh" }}>
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
          <Dialog
            header={successMessage ? "Mensaje de Éxito" : "Mensaje de Error"}
            visible={dialogVisible && (error || successMessage)}
            className={dialogClass}
            style={{ width: "400px" }}
            onHide={() => setDialogVisible(false)}
          >
            {successMessage && <p>{successMessage}</p>}
            {error && <p>{error}</p>}
          </Dialog>
        </form>

  </Card>
</div>

  );
};

export default RegisterPage;
