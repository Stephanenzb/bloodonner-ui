import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../styles/RegistrationPage.css';
import logo from "../images/logo.jpg"

const RegistrationPage = () => {
  const [userType, setUserType] = useState('donor'); // 'donor' ou 'admin'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate(); 

  // Fonction pour gérer l'inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = {
      username,
      email,
      password,
      role: userType,
    };
    

    try {
      const response = await axios.post(
        'https://my-app-1007139059424.europe-west3.run.app/api/register', 
        formData, 
        { headers: { 'Content-Type': 'application/json' } }
      );      
      console.log('Inscription réussie :', response.data);
      alert('Inscription réussie !');
      navigate('./'); 
    } catch (error) {
      console.error('Erreur lors de l\'inscription', error.response.data);
      alert(`Erreur lors de l'inscription : ${error.response.data.message}`);
    }
  };

  
// Fonction pour gérer la connexion
const handleLogin = async (e) => {
  e.preventDefault();

  // Construire l'URL avec les paramètres de requête
  const loginUrl = `https://my-app-1007139059424.europe-west3.run.app/api/login?email=${encodeURIComponent(loginEmail)}&password=${encodeURIComponent(loginPassword)}`;

  try {
    const response = await axios.post(loginUrl, null, {
      headers: { 'Content-Type': 'application/json' }
    });

    const { token, role } = response.data; // Déstructure le token et le rôle
    localStorage.setItem('token', token);
    localStorage.setItem('email', loginEmail);
    localStorage.setItem('role', role); 

    alert(`Connexion réussie ! Rôle de l'utilisateur : ${role}`);

    // Redirection en fonction du type d'utilisateur
    if (role === 'donor') {
      navigate('/home');
    } else if (role === 'admin') {
      navigate('/admin-home');
    }
  } catch (error) {
    console.error('Erreur lors de la connexion', error.response ? error.response.data : error.message);
    alert(`Erreur lors de la connexion : ${error.response?.data?.message || error.message}`);
  }
};


  return (
    <div className="registration-page">
      <h2>Formulaire d'Inscription / Connexion</h2>
      <div className="user-type-selector">
        <button onClick={() => setUserType('donor')} className={userType === 'donor' ? 'active' : ''}> Donneur</button>
        <button onClick={() => setUserType('admin')} className={userType === 'admin' ? 'active' : ''}>Admin / Professionnel de Santé</button>
      </div>

      <div className="form-container">
        {/* Formulaire d'inscription */}
        <div className="form-cube">
          <h3>{userType === 'donor' ? 'Inscription Donneur' : 'Inscription Administrateur'}</h3>
          <form onSubmit={handleRegister}>
            <label>
              Nom :
              <input
                type="text"
                required
                value={username}
                placeholder="Mon Nom"
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Email :
              <input
                type="email"
                required
                value={email}
                placeholder="MonMail@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Mot de passe :
              <input
                type="password"
                required
                value={password}
                placeholder="Mon MotDePasse"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit">S'inscrire</button>
          </form>
        </div>

        {/* Formulaire de connexion */}
        <div className="form-cube">
          <h3>{userType === 'donor' ? 'Connexion Donneur' : 'Connexion Administrateur'}</h3>
          <form onSubmit={handleLogin}>
            <label>
              Email :
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </label>
            <label>
              Mot de passe :
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </label>
            <button type="submit">Se connecter</button>
          </form>
        </div>
      </div>
      <div>
      <button onClick={() => navigate('/index')} className="home-button">
                    Accueil
      </button>
    </div>
    </div>
    
  );
};

export default RegistrationPage;
