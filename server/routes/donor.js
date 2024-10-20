const express = require('express');
const router = express.Router();
const esClient = require('../config/elasticsearch');  // Importation du client Elasticsearch

// Route POST pour soumettre l'historique du donneur
router.post('/history', async (req, res) => {
  try {
    const { donorId, history } = req.body;

    // Logique pour indexer l'historique du donneur dans Elasticsearch
    const response = await esClient.index({
      index: 'donors',
      body: {
        donorId,
        history,
        timestamp: new Date()
      }
    });

    res.status(200).json({ message: 'Historique enregistré avec succès', response });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'historique du donneur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Exemple de route GET pour récupérer les informations d'un donneur par ID
router.get('/:donorId', async (req, res) => {
  try {
    const { donorId } = req.params;

    const response = await esClient.search({
      index: 'donors',
      query: {
        match: { donorId }
      }
    });

    if (response.hits.hits.length > 0) {
      res.status(200).json(response.hits.hits[0]._source);
    } else {
      res.status(404).json({ message: 'Donneur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations du donneur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

module.exports = router;
