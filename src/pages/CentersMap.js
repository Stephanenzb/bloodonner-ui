import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from '../styles/CentersMap.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CentersMap = () => {
  const mapRef = useRef(null);
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    // Initialisation de la carte
    const map = L.map(mapRef.current).setView([48.8566, 2.3522], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Appel API pour récupérer les centres
    const fetchCenters = async () => {
        try {
          const response = await fetch("https://my-app-1007139059424.europe-west3.run.app/api/centers");
          const data = await response.json();
      
          console.log("Données API :", data); // Affichez les données reçues
      
          if (data.success) {
            setCenters(data.data);
      
            // Ajouter les marqueurs sur la carte
            data.data.forEach((center) => {
                console.log("Traitement du centre :", center); // Log pour chaque centre
                if (center.geometry && center.geometry.coordinates) {
                  const lat = center.geometry.coordinates[1]; // Latitude
                  const lon = center.geometry.coordinates[0]; // Longitude
                  
                  // Vérification de la validité des coordonnées
                  if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon)) {
                    L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(`
                      <div style="font-family: Arial, sans-serif; font-size: 14px;">
                        <b>${center.name}</b><br>
                        <span style="color: gray;">${center.address || "Adresse non disponible"}</span><br>
                        <img src="icone-hospital.png" alt="icon" style="width: 20px; height: 20px; margin-top: 5px;">
                      </div>
                    `);
                  
                  } else {
                    console.log(`Coordonnées invalides pour le centre: ${center.name}`);
                  }
                } else {
                  console.log(`Données géométriques manquantes pour le centre: ${center.name}`);
                }
              });
              
              
              
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des centres :", error);
        }
      };
      

    fetchCenters();

    return () => {
      map.remove(); // Nettoyage de la carte
    };
  }, []);

  return <div id="map" ref={mapRef} className={styles.map} style={{ height: "500px", width: "100%" }}></div>;
};

export default CentersMap;
