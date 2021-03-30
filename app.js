const express = require('express');
const serveur = express();
const routeur = require('./routeur.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionOptions = session({
  secret: "mon secret de session à ne pas communiquer",
  store: MongoStore.create({ client: require('./db') }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,  // 7 jours
    httpOnly: true
  }
});

serveur.use(sessionOptions);

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