"use client"
import React from 'react';
import { Menubar } from 'primereact/menubar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useTheme } from '../context/ThemeContext'; // Asegúrate de importar useTheme y theme
import { PrimeIcons } from 'primereact/api';

export default function MenuBar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme(); 
  // Función para manejar clics en elementos del menú
  const handleMenuClick = (path) => {
    router.push(path); // Navegar a la ruta especificada
  };

  const items = [
    {
      label: 'Inventario',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'Stock',
          icon: 'pi pi-fw pi-building',
          command: () => handleMenuClick('/stock'), // Navegar a la ruta /stock al hacer clic
        },
        {
          separator: true,
        },
        {
          label: 'Entradas',
          icon: 'pi pi-fw pi-arrow-right',
          command: () => handleMenuClick('/entradas'), // Navegar a la ruta /entradas al hacer clic
        },
        {
          label: 'Salidas',
          icon: 'pi pi-fw pi-arrow-left',
          command: () => handleMenuClick('/salidas'), // Navegar a la ruta /salidas al hacer clic
        },
        {
          label: 'Bodegas',
          icon: 'pi pi-fw pi-server',
          command: () => handleMenuClick('/bodegas'), // Navegar a la ruta /salidas al hacer clic
        },
        {
          label: 'Historial',
          icon: 'pi pi-fw pi-chart-line',
          command: () => handleMenuClick('/historial'), // Navegar a la ruta /salidas al hacer clic
        },
        
      ],
    },
    {
      label: 'Usuario',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Perfil',
          icon: 'pi pi-fw pi-user-plus',
          command: () => handleMenuClick('/perfil'), // Navegar a la ruta /perfil al hacer clic
        },
      ],
    },
    {
      label: 'Cerrar sesion',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        // Agrega aquí la lógica para cerrar sesión si es necesario
      },
    },
  ];

  const start = (
    <div>
      <Link href="/dashboard">
        {/* Ajusta la lógica de la imagen según el tema */}
        {theme === 'lara-dark-teal' ? (
          <Image src="/img/Logo taichi blanco bola.png" alt="Logo" width={50} height={50} />
        ) : (
          <Image src="/img/Logo bola negra.png" alt="Logo" width={50} height={50} />
        )}
      </Link>
    </div>
  );
  const end = (
    <div>
      <button className="p-button" onClick={toggleTheme}>
        {theme === 'lara-dark-teal' ? <i className={`pi pi-sun`} /> : <i className={`pi pi-moon`} />}
      </button>
    </div>
  );
  return (
    <div>
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}