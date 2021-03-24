const validator = require('validator');
const utilisateursColl = require('../db').collection('utilisateurs');

let Utilisateur = function (donnees) {

  this.donnees = donnees;
  this.erreurs = [];

}

Utilisateur.prototype.nettoyerEntrees = function () {
  if (typeof (this.donnees.nomInscription) !== 'string') {
    this.donnees.nomInscription = '';
  }
  if (typeof (this.donnees.emailInscription) !== 'string') {
    this.donnees.emailInscription = '';
  }
  if (typeof (this.donnees.mdpInscription) !== 'string') {
    this.donnees.mdpInscription = '';
  }

  this.donnees = {
    nom: this.donnees.nomInscription.trim().toLowerCase(),
    email: this.donnees.emailInscription.trim().toLowerCase(),
    mdp: this.donnees.mdpInscription
  }
}

Utilisateur.prototype.validerEntrees = function () {
  if (this.donnees.nom) {
    if (!validator.isAlphanumeric(this.donnees.nom)) {
      this.erreurs.push("Le nom ne doit pas inclure de caractères spéciaux");
    }
    if (this.donnees.nom.length < 3) {
      this.erreurs.push("Le nom doit avoir au moins 3 caractères");
    }
    if (this.donnees.nom.length > 30) {
      this.erreurs.push("Le nom doit avoir au maximum 30 caractères");
    }
  } else {
    this.erreurs.push("Vous devez indiquer votre nom d'utilisateur");
  }

  if (!this.donnees.email) {
    this.erreurs.push("Vous devez indiquer votre email");
  } else {
    if (!validator.isEmail(this.donnees.email)) {
      this.erreurs.push("Vous devez indiquer un email valide");
    }
  }

  if (!this.donnees.mdp) {
    this.erreurs.push("Vous devez indiquer votre mot de passe");
  } else {
    if (this.donnees.mdp.length < 12) {
      this.erreurs.push("Le mot de passe doit avoir au moins 12 caractères");
    }
    if (this.donnees.mdp.length > 50) {
      this.erreurs.push("Le mot de passe doit avoir au maximum 50 caractères");
    }
  }
}


Utilisateur.prototype.inscrire = function () {
  this.nettoyerEntrees();
  this.validerEntrees();

  // TODO: après validation, sauvegarder en DB

  if (this.erreurs.length === 0) {
    utilisateursColl.insertOne(this.donnees);
  }
}

module.exports = Utilisateur;