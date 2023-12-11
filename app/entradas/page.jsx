'use client'
import React from 'react';
import EntradasTable from '../../components/EntradasTable';
import Layout from '../../components/Layout.jsx';
import { ThemeProvider } from '../../context/ThemeContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

function EntradasPage() {

  const { theme, toggleTheme } = useTheme();
  import(`primereact/resources/themes/${theme}/theme.css`).then(() => {
    // Puedes realizar cualquier otra inicialización después de cargar el tema
  });

  return (
    <ThemeProvider>
    <Layout>
    <div>
      <h1>Entradas</h1>
      <EntradasTable/>
    </div>
    </Layout>
    </ThemeProvider>
  );
}

export default EntradasPage;
