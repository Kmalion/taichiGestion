'use client'
import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import 'primereact/resources/themes/lara-light-purple/theme.css'
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Providers from '@/utils/Providers';


const Layout = ({ children }) => {
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
