'use client'
import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import 'primereact/resources/themes/lara-light-purple/theme.css'
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Providers from '@/utils/Providers';
import { locale, addLocale } from 'primereact/api';
import filterTranslations from '@/utils/filterTranslations.json';
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5



const Layout = ({ children }) => {
  locale('es');
    addLocale('es', { filter: filterTranslations });
  
  return (
    <ThemeProvider>

        <html lang="en">
          <body>
            <Providers>
            {children}
          </Providers>
          </body>
        </html>

    </ThemeProvider>
  );
};

export default Layout;
