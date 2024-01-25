'use client'
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';
import SummaryItems from '../../components/dashboard/SumaryItems';
import BestProduct from '../../components/dashboard/BestProduct';
import SalesChart from '../../components/dashboard/SalesChart';
import '@/app/styles/styles.css';

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const spinnerStyle = {
    width: '50px',
    height: '50px',
  };


  return (
    <Layout>
      <div style={loading ? containerStyle : {}}>
        {loading && (
          <ProgressSpinner style={spinnerStyle} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
        )}
        {!loading && (
          <div className='mt-3' >

            <div class="grid">
              <div class="col-12">
                <SummaryItems />
              </div>
              <div class="col-6">
                <Card>
              <SalesChart  />
              </Card>
              </div>
              <div class="col-6">
              <BestProduct />
              </div>
              </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
