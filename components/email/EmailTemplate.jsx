import React from 'react';

const EmailResetTemplate = ({ resetUrl }) => {
  console.log('Valor de resetUrl en la plantilla:', resetUrl);

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src="https://taichi-holdings-colombia.com/wp-content/uploads/2023/05/LOGOWB.png" // Reemplaza "url_del_logo" con la URL o ruta de tu logo
        alt="Logo Taichi Gestion"
        style={{ width: '100px', height: '100px', marginBottom: '20px' }} // Ajusta el tamaño y el margen según sea necesario
      />
      <h1>Taichi Gestion</h1>
      <h3>Cambie su contraseña dando click en el siguiente enlace:</h3>
      <p>
        <a href={resetUrl} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none' }}>
          Restablecer Contraseña
        </a>
      </p>
    </div>
  );
};

export default EmailResetTemplate;
