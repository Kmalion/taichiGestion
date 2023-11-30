'use client'
import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css'
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';




const Layout = ({ children }) => {
  return (
    <ThemeProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThemeProvider>
  );
};

export default Layout;