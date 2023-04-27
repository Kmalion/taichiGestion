import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context";
import { FaMoon, FaSun } from "react-icons/fa";
import { TabMenu } from "primereact/tabmenu";
import { Button } from "primereact/button";

export const NavBarComponent = () => {
  const items = [
    { label: "Perfil", icon: "pi pi-fw pi-home" },
    { label: "Inventario", icon: "pi pi-fw pi-calendar" },
    { label: "CMR Ventas", icon: "pi pi-fw pi-pencil" },
    { label: "Administracion", icon: "pi pi-fw pi-file" },
    { label: "Mantenimiento", icon: "pi pi-fw pi-cog" },
  ];
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  console.log(isDarkMode);

  //Estilos del Navbar

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div>
      <TabMenu model={items}></TabMenu>
      <div className="flex flex-row-reverse">
        <Button className="flex flex-row-reverse" onClick={handleThemeChange}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </Button>
      </div>
    </div>
  );
};
