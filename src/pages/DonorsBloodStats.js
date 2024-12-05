import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link,useNavigate } from 'react-router-dom';
import '../styles/DonorsBloodStats.css';
import 'react-datepicker/dist/react-datepicker.css';


const DonorsBloodStats = () => {
    const [donors, setDonors] = useState([]);
    const navigate = useNavigate();

    const columns = [
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Username</span>,
            selector: row => row.username || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Genre</span>,
            selector: row => row.blood_stats?.Gender || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Âge</span>,
            selector: row => row.blood_stats?.Age || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Hemoglobine (g/dL)</span>,
            selector: row => row.blood_stats?.Hemoglobin || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>MCH (pg)</span>,
            selector: row => row.blood_stats?.MCH || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>MCHC (g/dL)</span>,
            selector: row => row.blood_stats?.MCHC || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>MCV (fL)</span>,
            selector: row => row.blood_stats?.MCV || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Pregnancies</span>,
            selector: row => row.blood_stats?.Pregnancies || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Glucose</span>,
            selector: row => row.blood_stats?.Glucose || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Épaisseur peau (mm)</span>,
            selector: row => row.blood_stats?.SkinThickness || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Insuline</span>,
            selector: row => row.blood_stats?.Insulin || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>IMC</span>,
            selector: row => row.blood_stats?.BMI || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Diabetes Pedigree Function</span>,
            selector: row => row.blood_stats?.DiabetesPedigreeFunction || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Fumeur Actuel</span>,
            selector: row => row.blood_stats?.currentSmoker ? 'Oui' : 'Non',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Cigarettes par jour</span>,
            selector: row => row.blood_stats?.cigsPerDay || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Médicaments contre BP</span>,
            selector: row => row.blood_stats?.BPMeds ? 'Oui' : 'Non',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Cholestérol</span>,
            selector: row => row.blood_stats?.Cholesterol || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Fréquence cardiaque</span>,
            selector: row => row.blood_stats?.heartRate || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Chest Pain</span>,
            selector: row => row.blood_stats?.cp || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Pression artérielle au repos (Trestbps)</span>,
            selector: row => row.blood_stats?.trestbps || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Glycémie à jeun sup à 120 mg/dL (FBS)</span>,
            selector: row => (row.blood_stats?.fbs ? 'Oui' : 'Non'),
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Résultats électrocardiographiques au repos (Restecg)</span>,
            selector: row => row.blood_stats?.restecg || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Fréquence cardiaque maximale atteinte (Thalach)</span>,
            selector: row => row.blood_stats?.thalach || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Angine induite par l'exercice (Exang)</span>,
            selector: row => (row.blood_stats?.exang ? 'Oui' : 'Non'),
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Dépression ST (Oldpeak)</span>,
            selector: row => row.blood_stats?.oldpeak || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Pente du segment ST (Slope)</span>,
            selector: row => row.blood_stats?.slope || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Nombre de vaisseaux principaux colorés (CA)</span>,
            selector: row => row.blood_stats?.ca || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Thalassémie (Thal)</span>,
            selector: row => row.blood_stats?.thal || 'N/A',
            sortable: true,
        },        
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Tension artérielle systolique</span>,
            selector: row => row.blood_stats?.sysBP || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Tension artérielle diastolique</span>,
            selector: row => row.blood_stats?.diaBP || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Pression Artérielle</span>,
            selector: row => row.blood_stats?.BloodPressure || 'N/A',
            sortable: true,
        },
        {
            name: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Prédiction</span>,
            cell: row => (
                <button onClick={() => handlePredict(row)} className="predict-button">Prédire un risque de maladie</button>
            )
            
        }
    ];
    

    // Récupération des données
    useEffect(() => {
        fetchDonors();
    }, []);

    const fetchDonors = async () => {
        try {
            const response = await axios.get('https://pa2024-443414.ey.r.appspot.com/api/admin/donors');
            
            // Vérifie la structure de la réponse et met à jour l'état
            console.log('Réponse API :', response.data);
            setDonors(response.data.donors || []); 
        } catch (error) {
            console.error("Erreur lors de la récupération des donateurs :", error);
        }
    };
    

    const handlePredict = async (row) => {
        try {
            const predictionData = {
                "Gender": row.blood_stats?.Gender,
                "Age": row.blood_stats?.Age,
                "Hemoglobin": row.blood_stats?.Hemoglobin,
                "MCH": row.blood_stats?.MCH,
                "MCHC": row.blood_stats?.MCHC,
                "MCV": row.blood_stats?.MCV,
                "Pregnancies": row.blood_stats?.Pregnancies,
                "Glucose": row.blood_stats?.Glucose,
                "SkinThickness": row.blood_stats?.SkinThickness,
                "Insulin": row.blood_stats?.Insulin,
                "BMI": row.blood_stats?.BMI,
                "DiabetesPedigreeFunction": row.blood_stats?.DiabetesPedigreeFunction,
                "currentSmoker": row.blood_stats?.currentSmoker,
                "cigsPerDay": row.blood_stats?.cigsPerDay,
                "BPMeds": row.blood_stats?.BPMeds,
                "Cholesterol": row.blood_stats?.Cholesterol,
                "heartRate": row.blood_stats?.heartRate,
                "cp": row.blood_stats?.cp,
                "trestbps": row.blood_stats?.trestbps,
                "fbs": row.blood_stats?.fbs,
                "restecg": row.blood_stats?.restecg,
                "thalach": row.blood_stats?.thalach,
                "exang": row.blood_stats?.exang,
                "oldpeak": row.blood_stats?.oldpeak,
                "slope": row.blood_stats?.slope,
                "ca": row.blood_stats?.ca,
                "thal": row.blood_stats?.thal,
                "sysBP": row.blood_stats?.sysBP,
                "diaBP": row.blood_stats?.diaBP,
                "BloodPressure": row.blood_stats?.BloodPressure,
            };
            

            const response = await axios.post('https://pa2024-443414.ey.r.appspot.com/api/diseasePrediction', predictionData);
                const predictions = response.data.prediction;
            
                
                let formattedPrediction = "";
                for (const [disease, presence] of Object.entries(predictions)) {
                    formattedPrediction += `${disease}: ${presence ? "Présent" : "Absent"}\n`;
                }
            
                alert(`Prédiction pour ${row.username}:\n${formattedPrediction}`);
            } catch (error) {
                console.error("Erreur lors de la prédiction :", error);
                alert("Erreur lors de la prédiction.");
            }
    };


    return (
        <div className="donors-stats">
            <h2>Statistiques des Donateurs</h2>
            <DataTable
                columns={columns}
                data={donors}
                pagination
                fixedHeader
            />
            <button onClick={() => navigate('/admin-home')} className="back-button">Retour</button>
        </div>
    );
};

export default DonorsBloodStats;
