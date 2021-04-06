const express = require('express');
const routeur = express.Router();
const utilisateurController = require('./controllers/utilisateurController');
const sociosController = require('./controllers/sociosController');

routeur.get('/', utilisateurController.accueil);

routeur.post('/inscrire', utilisateurController.inscrire);

routeur.post('/connecter', utilisateurController.connecter);

routeur.post('/deconnecter', utilisateurController.doitEtreConnecte, utilisateurController.deconnecter);

routeur.get('/creer_socios', utilisateurController.doitEtreConnecte, sociosController.afficherVueCreation);

routeur.post('/creer_socios', utilisateurController.doitEtreConnecte, sociosController.enregistrer)

module.exports = routeur;


// routeur.get('/contact', (req, res) => {
//   res.send('Page de contact');
// });


// // ce qui est renvoyé à la fonction require
// module.exports = {
//   nom: 'Neymar',
//   prenom: 'Jean',
//   crier: function () {
//     console.log("J'en ai marre !");
//   }
// }