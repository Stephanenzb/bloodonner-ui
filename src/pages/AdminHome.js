import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminHome.css';



function AdminHome() {
  const [topDonors, setTopDonors] = useState([]);
  const [allDonors, setAllDonors] = useState([]); 
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [username,setUsername]= useState(0);
  const email = localStorage.getItem('email'); 

  useEffect(() => {

    const fetchAdminData = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
          console.error('Aucun email trouvé dans le stockage local');
          return;
      }
      try {
          const response = await axios.get(`https://my-app-1007139059424.europe-west3.run.app/api/users/${email}`);
          const userData = response.data.user;
          setAdminData(userData);
          setUsername(userData.username);
      } catch (error) {
          console.error('Erreur lors de la récupération des données du donneur', error);
      }
    };

    // Fonction pour récupérer tous les donneurs
    const fetchAllDonors = async () => {
      try {
        const response = await axios.get('https://my-app-1007139059424.europe-west3.run.app/api/admin/donors'); 
        const allDonorsData = response.data;
  
        console.log('Données reçues:', allDonorsData);
  
        // Vérifie que la réponse est bien un tableau
        if (Array.isArray(allDonorsData)) {
          setAllDonors(allDonorsData); 
          console.log('Les données sont bien un tableau:', allDonorsData);
        } else {
          console.error("La réponse n'est pas un tableau", allDonorsData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des donneurs', error);
      }
    };

    // Fonction pour récupérer les 3 meilleurs donneurs
    const fetchTopDonors = async () => {
    try {
      const response = await axios.get('https://my-app-1007139059424.europe-west3.run.app/api/admin/top3-donors');
      setTopDonors(response.data); 
    } catch (error) {
      console.error('Erreur lors de la récupération des meilleurs donneurs', error);
    }
  };
    fetchAdminData();
    fetchAllDonors();
    fetchTopDonors(); 
  }, []);

   // Fonction pour se déconnecter
   const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('email'); 
    navigate('../index'); 
  };
  
  if (!adminData) {
    return <div>Chargement des données...</div>; 
  }

  return (
    <div className="home-container">
      <div className="admin-home">
      <h2>Bienvenue, {adminData.username || 'Utilisateur'}</h2>
        <div className="panel points-panel">
          <h3>TOP 3 DES DONNEURS</h3>
          <div className="top-donors">
          {topDonors.map((donor, index) => (
            <div key={donor.email} className="top-donor">
              {index + 1}. {donor.username} ({donor.points} points)
            </div>
          ))}
        </div>
          <div className="podium">
            <div className="podium-stage second">
              {topDonors[1]?.username || '2'}
            </div>
            <div className="podium-stage first">
              {topDonors[0]?.username || '1'}
            </div>
            <div className="podium-stage third">
              {topDonors[2]?.username || '3'}
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <button className="action-button" onClick={() => navigate('/donor-list')}>
            Liste des donneurs
          </button>
          <button className="action-button" onClick={() => navigate('/bloodstats')}>
            Données sanguines des donneurs
          </button>
          <button className="action-button" onClick={() => navigate('/manage-appointments')}>
            Gérer les RDV
          </button>
          <button className="action-button" onClick={() => navigate('/centers')}>
            Voir les différents centres
          </button>
        </div>

        <footer className="footer">
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminHome;
