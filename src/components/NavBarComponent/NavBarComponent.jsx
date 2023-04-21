import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import { Button, Navbar } from 'react-bootstrap'
import { ThemeContext } from '../../context'
import { FaMoon, FaSun } from "react-icons/fa";

export const NavBarComponent = () => {

  const { isDarkMode, setIsDarkMode} = useContext(ThemeContext);
  console.log(isDarkMode);


  //Estilos del Navbar

  const NavBarStyles = {
    nav: isDarkMode ? "navbar-dark" : "#navbar-light",
   
  }


  
  const handleThemeChange = () =>{
    setIsDarkMode(!isDarkMode);
  }
  
return (
<div style={NavBarStyles}>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
    <Link to={'/'}> <Navbar.Brand> <Link to={"/"}>
          <img
              src="https://taichi-holdings-colombia.com/img/logotaichi.png"
              width="110"
              height="40"
              className="d-inline-block align-top"
              alt="Taichi logo"
            /></Link></Navbar.Brand></Link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav me-auto">
          
          <li class="nav-item">
            <a class="nav-link" href="#">Perfil</a>
          </li>
          <li class="nav-item">
            <Link to={'/inventario'}><a class="nav-link active">Inventario
              <span class="visually-hidden">(current)</span>
            </a></Link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">CMR Ventas</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Administracion</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Mantenimiento</a>
          </li>
        </ul>
      </div>
      <Button onClick={handleThemeChange}>{isDarkMode ? <FaSun /> : <FaMoon />}</Button>
    </div>
  </nav>
</div>
)
}
