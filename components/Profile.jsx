import React from 'react';
import { Card } from 'primereact/card';

const Profile = ({  }) => {
  return (
    <Card style={{ width: "100%", padding: "20px", height: "50vh" }}>
      <div className="p-grid p-fluid mt-0">
        <div className="p-col-12">
          <h2 className="text-center mt-0">Perfil de Usuario</h2>
        </div>
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
            <label htmlFor="email">Email:</label>
            {/* <div>{userData.email}</div> */}
          </div>
        </div>
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
            <label htmlFor="nombre">Nombre:</label>
            {/* <div>{userData.nombre}</div> */}
          </div>
        </div>
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
            <label htmlFor="apellido">Apellido:</label>
            {/* <div>{userData.apellido}</div> */}
          </div>
        </div>
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
            <label htmlFor="role">Rol:</label>
            {/* <div>{userData.role}</div> */}
          </div>
        </div>
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
            <label htmlFor="cargo">Cargo:</label>
            {/* <div>{userData.cargo}</div> */}
          </div>
        </div>
        <div className="p-col-12 p-md-6">
          <div className="p-field mt-2">
            <label htmlFor="foto">Foto:</label>
            {/* <img src={userData.foto} alt="User Foto" style={{ maxWidth: '100%' }} /> */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Profile;
