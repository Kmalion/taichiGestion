import React from 'react';

const EmailResetTemplate = ({ resetUrl }) => {
  console.log('Valor de resetUrl en la plantilla:', resetUrl);

  return (
    <div>
      <h1>Taichi Gestion</h1>
      <h3>Cambie su contraseña dando click en el siguiente link</h3>
      <p>{resetUrl}</p>
    </div>
  );
};


export default EmailResetTemplate;
