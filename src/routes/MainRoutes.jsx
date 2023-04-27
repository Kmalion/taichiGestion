import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBarComponent } from "../components/NavBarComponent/NavBarComponent";
import { Inventario, Inicio, Login } from "../pages";
import { SideBarComponent } from "../components/SideBarComponent/SideBarComponent";


export const MainRoutes = () => {
  return (
    <Router>
      <NavBarComponent></NavBarComponent>
      <SideBarComponent></SideBarComponent>
      <Routes>
        <Route exact path="/" element={<Inicio />} />
        <Route exact path="/inventario" element={<Inventario />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};
