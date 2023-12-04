
'use client'

import { useEffect } from 'react';
import Cookies from 'js-cookie';

const ThemeLoader = ({ theme, onThemeChange }) => {
  useEffect(() => {
    const loadThemeStyles = async () => {
      try {
        // Obtener el tema almacenado en las cookies
        const savedTheme = Cookies.get('theme');
        const selectedTheme = savedTheme || theme; // Usa el tema guardado o el tema actual


        const themePath = `/themes/${selectedTheme}/theme.css`;
        const themeStyle = document.createElement('link');
        themeStyle.href = themePath;
        themeStyle.rel = 'stylesheet';

        // Agregar el enlace al head
        document.head.appendChild(themeStyle);

        // Actualizar el contexto del tema si se proporciona la función onThemeChange
        if (onThemeChange) {
          onThemeChange(selectedTheme);
        }
      } catch (error) {
        console.error('Error loading theme styles:', error);
      }
    };

    loadThemeStyles();
  }, [theme, onThemeChange]);

  return null; // Este componente no renderiza nada
};

export default ThemeLoader;