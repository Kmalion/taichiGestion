'use client'
import React, { createContext, useContext, useState } from 'react';
import ThemeLoader from './ThemeLoader';
import Cookies from 'js-cookie';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = Cookies.get('theme');
    return savedTheme || 'lara-dark-teal';
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'lara-dark-teal' ? 'lara-light-teal' : 'lara-dark-teal';

      Cookies.set('theme', newTheme, { expires: 365 });

      return newTheme;
    });
  };

  const getLogoSrc = () => {
    return theme === 'lara-dark-teal'
      ? '/img/Taichi_logo_blanco.png'
      : '/img/Taichi_logo_negro.png';
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, getLogoSrc }}>
      <ThemeLoader theme={theme} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
