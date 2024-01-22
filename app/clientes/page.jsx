'use client'
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import { ThemeProvider } from '../../context/ThemeContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ProgressSpinner } from 'primereact/progressspinner';
import ClientSummary from '@/components/clientes/ClientSummary.jsx';

function StockPage() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula una carga asincrónica para el ejemplo.
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Limpia el temporizador cuando el componente se desmonta.
    return () => clearTimeout(timeout);
  }, []);

  const containerStyle = {
    display: 'flex', // Usa flexbox
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Hace que el contenedor ocupe el 100% de la altura de la pantalla
  };

  const spinnerStyle = {
    width: '50px',
    height: '50px',
  };

  return (
    <ThemeProvider>
      <Layout>
        <div style={loading ? containerStyle : {}}>
          {loading && (
            <ProgressSpinner style={spinnerStyle} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
          )}
          {!loading && (
            <div className={`app-container ${theme}`}>
              <div>
                <h3 className='pagetitle text-center'>Clientes</h3>
                <ClientSummary></ClientSummary>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ThemeProvider>
  );
}

export default StockPage;
