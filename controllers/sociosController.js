const Socios = require('../models/Socios');

exports.afficherVueCreation = function (req, res) {
  res.render('nouveau-socios');
}

exports.enregistrer = async function (req, res) {
  const socios = new Socios(req.body, req.session.utilisateur.id);

  try {
    const idDuSociosCree = await socios.enregistrer();
    req.flash('succes', 'Socios créé !');
    req.session.save(() => {
      res.redirect(`/socios/${idDuSociosCree}`);
    });
  } catch (err) {
    req.flash('erreurs', err);
    req.session.save(() => {
      res.redirect(`/creer_socios`);
    });
  }
}

exports.afficherVueSocios = async function (req, res) {
  let socios;
  try {
    socios = await Socios.trouverSocios(req.params.id);
    const estAuteur = clientEstAuteur(req.session.utilisateur, socios);
    res.render('socios', { socios: socios, estAuteur: estAuteur });
  } catch (err) {
    console.log('Erreur lors de la recherche du socios : ', err);
    res.render('404');
  }
}

exports.afficherVueEdition = async function (req, res) {
  try {
    const socios = await Socios.trouverSocios(req.params.id);
    res.render(
      'edition-socios',
      {
        socios: socios
      });
  } catch (err) {
    console.log('Erreur lors de l\'affichage du socios ', req.params.id, err);
    res.render('404');
  }
}

exports.mettreAJour = async function (req, res) {
  const socios = new Socios(req.body, req.session.utilisateur.id, req.params.id);

  try {
    await socios.mettreAJour();
    req.flash('succes', 'Socios mis à jour !');
  } catch (err) {
    console.log(err);
    req.flash('erreurs', err);
  }
  req.session.save(() => {
    res.redirect(`/socios/${req.params.id}/editer`);
  });
}

exports.supprimer = async function (req, res) {
  try {
    await Socios.supprimer(req.params.id);
    req.flash('succes', 'Socios supprimé !');
  } catch (err) {
    console.log(err);
    req.flash('erreurs', err);
  }
  req.session.save(() => {
    res.redirect(`/profil/${req.session.utilisateur.nom}`);
  });
}


function clientEstAuteur(utilisateurConnecte, socios) {
  if (!utilisateurConnecte) {
    return false;
  }
  return utilisateurConnecte.id === socios.auteur.id;
}
