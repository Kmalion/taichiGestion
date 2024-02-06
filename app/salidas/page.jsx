'use client'
import React from 'react';
import OutflowTable from '@/components/outflows/outflowTable.jsx';
import Layout from '../../components/Layout.jsx';
import { ThemeProvider } from '../../context/ThemeContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import '../styles/styles.css'

function OutflowsPage() {

  const { theme, toggleTheme } = useTheme();
  import(`primereact/resources/themes/${theme}/theme.css`).then(() => {
    // Puedes realizar cualquier otra inicialización después de cargar el tema
  });

  return (
    <ThemeProvider>
    <Layout>
    <div>
      <h3 className='pagetitle text-center' >Historial de salidas</h3>
    </div>
    <div>
      <OutflowTable></OutflowTable>
    </div>
    </Layout>
    </ThemeProvider>
  );
}

export default OutflowsPage;
