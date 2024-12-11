import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

function DonorHome() {
  const [points, setPoints] = useState(0);
  const [totalVolume,setTotalVolume] = useState(0);
  const [nextAppointmentDate, setNextAppointmentDate] = useState('');
  const [nextAppointmentTime, setNextAppointmentTime] = useState('');
  const [NextAppointmentStatus, setNextAppointmentStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [donorData, setDonorData] = useState(null);
  const email = localStorage.getItem('email'); 


  useEffect(() => {
    const fetchDonorData = async () => {
        const email = localStorage.getItem('email');
        if (!email) {
            console.error('Aucun email trouvé dans le stockage local');
            return;
        }

        try {
            const response = await axios.get(`https://my-app-1007139059424.europe-west3.run.app/api/users/${email}`);
            const userData = response.data.user;
            setDonorData(userData);
            setPoints(userData.points || 0);
            setTotalVolume(userData.totalVolume || 0);
        } catch (error) {
            console.error('Erreur lors de la récupération des données du donneur', error);
        }
    };
    const fetchAppointmentsData = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
          console.error('Aucun email trouvé dans le stockage local');
          return;
      }
      try {
          const response = await axios.get(`https://my-app-1007139059424.europe-west3.run.app/api/appointment/${email}`);
          const userAppointment = response.data.user;
          setNextAppointmentStatus(userAppointment.status);
          setNextAppointmentDate(userAppointment.dateRendezVous);
          setNextAppointmentTime(userAppointment.timeRendezVous);
      } catch (error) {
          console.error('Erreur lors de la récupération des données des rendez-vous', error);
      }
    };
    fetchAppointmentsData();
    fetchDonorData();
}, []); 

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const handleLogout = () => {
  localStorage.removeItem('token'); 
  localStorage.removeItem('email'); 
  navigate('../index'); 
};

if (!donorData) {
  return <div>Chargement des données...</div>; 
}

const donorHistory = donorData.donor_history || {}; 

  return (
    <div className="home-container">
      <h2>Bienvenue, {donorData.username || 'Utilisateur'}</h2>       {error && <div className="error-message">{error}</div>}
      <div className="dashboard">

  
        <div className="panel points-panel">
          <h3>VOS POINTS</h3>
          <p className="points">{points} pts</p> 
        </div>
        
        <div className="panel appointment-panel">
          <h3>VOTRE PROCHAIN RENDEZ-VOUS</h3>
          {nextAppointmentDate && NextAppointmentStatus === "Programmé"? (
          <p className="appointment-date">{formatDate(nextAppointmentDate)} à {nextAppointmentTime}</p> 
          ) : (
          <p className="no-appointment">Vous n'avez pas de rendez-vous prévu</p>
        )}
          
        </div>
        
        <div className="panel history-panel">
          <h3>HISTORIQUE DES DONS</h3>
          <p>Date du premier don : {formatDate(donorHistory.firstDonationDate)}</p>
          <p> {donorHistory.monthsSinceFirstDonation} Mois depuis le premier don</p>
          <p>Date du dernier don : {formatDate(donorHistory.lastDonationDate)}</p>
          <p> {donorHistory.monthsSinceLastDonation} Mois depuis le dernier don</p> 
          <p>Nombre de dons effectués : {donorHistory.numberOfDonations}</p>
          <p>Volume total donné : {donorHistory.totalVolumeDonated} ml</p>
        </div>
      </div>

      <div className="buttons">
        <Link to="/appointment-form" className="btn new-appointment-btn">
          Nouveau rendez-vous
        </Link>
        <Link to="/donor-history" className="btn donor-history-btn">
          Renseigner votre historique de donateur
        </Link>
        <Link to="/analyses" className="btn donor-history-btn">
          Renseigner vos informations personnelles
        </Link>
        <Link to="/bloodprelevements" className="btn donor-history-btn">
          Faire un prélèvement sanguin
        </Link>
      </div>

      <footer className="footer">
        <button className="logout-button" onClick={handleLogout}>
          Déconnexion
        </button>
      </footer>
    </div>
    
  );
}

export default DonorHome;
