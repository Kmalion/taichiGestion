import { Inter } from 'next/font/google';
import 'primereact/resources/themes/lara-dark-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import MenuBar from '../components/MenuBar.jsx';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Taichi Gestion',
  description: 'Gestion Taichi Holdings',
};

export default function Layout({ children }) {

  return (
  <div>
    <MenuBar></MenuBar>
    {children}
  </div>
  )
}