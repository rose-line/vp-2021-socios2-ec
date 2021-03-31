const Utilisateur = require('../models/Utilisateur');

exports.connecter = async function (req, res) {
  let utilisateur = new Utilisateur(req.body);

  try {
    await utilisateur.connecter();
    req.session.utilisateur = { nom: utilisateur.donnees.nom };
  } catch (err) {
    req.flash('erreursConnexion', err);
  }
  req.session.save(() => {
    res.redirect('/');
  });
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

exports.deconnecter = function (req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}

exports.inscrire = async function (req, res) {

  let utilisateur = new Utilisateur(req.body);

  await utilisateur.inscrire();

  if (utilisateur.erreurs.length === 0) {
    res.send('dans inscrire()');
  } else {
    utilisateur.erreurs.forEach(erreur => {
      req.flash('erreursInscription', erreur);
    });
    req.session.save(() => {
      res.redirect('/');
    });
    //res.send(utilisateur.erreurs);
  }
}

exports.accueil = function (req, res) {
  if (req.session.utilisateur) {
    res.render('home', { nomUtilisateur: req.session.utilisateur.nom });
  } else {
    res.render(
      'visiteur',
      {
        erreursConnexion: req.flash('erreursConnexion'),
        erreursInscription: req.flash('erreursInscription')
      }
    );
  }
}
