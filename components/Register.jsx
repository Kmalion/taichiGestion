'use client'

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import React, {useState} from "react"

const RegisterPage = () => {

  const [error, setError] = useState("")
 

  const isValidEmail = (email) => {
    // Expresión regular para validar el formato de un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const role = e.target[2].value;
  
    if (!isValidEmail(email)) {
      setError('Correo electrónico no válido');
      return;
    }
    if (!password || password.length < 8) {
      setError('Contraseña inválida');
      return;
    }
  
    try {
      const res = await fetch('/api/register', {  // Corregir aquí
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });
  
      if (res.status === 400) {
        setError('Este correo electrónico ya está registrado');
      }
      if (res.status === 200) {
        setError('');
      }
    } catch (error) {
      setError('Error, vuelva a intentarlo');
      console.error(error);
    }
  };
  return (

    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100vh' }}>
    <Card style={{ width: '100%', padding: '20px' }}>
      <div className="d-flex flex-center p-ai-center mb-5">
        <h2 className="text-center">Registro</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="email" className="mb-5">Email</label>
          <InputText id = "email" type="text" placeholder='Email' required className="p-inputtext p-mb-2 mb-5" />
        </div>
        <div className="p-field">
          <label htmlFor="password">Contraseña</label>
          <InputText id="password" type="password"  className="p-inputtext p-mb-2 mb-5" />
        </div>
        <div className="p-field">
          <label htmlFor="role">Rol</label>
          <InputText id="role" className="p-inputtext p-mb-2 mb-5" />
        </div>
        <Button label="Registrar" type="submit" className="p-mt-2 p-d-block p-mx-auto" />
      </form>
      <p className='text-red-600 text-[16px mb-4'>{error && error}</p>
    </Card>
  </div>

  );
};

export default RegisterPage;
