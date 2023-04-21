import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {NavBarComponent} from "../components/NavBarComponent/NavBarComponent"
import { Inventario, Inicio } from "../pages";



export const MainRoutes = () => {
    return (
        <Router>
        <NavBarComponent></NavBarComponent>
            <Routes>
                <Route exact path="/" element={<Inicio />} />
                <Route exact path="/inventario" element={<Inventario />}/>
            </Routes>
        </Router>
    );
};