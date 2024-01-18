import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast'; // Importa el componente Toast
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'next/navigation';

const ForgetPassword = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState('');
  const router = useRouter();
  const toast = useRef(null); // Ref para el componente Toast

  useEffect(() => {
    // Lógica del tema solo en el lado del cliente
    const getLogoSrc = () => {
      return theme === 'lara-dark-teal'
        ? '/img/Taichi_logo_blanco.png'
        : '/img/Taichi_logo_negro.png';
    };

    setLogoSrc(getLogoSrc());
  }, [theme]);

  const isValidEmail = (email) => {
    // Lógica para validar el correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showSuccess = (message) => {
    toast.current.show({ severity: 'success', summary: 'Éxito', detail: message, life: 3000 });
  };

  const showError = (message) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;

    if (!isValidEmail(email)) {
      showError("Correo electrónico no válido");
      return;
    }

    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (res.status === 400) {
        showError("El usuario con este email no está registrado");
      } else if (res.status === 200) {
        showSuccess("Éxito");
        router.push("/login");
      }
    } catch (error) {
      showError("Error, vuelva a intentarlo");
      console.error(error);
    }
  };

  return (
    <div className="" style={{ height: '100vh' }}>
      <Card style={{ width: '100%', padding: '30px', height: '50vh' }}>
        <form onSubmit={handleSubmit}>
          <div className="p-grid p-fluid mt-0">
            <div className="p-col-12">
              <h2 className="text-center mt-0">Cambiar Password</h2>
            </div>
            <div className="p-col-12 p-md-6">
              <div className="p-field mt-2">
                <label style={{ textAlign: 'left', display: 'block' }} htmlFor="email">
                  Email:
                </label>
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Introduzca su email"
                  required
                  className="p-inputtext"
                />
              </div>
            </div>
            <div className="p-col-12 mt-2">
              <Button
                label="Enviar"
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

export default ForgetPassword;
