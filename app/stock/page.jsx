'use client'
import React from 'react';
import ProductTable from '../../components/ProductTable.jsx';
import Layout from '../../components/Layout.jsx';
import { ThemeProvider } from '../../context/ThemeContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

function StockPage() {
  const { theme, toggleTheme } = useTheme();
  import(`primereact/resources/themes/${theme}/theme.css`).then(() => {
    // Puedes realizar cualquier otra inicialización después de cargar el tema
  });
  return (
    <ThemeProvider>
    <Layout>
    <div className={`app-container ${theme}`}>
    <div>
      <h2>Consulta de inventario</h2>
      <ProductTable />
    </div>
    </div>
    </Layout>
    </ThemeProvider>
  );
}

export default StockPage;
