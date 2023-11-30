'use client'

import React, { createContext, useContext, useState } from 'react';
import ThemeLoader from './ThemeLoader';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('lara-dark-teal');

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'lara-dark-teal') {
        return 'lara-light-teal'; // Cambiar a tema claro
      } else if (prevTheme === 'lara-light-teal') {
        return 'lara-dark-teal'; // Cambiar a tema oscuro
      } else {
        return 'lara-dark-teal'; // Valor predeterminado, por si acaso
      }
    });
  };
  

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeLoader theme={theme} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};