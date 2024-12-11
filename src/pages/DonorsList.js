import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/DonorsList.css'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DonorsList = () => {
    const [records, setRecords] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const navigate = useNavigate();
    const [selectedRow, setSelectedRow] = useState(null); 
    const [firstDonationDate, setFirstDonationDate] = useState(new Date()); 
    const [lastDonationDate, setLastDonationDate] = useState(new Date());

    const columns = [
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Username</span>,
            selector: row => row.username,
            sortable: true
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Email</span>,
            selector: row => row.email,
            sortable: true
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Points</span>,
            selector: row => row.points,
            sortable: true
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Nombre de dons</span>,
            selector: row => row.donor_history ? row.donor_history.numberOfDonations : 'N/A',
            sortable: true
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Volume total donné (en ml)</span>,
            selector: row => row.donor_history ? row.donor_history.totalVolumeDonated : 'N/A',
            sortable: true
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Date du premier don</span>,
            selector: row => row.donor_history ? row.donor_history.firstDonationDate : 'N/A',
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Date du dernier don</span>,
            selector: row => row.donor_history ? row.donor_history.lastDonationDate : 'N/A',
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Nbre de mois depuis le premier don</span>,
            selector: row => row.donor_history ? row.donor_history.monthsSinceFirstDonation : 'N/A',
            sortable: true
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Nbre de mois depuis le dernier don</span>,
            selector: row => row.donor_history ? row.donor_history.monthsSinceLastDonation : 'N/A',
            sortable: true
            
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Prédiction</span>,
            cell: row => (
                <button onClick={() => handlePredict(row)} className="predict-button">Prédire un don à venir</button>
            )
            
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Mettre à jour</span>,
            cell: row => (
                <button onClick={() => handleUpdate(row)} className="update-button">Modifier</button>
            )
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Supprimer</span>,
            cell: row => <button onClick={() => handleDelete(row.email)} className="delete-button">Supprimer</button>
        }
    ];

    useEffect(() => {
        fetchDonors();
    }, []);

    const calculateMonthsSince = (dateString) => {
        const donationDate = new Date(dateString);
        const currentDate = new Date();
        
        // Calculer la différence en mois
        const monthDiff = (currentDate.getFullYear() - donationDate.getFullYear()) * 12 + (currentDate.getMonth() - donationDate.getMonth());
        return monthDiff >= 0 ? monthDiff : 0; // S'assurer que la valeur ne soit pas négative
    };

    const fetchDonors = async () => {
        try {
            const response = await axios.get('https://my-app-1007139059424.europe-west3.run.app/api/admin/donors');
            
            // Vérifie la structure de la réponse
            console.log(response.data); 
            
            const donors = response.data.donors || response.data; 
    
            const donorsWithCalculatedMonths = donors.map(donor => ({
                ...donor,
                monthsSinceFirstDonation: calculateMonthsSince(donor.donor_history.firstDonationDate),
                monthsSinceLastDonation: calculateMonthsSince(donor.donor_history.lastDonationDate),
            }));
    
            setRecords(donorsWithCalculatedMonths);
        } catch (error) {
            console.error("Erreur lors de la récupération des donateurs :", error);
        }
    };
    
    // Suppression de ligne
    const handleDelete = async (email) => {
        try {
            await axios.delete(`https://my-app-1007139059424.europe-west3.run.app/api/donors/${email}`);
            // Filtrer l'utilisateur supprimé
            setRecords(records.filter(record => record.email !== email));
            alert(`Donneur avec l'email ${email} supprimé`);
        } catch (error) {
            console.error("Erreur lors de la suppression du donneur :", error);
            alert("Erreur lors de la suppression du donneur");
        }
    };

    // Mise à jour ligne 
    const handleUpdate = async (row) => {
        const points = prompt("Nouveau nombre de points :", row.points) || row.points;
        const numberOfDonations = prompt("Nouveau total de dons :", row.donor_history ? row.donor_history.numberOfDonations : 0) || (row.donor_history ? row.donor_history.numberOfDonations : 0);
        const totalVolumeDonated = prompt("Nouveau volume total donné :", row.donor_history ? row.donor_history.totalVolumeDonated : 0) || (row.donor_history ? row.donor_history.totalVolumeDonated : 0);
        const firstDonationDate = prompt("Date du premier don (YYYY-MM-DD) :", row.donor_history ? row.donor_history.firstDonationDate : '');
        const lastDonationDate = prompt("Date du dernier don (YYYY-MM-DD) :", row.donor_history ? row.donor_history.lastDonationDate : '');
        

        const updatedData = {
            points: Number(points),
            numberOfDonations: Number(numberOfDonations),
            totalVolumeDonated: Number(totalVolumeDonated),
            firstDonationDate: firstDonationDate,
            lastDonationDate: lastDonationDate,
            monthsSinceFirstDonation: calculateMonthsSince(firstDonationDate),
            monthsSinceLastDonation: calculateMonthsSince(lastDonationDate)
        };

        // Appelle la fonction pour mettre à jour le donneur
        try {
            const response = await updateDonor(row.email, updatedData);
            console.log("Données mises à jour :", response);
            alert("Données mises à jour avec succès !");
            fetchDonors(); // Recharge les données
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            alert("Une erreur est survenue lors de la mise à jour : " + (error.response ? error.response.data.detail : "Erreur inconnue"));
        }
    };

    // Fonction pour mettre à jour le donneur
    const updateDonor = async (email, updatedData) => {
        try {
            const response = await axios.put(`https://my-app-1007139059424.europe-west3.run.app/api/donors/${email}`, {
                ...updatedData,
                monthsSinceFirstDonation: calculateMonthsSince(updatedData.firstDonationDate),
                monthsSinceLastDonation: calculateMonthsSince(updatedData.lastDonationDate),
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            throw error;
        }
    };

    const handlePredict = async (row) => {
        // Créez l'objet predictionData à partir des données de la ligne
        const predictionData = {
            "Months since First Donation": row.donor_history ? row.donor_history.monthsSinceFirstDonation : 0,
            "Months since Last Donation": row.donor_history ? row.donor_history.monthsSinceLastDonation : 0,
            "Number of Donations": row.donor_history ? row.donor_history.numberOfDonations : 0,
            "Total Volume Donated (c.c.)": row.donor_history ? row.donor_history.totalVolumeDonated : 0,
        };
    
        // Ajoutez un log pour vérifier les données envoyées
        console.log('Données envoyées pour la prédiction:', predictionData);
        
        // Ajoutez des logs pour chaque valeur
        console.log('Months since First Donation:', predictionData["Months since First Donation"]);
        console.log('Months since Last Donation:', predictionData["Months since Last Donation"]);
        console.log('Number of Donations:', predictionData["Number of Donations"]);
        console.log('Total Volume Donated (c.c.):', predictionData["Total Volume Donated (c.c.)"]);
    
        try {
            // Faites l'appel à l'API de prédiction
            const response = await axios.post('https://my-app-1007139059424.europe-west3.run.app/api/predict', predictionData);
        
            // Vérifiez si la réponse contient les données attendues
            if (response && response.data) {
                console.log('Prediction:', response.data);
        
                // Affichez la classe et la probabilité
                alert(`L'utilisateur ${row.username} a une probabilité de : ${response.data.probability} % de faire un don. On prédit donc : ${response.data.prediction}.`);
            } else {
                alert('La réponse de l\'API est invalide.');
            }
        
        } catch (error) {
            if (error.response) {
                console.error('Erreur du serveur:', error.response.status, error.response.data);
                alert(`Erreur du serveur : ${error.response.status}. ${error.response.data}`);
            } else if (error.request) {
                console.error('Aucune réponse reçue:', error.request);
                alert('Aucune réponse du serveur. Veuillez vérifier la connexion.');
            } else {
                console.error('Erreur:', error.message);
                alert('Une erreur s\'est produite lors de la récupération de la prédiction.');
            }
        }
    };
    
    
    
    return (
        <div className="my-table-container" style={{ maxHeight: '500px', overflowY: 'scroll' }}>
        <DataTable 
            columns={columns}
            data={records}
            pagination 
            paginationPerPage={20} 
            paginationRowsPerPageOptions={[10, 20, 50, 100]} 
        />
    <div className="home-button-container">
        <button onClick={() => navigate('/admin-home')} className="home-button">
            Accueil
        </button>
    </div>
</div>

    );
};

export default DonorsList;
