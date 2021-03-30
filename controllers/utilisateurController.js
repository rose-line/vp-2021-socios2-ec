const Utilisateur = require('../models/Utilisateur');

exports.connecter = async function (req, res) {
  //console.log('connexion');
  let utilisateur = new Utilisateur(req.body);

  try {
    await utilisateur.connecter();
    res.send('connexion réussie');
  } catch (err) {
    console.log("log " + err);
    res.send(err);
  }
}

// Avec callback
// exports.connecter = function (req, res) {
//   const utilisateur = new Utilisateur(req.body);

//   utilisateur.connecter(resultat => {
//     res.send(resultat);
//   });
// }

// Avec promesses
// exports.connecter = function (req, res) {
//   let utilisateur = new Utilisateur(req.body);
//   utilisateur.connecter().then(resultat => {
//     res.send(resultat);
//   }).catch(err => {
//     res.send(err);
//   });
// }

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
