import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import '@/app/styles/styles.css'
import Link from 'next/link';


const Profile = () => {
  const { data: session } = useSession();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  if (!session) {
    // Manejar el caso en el que no hay sesión
    return <div>No hay sesión.</div>;
  }

  const { email, nombre, apellido, role, cargo, foto } = session.user;
  
  const handleOpenPasswordForm = () => {
    setShowPasswordForm(true);
  };

  const handleClosePasswordForm = () => {
    setShowPasswordForm(false);
  };
  return (
    <Card  style={{ width: "150%", padding: "5px", height: "80vh" }}>
      <div className="p-grid p-fluid mt-0 mb-5">
        <div className="p-col-12">
          <h2 className="text-center mt-0 highlight-label ">Perfil de usuario</h2>
        </div>
        <div className="p-col-12 p-md-6 d-flex align-items-center justify-content-center">
          <div className="circular-image-container  d-flex align-items-center">
            <img src={foto} alt="Perfil" className="circular-image" />
          </div>
        </div>
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
            <label htmlFor="nombre" className="highlight-label">Nombre:</label>
            <div>{nombre}</div>
          </div>
        </div>
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
            <label htmlFor="apellido" className="highlight-label">Apellido:</label>
            <div>{apellido}</div>
          </div>
        </div>
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
            <label htmlFor="email" className="highlight-label">Email:</label>
            <div>{email}</div>
          </div>
        </div>
     
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
            <label htmlFor="cargo" className="highlight-label">Cargo:</label>
            <div>{cargo}</div>
          </div>
        </div>
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
          <Link href="/forget-password">
        <p>Cambiar Contraseña</p>
         </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Profile;