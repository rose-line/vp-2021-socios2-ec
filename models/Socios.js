const sociosColl = require('../db').db().collection('socios');

const Socios = function (donnees) {
  this.donnees = donnees;
  this.erreurs = [];
}

Socios.prototype.nettoyerEntrees = function () {
  if (typeof (this.donnees.titre) !== 'string') {
    this.donnees.titre = '';
  }
  if (typeof (this.donnees.contenu) !== 'string') {
    this.donnees.contenu = '';
  }

  this.donnees = {
    titre: this.donnees.titre.trim(),
    contenu: this.donnees.contenu.trim(),
    dateCreation: new Date()
  }
}

Socios.prototype.validerEntrees = function () {
  if (!this.donnees.titre) {
    this.erreurs.push('Vous devez indiquer un titre');
  }
  if (!this.donnees.contenu) {
    this.erreurs.push('Vous devez indiquer un contenu');
  }

  if (this.erreurs.length !== 0) {
    throw this.erreurs;
  }
}

Socios.prototype.enregistrer = async function () {
  this.nettoyerEntrees();
  this.validerEntrees();

  try {
    await sociosColl.insertOne(this.donnees);
  } catch {
    throw "Une erreur s'est produite. Veuillez réessayer plus tard.";
  }
}

module.exports = Socios;
