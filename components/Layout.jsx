'use client'
import React from 'react';
import Head from 'next/head';
import MenuBar from '../components/MenuBar';
import { useTheme } from '../context/ThemeContext';
import { SessionProvider } from 'next-auth/react';

export default function Layout({ children }) {
  const { theme } = useTheme();

  const containerStyle = {
    marginLeft: '20px', // Ajusta el valor según tus necesidades
    marginRight: '20px', // Ajusta el valor según tus necesidades
  };

  return (

    <div style={containerStyle}>
      <Head>
        <link rel="stylesheet" href={`primereact/resources/themes/${theme}/theme.css`} type="text/css" key={theme} />
      </Head>
      <MenuBar />
      {children}
    </div>

  );
}