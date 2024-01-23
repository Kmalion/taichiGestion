'use client'
import React, { useState, useEffect } from 'react';
import SalesChart from '@/components/dashboard/SalesChart';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';
import SummaryItems from '../../components/dashboard/SumaryItems';
import BestProduct from '../../components/dashboard/BestProduct';
import '@/app/styles/styles.css';

export default function Home() {
  const { data: session, status } = useSession();
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
    flexDirection: 'column', // Organiza los elementos en columnas
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Hace que el contenedor ocupe el 100% de la altura de la pantalla
  };

  const spinnerStyle = {
    width: '50px',
    height: '50px',
  };


// Estilo del Card
const cardStyleBestProduct = {
  width: '95vw',
  height: '450px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: 'auto',
  marginTop: '10px',
  display: 'flex', // Usa flexbox
  flexDirection: 'column', // Apila los elementos en columna
  justifyContent: 'space-between', // Distribuye el espacio entre los elementos
}
const cardStyle = {
  width: '95vw',
  height: '250px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: 'auto',
  marginTop: '10px',
  display: 'flex', // Usa flexbox
  flexDirection: 'column', // Apila los elementos en columna
  justifyContent: 'space-between', // Distribuye el espacio entre los elementos
};

// Estilo del componente BestProduct
const bestProductCardStyle = {
  width: '100%', // Ajusta según sea necesario
  flex: '1', // Permite que BestProduct ocupe el espacio disponible
};



  return (
    <Layout>
      <div style={loading ? containerStyle : {}}>
        {loading && (
          <ProgressSpinner style={spinnerStyle} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
        )}
        {!loading && (
          <div className='mt-3' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card style={cardStyle}>
              <div className="card-content">
                <SummaryItems />
              </div>
            </Card>
            
            <Card style={cardStyleBestProduct}>
              <div className="flex justify-content-between p-grid">
                <div className='col'>
                <BestProduct style={bestProductCardStyle} />
                </div>
                <div className='col-md-6 p-6'>
                <SalesChart  />
                </div>
                <div className='col'>
                <BestProduct style={bestProductCardStyle} />
                </div>
              
              </div>
            </Card>

          </div>
        )}
      </div>
    </Layout>
  );
}

