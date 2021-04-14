const express = require('express');
const routeur = express.Router();
const utilisateurController = require('./controllers/utilisateurController');
const sociosController = require('./controllers/sociosController');

routeur.get('/', utilisateurController.accueil);

routeur.post('/inscrire', utilisateurController.inscrire);

routeur.post('/connecter', utilisateurController.connecter);

routeur.post('/deconnecter', utilisateurController.doitEtreConnecte, utilisateurController.deconnecter);

routeur.get('/creer_socios', utilisateurController.doitEtreConnecte, sociosController.afficherVueCreation);

routeur.post('/creer_socios', utilisateurController.doitEtreConnecte, sociosController.enregistrer);

routeur.get('/socios/:id', sociosController.afficherVueSocios);

module.exports = routeur;
