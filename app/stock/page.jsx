'use client'
import React from 'react';
import Layout from '../../components/Layout.jsx';
import { ThemeProvider } from '../../context/ThemeContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import ProductTable from '@/components/product/ProductTable.jsx';

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
      <h3 className='pagetitle text-center'>Consulta de inventario</h3>
      <ProductTable></ProductTable>
    </div>
    </div>
    </Layout>
    </ThemeProvider>
  );
}

export default StockPage;