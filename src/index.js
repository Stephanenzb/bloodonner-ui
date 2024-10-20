import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Link, useNavigate } from 'react-router-dom';
import logo from "./images/logo.jpg"
import logoblood from "./images/blood_donor_day.jpg"


const index = () => {
  return <div>
    <h2>Bienvenue sur la page d'accueil !</h2>
    <p>
    <img src={logoblood} alt="Logo Blood"/>
    </p>
    <p>
    <Link to="/registration" className="cta-button">Devenir Donneur</Link>
    </p>
    </div>;
  
};

export default index;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
