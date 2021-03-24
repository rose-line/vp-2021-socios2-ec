const express = require('express');
const routeur = express.Router();
const utilisateurController = require('./controllers/utilisateurController');

routeur.get('/', utilisateurController.accueil);

routeur.post('/inscrire', utilisateurController.inscrire);

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