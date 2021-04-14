const Socios = require('../models/Socios');

exports.afficherVueCreation = function (req, res) {
  res.render('nouveau_socios');
}

exports.enregistrer = async function (req, res) {
  const socios = new Socios(req.body, req.session.utilisateur.id);

  try {
    await socios.enregistrer();
    res.send('Nouveau socios créé');
  } catch (err) {
    res.send(err);
  }
}

exports.afficherVueSocios = async function (req, res) {
  let socios;
  try {
    socios = await Socios.trouverSocios(req.params.id);
  } catch (err) {
    console.log('Erreur lors de la recherche du socios : ', err);
  }
  res.render('socios', { socios: socios });
}
