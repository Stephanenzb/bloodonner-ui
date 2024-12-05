import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DonorHistory.css'; 
import dayjs from 'dayjs'; 
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

// Récupérer la date actuelle
const today = new Date().toISOString().split('T')[0];

function DonorHistoryForm () {
  const navigate = useNavigate();
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [totalDonations, setTotalDonations] = useState('');
  const [totalVolume, setTotalVolume] = useState('');
  const [firstDonationDate, setFirstDonationDate] = useState('');
  const [error, setError] = useState('');
  

  const calculateMonthsBetween = (date1, date2) => {
    return dayjs(date2).diff(dayjs(date1), 'month'); // Différence en mois
  };
  

  useEffect(()=>{
    const fetchDonorData = async () => {
      const storedEmail = localStorage.getItem('email');
      localStorage.setItem('email', storedEmail); 
      const token = localStorage.getItem('token');
      if (!storedEmail) {
        console.error('Aucun email trouvé dans le stockage local');
        return;
      }
  
      try {
        const response = await axios.get(`https://pa2024-443414.ey.r.appspot.com/api/users/${storedEmail}`);
        const userData = response.data.user;
        console.log("Email utilisateur récupéré:", userData.email);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du donneur', error);
      }
    };
    fetchDonorData();
  },[]
)

const handleSubmit = async (e) => {
  e.preventDefault();

  const today = dayjs();
  const monthsSinceFirstDonation = calculateMonthsBetween(firstDonationDate, today);
  const monthsSinceLastDonation = calculateMonthsBetween(lastDonationDate, today);

  // Vérification de la validité des dates
  if (dayjs(firstDonationDate).isAfter(dayjs(lastDonationDate))) {
    setError("La date du premier don doit être antérieure ou égale à celle du dernier don.");
    return;
  }
  if (totalDonations < 0) {
    setError("Le nombre total de dons ne peut pas être inférieur à 0.");
    return;
  }

  const totalDonationsInt = parseInt(totalDonations, 10);
  const totalVolumeFloat = parseFloat(totalVolume);

  const data = {
    donor_history: {
      firstDonationDate,
      lastDonationDate,
      numberOfDonations: totalDonationsInt,
      totalVolumeDonated: totalVolumeFloat,
      monthsSinceFirstDonation,
      monthsSinceLastDonation,
    },
  };
  // Vérifie les valeurs
  console.log({
    firstDonationDate,
    lastDonationDate,
    totalDonations,
    totalVolume
  });

  console.log('Données envoyées à l\'API:', data);

  try {
    const storedEmail = localStorage.getItem('email');
    const response = await axios.put(`https://pa2024-443414.ey.r.appspot.com/api/donors_history/${storedEmail}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.status === 200) {
      console.log('Données mises à jour avec succès:', response.data);
      alert('Votre historique de don a été mis à jour avec succès.');
      navigate('/home');
    } else {
      setError('Une erreur est survenue lors de la mise à jour des données.');
    }
  } catch (error) {
    if (error.response) {
      console.error('Erreur réponse backend:', error.response.data);
      setError(error.response.data.detail || "Une erreur est survenue lors de la mise à jour des données.");
    } else {
      console.error('Erreur autre:', error.message);
      setError("Une erreur inconnue est survenue.");
    }
  }
};



      


  return (
    <div className="donor-history-form">
      <h2>Historique de Don</h2>
      {error && <div className="error-message">{error}</div>} 
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label>Date du premier don:</label>
          <input
            type="date"
            value={firstDonationDate}
            onChange={(e) => setFirstDonationDate(e.target.value)}
            required
            max={today} 
          />
        </div>
        <div className="form-group">
          <label>Date du dernier don:</label>
          <input
            type="date"
            value={lastDonationDate}
            onChange={(e) => setLastDonationDate(e.target.value)}
            required
            max={today} 
          />
        </div>
        <div className="form-group">
          <label>Nombre total de dons:</label>
          <input
            type="number"
            value={totalDonations}
            onChange={(e) => setTotalDonations(Math.max(0, e.target.value))} 
            required
          />
        </div>
        <div className="form-group">
          <label>Total de volume donné cumulé (en millilitres):</label>
          <input
            type="number"
            value={totalVolume}
            onChange={(e) => setTotalVolume(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Soumettre</button>
      </form>
      <div className="home-button-container">
        <button onClick={() => navigate('/home')} className="home-button">
          Accueil
        </button>
      </div>
    </div>
  );
  
};

export default DonorHistoryForm;


