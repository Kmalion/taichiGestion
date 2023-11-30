'use client'

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Image from 'next/image';  // Importa Image de Next.js

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí puedes agregar la lógica de autenticación, como enviar una solicitud a tu servidor.
    console.log('Iniciar sesión con:', username, password);
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100vh' }}>
      <Card style={{ width: '100%', padding: '20px' }}>
        <div className="d-flex flex-center p-ai-center mb-5">
        <div className="p-d-flex p-jc-center mb-2">
            <Image src="/img/Taichi logo blanco SAS.png" alt="Logo" width={300} height={100} />
          </div>
          <h2 className="text-center">Iniciar Sesión</h2>
        </div>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="username" className="mb-5">Usuario</label>
            <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="p-inputtext p-mb-2 mb-5" />
          </div>
          <div className="p-field">
            <label htmlFor="password">Contraseña</label>
            <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-inputtext p-mb-2 mb-5" />
          </div>
          <Button label="Iniciar Sesión" onClick={handleLogin} className="p-mt-2 p-d-block p-mx-auto" />
        </div>
      </Card>
    </div>
  );
};

export default Login;
