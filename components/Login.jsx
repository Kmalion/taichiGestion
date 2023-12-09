'use client'

import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast'; // Importa el componente Toast
import { useTheme } from '../context/ThemeContext';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState('');
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const res = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        showToast(); // Muestra el Toast en caso de error
      }

      if (res?.ok) return router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const showToast = () => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
  };

  return (
    <div className="" style={{ height: '100vh' }}>
      <Card style={{ width: '100%', padding: '30px', height: '70vh' }}>
        <form onSubmit={handleSubmit}>
          <div className="p-grid p-fluid mt-0">
            <div className="p-d-flex p-jc-center mb-2">
              {/* Utiliza la función getLogoSrc desde el contexto para obtener la ruta de la imagen */}
              <Image src={logoSrc} alt="Logo" width={300} height={100} />
            </div>
            <div className="p-col-12">
              <h2 className="text-center mt-0">Inicia sesión</h2>
            </div>
            <div className="p-col-12 p-md-6">
              <div className="p-field mt-2">
                <label style={{ textAlign: 'left', display: 'block' }} htmlFor="email">
                  Email:
                </label>
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
                <label style={{ textAlign: 'left', display: 'block' }} htmlFor="password">
                  Contraseña:
                </label>
                <InputText
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Introduzca su contraseña"
                  className="p-inputtext"
                />
              </div>
            </div>
            <div className="p-col-12 mt-2">
              <Button
                label="Iniciar sesion"
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

export default Login;
