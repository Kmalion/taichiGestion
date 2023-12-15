'use client'

import EntrySummary from '@/components/EntrySummary';
import Layout from '@/components/Layout';
import { ThemeProvider } from '@/context/ThemeContext';


const EntryRegister = () => {

  return (
    <ThemeProvider>
    <Layout>
    <EntrySummary></EntrySummary>
    </Layout>
    </ThemeProvider>
  );
};

export default EntryRegister;
