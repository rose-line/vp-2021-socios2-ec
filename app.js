const express = require('express');
const routeur = require('./routeur.js');
const serveur = express();

// Pour récupérer les données issues d'un formulaire
serveur.use(express.urlencoded({ extended: false }));

// Routage
serveur.use('/', routeur);

// 1er arg : 'views' obligatoire, 2ème arg : le répertoire de vos views
serveur.set('views', 'views');
// indiquer qu'on utilise EJS comme moteur de templating
serveur.set('view engine', 'ejs');

// répertoire public pour le client
serveur.use(express.static('public'));

module.exports = serveur;