'use client'

import React from 'react';
import SalesChart from '@/components/SalesChart';
import TotalItems from '@/components/TotalItems';
import { Card } from 'primereact/card';
import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';



export default function Home() {
  const {data: session, status} = useSession()

console.log(session, status)

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h1>Sistema de gestión de inventario</h1>
        <h3>Resumen</h3>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          {/* Primer componente */}
          <div style={{ flex: '1 1 25%' }}>
            <Card title="Ventas">
              <SalesChart />
            </Card>
          </div>

          {/* Segundo componente */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <TotalItems />
          </div>

          {/* Tercer componente */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <TotalItems />
          </div>

          {/* Cuarto componente */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <TotalItems />
          </div>
        </div>
      </div>
    </Layout>
  );
}
