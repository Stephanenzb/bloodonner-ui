const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@elastic/elasticsearch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;


// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connexion à Elasticsearch
const esClient = new Client({ node: 'http://localhost:9200' });

// Route d'inscription
app.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    // Vérification des données reçues
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
    }

    // Insertion dans Elasticsearch
    const result = await esClient.index({
      index: 'users',
      body: {
        name,
        email,
        password,
        userType,
        createdAt: new Date(),
      },
    });

    res.status(201).json({ message: 'Inscription réussie', result });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
});

// Route de connexion
app.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    // Vérification des données reçues
    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
    }

    // Recherche de l'utilisateur dans Elasticsearch
    const { body } = await esClient.search({
      index: 'users',
      body: {
        query: {
          bool: {
            must: [
              { match: { email } },
              { match: { password } },
              { match: { userType } },
            ],
          },
        },
      },
    });

    if (body.hits.total.value > 0) {
      res.status(200).json({ message: 'Connexion réussie', user: body.hits.hits[0]._source });
    } else {
      res.status(400).json({ message: 'Identifiants incorrects.' });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
});

// Route pour la racine
app.get('/', (req, res) => {
  res.send('Serveur backend opérationnel.');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
});
