const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const esClient = require('../config/elasticsearch'); // Configuration Elasticsearch
const router = express.Router();

// Middleware pour analyser les corps de requêtes JSON
router.use(express.json());
router.use(cors()); // Autoriser CORS

// Clé secrète pour JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key';

// Route pour l'inscription
router.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await esClient.search({
    index: 'users',
    body: {
      query: {
        match: { email: email }
      }
    }
  });

  if (existingUser.hits.total.value > 0) {
    return res.status(409).json({ message: 'L\'email existe déjà' });
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Sauvegarder l'utilisateur dans Elasticsearch
  await esClient.index({
    index: 'users',
    body: {
      name: name,
      email: email,
      password: hashedPassword,
      userType: userType, // 'donor' ou 'admin'
      createdAt: new Date()
    }
  });

  res.status(201).json({ message: 'Inscription réussie' });
});

// Route pour la connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Rechercher l'utilisateur dans Elasticsearch
  const { hits } = await esClient.search({
    index: 'users',
    body: {
      query: {
        match: { email: email }
      }
    }
  });

  const user = hits.hits[0]?._source;

  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérifier le mot de passe
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Mot de passe incorrect' });
  }

  // Générer un token JWT
  const token = jwt.sign({ email: user.email, userType: user.userType }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, userType: user.userType });
});

module.exports = router;
