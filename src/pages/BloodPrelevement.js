import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


function BloodPrelevement () {
    const [donorData, setDonorData] = useState(null);
    const [prelevementData, setPrelevementData] = useState(null);
    const email = localStorage.getItem('email'); 
    const [gender, setGender] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [generatedData, setGeneratedData] = useState(null); // Nouveau state pour les données générées
    const [showPopup, setShowPopup] = useState(false); // Etat pour afficher/masquer le pop-up
    const navigate = useNavigate();

    // Simule la récupération des informations du donneur connecté
    useEffect(() => {
        const fetchDonorData = async () => {
            const email = localStorage.getItem('email');
            if (!email) {
                console.error('Aucun email trouvé dans le stockage local');
                return;
            }

            try {
                const response = await axios.get(`https://pa2024-443414.ey.r.appspot.com/api/users/${email}`);
                const userData = response.data.user;
                setDonorData(userData);
            } catch (error) {
                console.error('Erreur lors de la récupération des données du donneur', error);
            }
        };

        fetchDonorData();
    }, []);

    // Enregistre les données générées et met à jour les données du donneur
    const handleBloodPrelevement = async () => {
        setIsLoading(true);
        setMessage('');
        setShowPopup(false); // Cache le pop-up avant de le générer à nouveau

        const email = localStorage.getItem('email'); 

        try {
            const response = await axios.put(`http://localhost:8000/api/BloodPrelevement/${email}`, {
                blood_test_data: { /* vos données de test sanguin */ }
            });
            setGeneratedData(response.data.data); // Mettez à jour les données générées
            setShowPopup(true); // Affiche le pop-up
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Erreur lors de la mise à jour du prélèvement sanguin.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!donorData) {
        return <div>Chargement des données...</div>; 
    }

    const donorStats = donorData.blood_stats || {}; 

    return (
        <div style={{ padding: "20px" }}>
            <h1>Prélèvement Sanguin</h1>
            {donorData ? (
                <div className="analyse-form">
                    <h2>Informations du Donneur</h2>

                    <p><strong>Nom d'utilisateur :</strong> {donorData.username || "Non spécifié"}</p>
                    <div className="form-group">
                        <p><strong>Genre :</strong> {donorStats.Gender || "Non spécifié"}</p>
                    </div>
                    <div className="form-group">
                        <p><strong>Âge :</strong> {donorStats.Age || "Non spécifié"}</p>
                    </div>
                    <div className="form-group">
                        <p><strong>Fumeur :</strong> {donorStats.currentSmoker ? "Oui" : "Non"}</p>
                    </div>

                    <button onClick={handleBloodPrelevement} disabled={isLoading}className="submit-button">
                        {isLoading ? 'Chargement...' : 'Effectuer un Prélèvement Sanguin'}
                    </button>


                    {message && <p>{message}</p>}

                {showPopup && generatedData && (
                    <div className="popup">
                        <h2>Prélèvement Généré</h2>
                        <pre>{JSON.stringify(generatedData, null, 2)}</pre>
                        <button onClick={() => setShowPopup(false)}>Fermer</button>
                    </div>
                )}

                    <div className="home-button-container">
                        <button onClick={() => navigate('/home')} className="home-button">
                            Accueil
                        </button>
                    </div>
                </div>
            ) : (
                <p>Chargement des informations du donneur...</p>
            )}
        </div>
    );
}

export default BloodPrelevement;
