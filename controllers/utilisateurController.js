const Utilisateur = require('../models/Utilisateur');

exports.connecter = function () { }

exports.deconnecter = function () { }

exports.inscrire = function (req, res) {

  let utilisateur = new Utilisateur(req.body);

  utilisateur.inscrire();

  if (utilisateur.erreurs.length !== 0) {
    res.send(utilisateur.erreurs);
  } else {
    res.send('dans inscrire()');
  }
}

exports.accueil = function (req, res) {
  res.render('visiteur');
}
