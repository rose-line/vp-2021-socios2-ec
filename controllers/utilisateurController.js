const Utilisateur = require('../models/Utilisateur');
const Socios = require('../models/Socios');
const { trouverSocios } = require('../models/Socios');

exports.doitEtreConnecte = function (req, res, next) {
  if (req.session.utilisateur) {
    // Connecté : on peut passer à la fonction suivante
    next();
  } else {
    // Pas connecté : redirection avec utilisation d'un message flash
    req.flash('erreurs', 'Vous ne pouvez pas effectuer cette action.');
    req.session.save(() => {
      res.redirect('/');
    });
  }
}

exports.doitEtreAuteur = async function (req, res, next) {
  // id de l'utilisateur === id de l'auteur du socios ???

  // potentiellement
  // if (req.session.admin) {
  //   next();
  // }

  if (req.session.utilisateur) {
    const socios = await trouverSocios(req.params.id);
    if (req.session.utilisateur.id === socios.auteur.id) {
      return next();
    }
  }

  req.flash('erreurs', 'Vous ne pouvez pas effectuer cette action.');
  req.session.save(() => {
    res.redirect('/');
  });
}

exports.doitExister = async function (req, res, next) {
  try {
    const utilisateur = await Utilisateur.trouverUtilisateur(req.params.nom);
    req.utilisateur = utilisateur;
    next();
  } catch (err) {
    res.render('404');
  }
}

exports.connecter = async function (req, res) {
  let utilisateur = new Utilisateur(req.body);

  try {
    await utilisateur.connecter();
    req.session.utilisateur =
    {
      id: utilisateur.donnees._id,
      nom: utilisateur.donnees.nom
    };
  } catch (err) {
    req.flash('erreurs', err);
  }
  req.session.save(() => {
    res.redirect('/');
  });
}

exports.deconnecter = function (req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}

exports.inscrire = async function (req, res) {

  let utilisateur = new Utilisateur(req.body);

  try {
    await utilisateur.inscrire();
    req.session.utilisateur =
    {
      id: utilisateur.donnees._id,
      nom: utilisateur.donnees.nom
    };
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

exports.afficherProfil = async function (req, res) {
  try {
    const socios = await Socios.trouverLesSociosDe(req.utilisateur._id);
    res.render(
      'profil-socios',
      {
        auteur: req.utilisateur.nom,
        lesSocios: socios
      });
  } catch (err) {
    console.log('Une erreur est survenue lors de la récupération des socios : \n', err);
    res.render('404');
  }
}

exports.accueil = function (req, res) {
  if (req.session.utilisateur) {
    console.log(req.session.utilisateur);
    res.render('home');
  } else {
    res.render(
      'visiteur',
      {
        erreurs: req.flash('erreurs'),
        erreursInscription: req.flash('erreursInscription')
      }
    );
  }
}
