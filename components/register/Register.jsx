'use client'
import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from 'primereact/toast'
import { FileUpload } from "primereact/fileupload";
import axios from 'axios';
import { useSession } from 'next-auth/react';

const RegisterPage = () => {
  const { data: session } = useSession();
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const toast = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const isAdmin = session?.user?.role === 'admin';

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("foto", selectedFile);
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
      let imageUrl = null;

      if (selectedFile) {
        // Si se selecciona un nuevo archivo, súbelo
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const uploadResponse = await axios.post('/api/upload', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrl = uploadResponse.data.url;
      }

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
          foto: imageUrl, // Utiliza la URL de la imagen cargada
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
    toast.current.show({ severity: 'success', summary: 'Éxito', detail: successMessage, life: 5000 });
  };

  const showError = (errorMessage) => {
    setError(errorMessage);
    toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
  };

  const onFileChange = (e) => {
    const file = e.files && e.files.length > 0 ? e.files[0] : null;
    setSelectedFile(file);
    console.log("Archivo seleccionado:", file);
  };

  const showNoCredentialsMessage = () => {
    return (
      <Card style={{ width: "100%", padding: "20px", textAlign: "center" }}>
        <img src="img/triste.png" alt="Triste" style={{ maxWidth: "100px" }} />
        <h4>No tienes credenciales para crear usuarios.</h4>
      </Card>
    );
  };

  
  return (
    <div className=" " style={{ height: "150vh" }}>
      {isAdmin ? (
      <Card style={{ width: "100%", padding: "20px", height: "140vh" }}>
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
                <FileUpload
                  name="file"
                  url="/api/upload"
                  accept="image/*"
                  maxFileSize={1000000}
                  emptyTemplate={<p className="m-0">Arrastre la imagen para subirla</p>}
                  chooseLabel="Escoger"
                  uploadLabel="Subir"
                  cancelLabel="Cancelar"
                  onSelect={onFileChange}
                />
              </div>
            </div>
            <div className="p-col-12 mt-2">
              <Button
                label="Registrar"
                type="submit"
                className="p-d-block p-mx-auto p-mt-2 mt-2"
                disabled={!isAdmin} // Deshabilita el botón si no es admin
              />
            </div>
          </div>

        </form>
        <Toast ref={toast} />
      </Card>
       ) : (
        showNoCredentialsMessage()
      )}
    </div>

  );
};

export default RegisterPage;
