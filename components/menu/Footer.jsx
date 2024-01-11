import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const empresaName = "Taichi Holdings Colombia"; // Reemplaza con el nombre de tu empresa

  return (
    <footer className="bg-gray-800 text-white text-center p-1"> {/* Modifica el valor de p-2 según tu preferencia */}
      <p>&copy; {currentYear} {empresaName}. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
