import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css"; 
import "primereact/resources/primereact.min.css"; 
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css'




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


