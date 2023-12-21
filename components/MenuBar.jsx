"use client"
import React, { useEffect, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { signOut, useSession } from 'next-auth/react';
import { Avatar } from 'primereact/avatar';

export default function MenuBar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    const getLogoSrc = () => {
      return theme === 'lara-dark-teal'
        ? '/img/Logo_taichi_blanco_bola.png'
        : '/img/Logo_bola_negra.png';
    };

    setLogoSrc(getLogoSrc());
  }, [theme]);

  const handleMenuClick = (path) => {
    router.push(path);
  };

  const handleLogout = async () => {
    await signOut();
    await new Promise((resolve) => setTimeout(resolve, 100)); // Espera 100 milisegundos
    router.push('/login');
  };

  const items = [
    {
      label: 'Inventario',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'Stock',
          icon: 'pi pi-fw pi-building',
          command: () => handleMenuClick('/stock'),
        },
        {
          separator: true,
        },
        {
          label: 'Entradas',
          icon: 'pi pi-fw pi-arrow-right',
          command: () => handleMenuClick('/entradas'),
        },
        {
          label: 'Salidas',
          icon: 'pi pi-fw pi-arrow-left',
          command: () => handleMenuClick('/salidas'),
        },
        {
          label: 'Bodegas',
          icon: 'pi pi-fw pi-server',
          command: () => handleMenuClick('/bodegas'),
        },
        {
          label: 'Historial',
          icon: 'pi pi-fw pi-chart-line',
          command: () => handleMenuClick('/historial'),
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
          command: () => handleMenuClick('/perfil'),
        },
        {
          label: 'Listado de usuarios',
          icon: 'pi pi-fw pi-user',
          command: () => handleMenuClick('/usuarios'),
        },
      ],
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-power-off',
      command: () => handleLogout('/login'),
    },
  ];

  const start = (
    <div>
      <Link href="/dashboard">
        <Image src={logoSrc} alt="Logo" width={50} height={50} />
      </Link>
    </div>
  );

  const end = (
    <div className="flex flex-wrap gap-2">
      <div className="flex flex-wrap gap-2">
        <button className="p-button p-button-text p-button-sm" onClick={toggleTheme}>
          {theme === 'lara-dark-teal' ? <i className={`pi pi-sun`} /> : <i className={`pi pi-moon`} />}
        </button>
  
        {session && (
          <Link href="/perfil">
            <Avatar
              image={session.user.foto || '/img/generic-avatar.png'} // Ruta predeterminada si la foto está vacía
              shape="circle"
              size="large"
            />
          </Link>
        )}
      </div>
    </div>
  );
  

  return (
    <div>
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
