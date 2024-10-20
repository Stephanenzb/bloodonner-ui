const { Client } = require('@elastic/elasticsearch');

// Configuration du client Elasticsearch
const esClient = new Client({
  node: 'https://localhost:9200',  // Remplace par l'URL de ton cluster Elasticsearch
  auth: {
    username: 'your-username',  // Remplace par ton nom d'utilisateur Elasticsearch
    password: 'your-password'   // Remplace par ton mot de passe Elasticsearch
  },
  tls: {
    rejectUnauthorized: false  // Désactiver la vérification de certificat SSL (optionnel, à utiliser si nécessaire)
  }
});

// Vérification de la connexion à Elasticsearch
esClient.ping({}, (error) => {
  if (error) {
    console.error('Elasticsearch cluster is down!', error);
  } else {
    console.log('Elasticsearch cluster is up and running');
  }
});

module.exports = esClient;
