'use client'
import React from 'react';
import MenuBar from './menu/MenuBar';
import { useTheme } from '../context/ThemeContext';
import Footer from '@/components/menu/Footer';


export default function Layout({ children }) {

  const { theme } = useTheme();

  const containerStyle = {
    marginLeft: '20px', // Ajusta el valor según tus necesidades
    marginRight: '20px', // Ajusta el valor según tus necesidades
  };

  return (

    <div style={containerStyle}>
  
      <MenuBar />
      {children}
      <Footer></Footer>
    </div>

  );
}