'use client'
import React from 'react';
import EntryTable from '../../components/entry/EntryTable';
import Layout from '../../components/Layout.jsx';
import { ThemeProvider } from '../../context/ThemeContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import '../styles/styles.css'

function EntradasPage() {

  const { theme, toggleTheme } = useTheme();
  import(`primereact/resources/themes/${theme}/theme.css`).then(() => {
    // Puedes realizar cualquier otra inicialización después de cargar el tema
  });

  return (
    <ThemeProvider>
    <Layout>
    <div>
      <h3 className='pagetitle text-center' >Historial de entradas</h3>
    </div>
    <div>
      <EntryTable></EntryTable>
    </div>
    </Layout>
    </ThemeProvider>
  );
}

export default EntradasPage;
