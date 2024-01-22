'use client'
import React, { useState, useEffect } from 'react';
import SalesChart from '@/components/dashboard/SalesChart';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';
import SummaryItems from '../../components/dashboard/SumaryItems';
import BestProduct from '../../components/dashboard/BestProduct';

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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Hace que el contenedor ocupe el 100% de la altura de la pantalla
  };

  const spinnerStyle = {
    width: '50px',
    height: '50px',
  };

  const cardStyle = {
    width: '500px',
    height: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    <Layout>
      <div style={loading ? containerStyle : {}}>
        {loading && (
          <ProgressSpinner style={spinnerStyle} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
        )}
        {!loading && (
          <Card>
            <SummaryItems />
            <div style={{ ...containerStyle, ...{ flexDirection: 'row', gap: '20px' } }}>
              <Card className='text-center mt-2' title="Ventas" style={cardStyle}>
                <SalesChart />
              </Card>
              <div className='mt-2'>
                <BestProduct />
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
