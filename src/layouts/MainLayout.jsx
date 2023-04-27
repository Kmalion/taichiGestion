import React, { useContext } from "react";
import { ThemeContext } from "../context";

export const MainLayout = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext);
  console.log("NAVBAR >" + isDarkMode);

  const mainLayoutStyles = {
    backgroundColor: isDarkMode ? "#1D1E27" : "#F1F5F5",
    color: isDarkMode ? "#CEDFDF" : "#3A4343",
    minHeight: "100vh",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
  };

  return <div style={mainLayoutStyles}>{children}</div>;
};
