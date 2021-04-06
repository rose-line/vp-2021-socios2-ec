const Socios = require('../models/Socios');

exports.afficherVueCreation = function (req, res) {
  res.render('nouveau_socios');
}

exports.enregistrer = async function (req, res) {
  const socios = new Socios(req.body);

  try {
    await socios.enregistrer();
    res.send('Nouveau socios créé');
  } catch (err) {
    res.send(err);
  }
}
