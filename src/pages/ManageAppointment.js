import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import '../styles/ManageAppointment.css';

const ManageAppointment = () => {
    const [records, setRecords] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const navigate = useNavigate();

    const columns = [
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Email du Donneur</span>,
            selector: row => row.donorEmail,
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Date</span>,
            selector: row => new Date(row.dateRendezVous).toLocaleDateString(),
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Heure</span>,
            selector: row => row.timeRendezVous,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Statut</span>,
            selector: row => row.status,
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Mettre à jour</span>,
            cell: row => (
                <button onClick={() => handleUpdate(row)} className="update-button">Modifier</button>
            )
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Supprimer</span>,
            cell: row => <button onClick={() => handleDelete(row)} className="delete-button">Supprimer</button>
        }
    ];

    useEffect(() => {
        fetchAppointments(); // Recharge les rendez-vous
    }, [records]); // Dépendance sur le tableau d'enregistrements
    

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('https://p2024-437514.ey.r.appspot.com/api/admin/appointments');
            setRecords(response.data.hits.hits.map(hit => hit._source));
        } catch (error) {
            console.error("Erreur lors de la récupération des rendez-vous :", error);
        }
    };

    // Suppression d'un rendez-vous
    const handleDelete = async (row) => {
        try {
            await axios.delete(`https://p2024-437514.ey.r.appspot.com/api/appointments/${row.donorEmail}`); 
            setRecords(records.filter(record => record.donorEmail !== row.donorEmail)); 
            alert(`Rendez-vous de ${row.donorEmail} supprimé avec succès`);
        } catch (error) {
            console.error("Erreur lors de la suppression du rendez-vous :", error);
            alert("Erreur lors de la suppression du rendez-vous");
        }
    };
  

// Mise à jour d'un rendez-vous
const handleUpdate = (row) => {
    const statusOptions = ["Programmé", "Effectué", "Passé"];
    const newStatus = prompt(`Statut actuel : ${row.status}\nSaisir un nouveau statut parmi : Programmé, Effectué, Passé`) || row.status;
    const dateRendezVous = prompt("Nouvelle date de rendez-vous (YYYY-MM-DD) :", row.dateRendezVous || row.dateRendezVous);
    const timeRendezVous = prompt("Nouvelle heure de rendez-vous :", row.timeRendezVous || row.timeRendezVous);
    
    let volumeTaken = null; 
    if (newStatus === "Effectué") {
        while (volumeTaken === null || volumeTaken === "") {
            volumeTaken = prompt("Saisir le volume de sang prélevé (en ml, minimum 0) :");
            if (volumeTaken === null || volumeTaken === "") {
                alert("Vous devez renseigner une valeur pour le volume de sang prélevé.");
            } else if (isNaN(volumeTaken) || volumeTaken < 0) {
                alert("Veuillez entrer une valeur numérique valide supérieure ou égale à 0.");
                volumeTaken = null; 
            }
        }
    }

    const updatedData = {
        status: newStatus,
        dateRendezVous: dateRendezVous,
        timeRendezVous: timeRendezVous,
        ...(newStatus === "Effectué" && { volumeTaken: volumeTaken }) // Ajouter volumeTaken si le statut est "Effectué"
    };

    try {
        const response =  updateAppointment(row.donorEmail, updatedData);
        console.log("Données mises à jour :", response);
        alert("Données mises à jour avec succès !");
        fetchAppointments();
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        alert("Une erreur est survenue lors de la mise à jour : " + (error.response ? error.response.data.detail : "Erreur inconnue"));
    }
};

// Fonction pour mettre à jour le rendez-vous
const updateAppointment = async (donorEmail, updatedData) => {
    try {
        const response = await axios.put(`https://p2024-437514.ey.r.appspot.com/api/appointments/${donorEmail}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        throw error;
    }
};



    return (
        <div className='container mt-5'>
            <DataTable 
                columns={columns}
                data={records}
                fixedHeader
                pagination
            />
            <div className="home-button-container">
                <button onClick={() => navigate('/admin-home')} className="home-button">
                    Accueil
                </button>
            </div>
        </div>
    );
};

export default ManageAppointment;
