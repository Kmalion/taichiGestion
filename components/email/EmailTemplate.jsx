import React from 'react';
import Image from 'next/image';

const EmailResetTemplate = ({ resetUrl }) => {
  

  return (
    <div style={{ textAlign: 'center' }}>
      {/* <Image
        src="https://taichi-holdings-colombia.com/wp-content/uploads/2023/05/LOGOWB.png"
        alt="Logo Taichi Gestion"
        width={100}
        height={100}
        style={{ marginBottom: '20px' }} // Ajusta el margen según sea necesario
      /> */}
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
