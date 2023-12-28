'use client'
import React from 'react';
import SalesChart from '@/components/SalesChart';
import { Card } from 'primereact/card';
import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';
import SummaryItems from '../../components/SumaryItems';
import BestProduct from '../../components/BestProduct';

export default function Home() {
  const { data: session, status } = useSession();

  console.log(session, status);

  const containerStyle = {
    display: 'flex', // Usa flexbox
    gap: '20px',
  };

  const cardStyle = {
    width: '500px',
    height: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    <Layout>
      <Card>
        <SummaryItems />
        <div style={containerStyle}>
          <Card className='text-center mt-2' title="Ventas" style={cardStyle}>
            <SalesChart />
          </Card>
          <Card className='mt-2' >
            <BestProduct />
          </Card>
        </div>
      </Card>
    </Layout>
  );
}
