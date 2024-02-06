'use client'

import OutflowSummary from '@/components/outflows/OutflowSummary';
import Layout from '@/components/Layout';
import { ThemeProvider } from '@/context/ThemeContext';


const OutflowRegister = () => {

  return (
    <ThemeProvider>
    <Layout>
    <OutflowSummary></OutflowSummary>
    </Layout>
    </ThemeProvider>
  );
};

export default OutflowRegister;
