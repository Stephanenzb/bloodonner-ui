import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Analyse.css'; // Vous pouvez ajouter ce fichier CSS si nécessaire.

function AnalyseForm() {  // Assure-toi de passer l'email de l'utilisateur en props
  const navigate = useNavigate();
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [isSmoker, setIsSmoker] = useState(false);
  const [cigarettesPerDay, setCigarettesPerDay] = useState('');
  const [error, setError] = useState(''); 
  const email = localStorage.getItem('email');


  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem('email');
    if (!email) {
        console.error('Aucun email trouvé dans le stockage local');
        return;
    }


    if (age < 18 || age > 80) {
      setError("L'âge doit être compris entre 18 et 80 ans.");
      return;
    }

    if (isSmoker && (cigarettesPerDay <= 0 || cigarettesPerDay > 100)) {
      setError("Le nombre de cigarettes par jour doit être un nombre valide (entre 1 et 100).");
      return;
    }

    const data = {
      Gender: gender,
      Age: parseInt(age), 
      currentSmoker: isSmoker,
      cigsPerDay: isSmoker ? parseInt(cigarettesPerDay) : 0, 
    };

    try {
      // Envoie de la requête PUT à l'API pour mettre à jour les données dans Elasticsearch
      const response = await axios.put(`http://localhost:8000/api/update_blood_stats/${email}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Données mises à jour avec succès.');
        navigate('/home');  // Redirige vers la page d'accueil
      } else {
        setError('Une erreur est survenue lors de la mise à jour des informations.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
      setError("Une erreur inconnue est survenue.");
    }
  };

  return (
    <div className="analyse-form">
      <h2>Formulaire d'informations personnelles</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Sexe :</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Choisir</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>
        <div className="form-group">
          <label>Âge :</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="18"
            max="80"
          />
        </div>
        <div className="form-group">
          <label>Êtes-vous un fumeur ?</label>
          <input
            type="checkbox"
            checked={isSmoker}
            onChange={(e) => {
              setIsSmoker(e.target.checked);
              if (!e.target.checked) {
                setCigarettesPerDay(''); // Réinitialise les cigarettes si non fumeur
              }
            }}
          />
        </div>
        {isSmoker && (
          <div className="form-group">
            <label>Nombre de cigarettes par jour :</label>
            <input
              type="number"
              value={cigarettesPerDay}
              onChange={(e) => setCigarettesPerDay(e.target.value)}
              required
              min="1"
              max="100"
            />
          </div>
        )}
        <button type="submit" className="submit-button">Soumettre</button>
      </form>
      <div className="home-button-container">
        <button onClick={() => navigate('/home')} className="home-button">
          Accueil
        </button>
      </div>
    </div>
  );
}

export default AnalyseForm;
