const Utilisateur = require('../models/Utilisateur');

exports.doitEtreConnecte = function (req, res, next) {
  if (req.session.utilisateur) {
    // Connecté : on peut passer à la fonction suivante
    next();
  } else {
    // Pas connecté : redirection avec utilisation d'un message flash
    req.flash('erreursConnexion', 'Vous ne pouvez pas effectuer cette action.');
    req.session.save(() => {
      res.redirect('/');
    });
  }
}

exports.connecter = async function (req, res) {
  let utilisateur = new Utilisateur(req.body);

  try {
    await utilisateur.connecter();
    req.session.utilisateur = { nomUtilisateur: utilisateur.donnees.nom };
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

  try {
    await utilisateur.inscrire();
    req.session.utilisateur = { nomUtilisateur: utilisateur.donnees.nom };
    // inscription réussie, je continue ici, plus rien à faire
  } catch (erreurs) {
    // échec d'inscription
    erreurs.forEach(erreur => {
      req.flash('erreursInscription', erreur);
    });
  }

  req.session.save(() => {
    res.redirect('/');
  });
}

exports.accueil = function (req, res) {
  if (req.session.utilisateur) {
    console.log(req.session.utilisateur);
    res.render('home');
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
