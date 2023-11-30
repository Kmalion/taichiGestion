// ThemeLoader.jsx
import { useEffect } from 'react';

const ThemeLoader = ({ theme }) => {
  useEffect(() => {
    const loadThemeStyles = async () => {
      try {
        const themePath = `/themes/${theme}/theme.css`;
        const themeStyle = document.createElement('link');
        themeStyle.href = themePath;
        themeStyle.rel = 'stylesheet';

        // Agregar el enlace al head
        document.head.appendChild(themeStyle);
      } catch (error) {
        console.error('Error loading theme styles:', error);
      }
    };

    loadThemeStyles();
  }, [theme]);

  return null; // Este componente no renderiza nada
};

export default ThemeLoader;
