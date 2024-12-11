import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Typography, Grid, Snackbar, Alert } from '@mui/material';
import dayjs from 'dayjs';
import '../styles/AppointmentForm.css';

function AppointmentForm() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const [dateRendezVous, setDateRendezVous] = useState(dayjs().format('YYYY-MM-DD'));
  const [timeRendezVous, setTimeRendezVous] = useState('10:00');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    console.log('Date:', dateRendezVous, 'Time:', timeRendezVous, 'Email:', email);
    const fetchDonorData = async () => {
      const storedEmail = localStorage.getItem('email');
      localStorage.setItem('email', storedEmail); 
      const token = localStorage.getItem('token');
      if (!storedEmail) {
        console.error('Aucun email trouvé dans le stockage local');
        return;
      }
  
      try {
        const response = await axios.get(`https://my-app-1007139059424.europe-west3.run.app/api/users/${storedEmail}`);
        const userData = response.data.user;
        console.log("Email utilisateur récupéré:", userData.email);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du donneur', error);
      }
    };
    fetchDonorData();
  }, []
);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de la date
    if (dayjs(dateRendezVous).isBefore(today)) {
      setError("La date du rendez-vous ne peut pas être dans le passé.");
      return;
    }

    // Préparation des données du rendez-vous
    const appointmentData = {
      dateRendezVous,
      timeRendezVous,
      status: 'Programmé',
    };

    try {
      console.log({ dateRendezVous, timeRendezVous, email });
      const response = await axios.post(`https://my-app-1007139059424.europe-west3.run.app/api/${email}/appointments`, appointmentData);
      setSuccessMessage('Rendez-vous réservé avec succès !');
      setError('');
      setOpenSnackbar(true);
      setDateRendezVous(dayjs().format('YYYY-MM-DD'));
      setTimeRendezVous('10:00');
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      setError(error.response ? error.response.data.detail : "Erreur lors de la réservation du rendez-vous.");
  }
  
  };

  return (
    <div className="appointment-form">
      <Typography variant="h4" gutterBottom>Réserver un Rendez-vous</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date du rendez-vous"
              type="date"
              value={dateRendezVous}
              onChange={(e) => setDateRendezVous(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Heure du rendez-vous"
              type="time"
              value={timeRendezVous}
              onChange={(e) => setTimeRendezVous(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>Réserver</Button>
      </form>
      <div className="home-button-container">
        <button onClick={() => navigate('/home')} className="home-button">Accueil</button>
      </div>
    </div>
  );
}

export default AppointmentForm;
