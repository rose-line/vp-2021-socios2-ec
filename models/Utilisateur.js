const validator = require('validator');
const utilisateursColl = require('../db').db().collection('utilisateurs');
const bcrypt = require('bcryptjs');

let Utilisateur = function (donnees) {

  this.donnees = donnees;
  this.erreurs = [];

}

Utilisateur.prototype.nettoyerEntrees = function () {
  if (typeof (this.donnees.nom) !== 'string') {
    this.donnees.nom = '';
  }
  if (typeof (this.donnees.email) !== 'string') {
    this.donnees.email = '';
  }
  if (typeof (this.donnees.mdp) !== 'string') {
    this.donnees.mdp = '';
  }

  this.donnees = {
    nom: this.donnees.nom.trim().toLowerCase(),
    email: this.donnees.email.trim().toLowerCase(),
    mdp: this.donnees.mdp
  }
}

Utilisateur.prototype.validerEntrees = async function () {
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
    // Vérif que le nom n'existe pas déjà
    let existeDeja = await utilisateursColl.findOne({ nom: this.donnees.nom });
    if (existeDeja) {
      this.erreurs.push("Ce nom d'utilisateur est déjà pris");
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

  let existeDeja = await utilisateursColl.findOne({ email: this.donnees.email });
  if (existeDeja) {
    this.erreurs.push('Cet email est déjà utilisé');
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

  if (this.erreurs.length !== 0) {
    throw this.erreurs;
  }
}

Utilisateur.prototype.connecter = async function () {
  this.nettoyerEntrees();

  let utilisateurTrouve;

  try {
    utilisateurTrouve = await utilisateursColl.findOne({ nom: this.donnees.nom });
  } catch {
    throw "Une erreur s'est produite. Veuillez réessayer plus tard.";
  }

  if (!utilisateurTrouve || !bcrypt.compareSync(this.donnees.mdp, utilisateurTrouve.mdp)) {
    throw 'Utilisateur ou mot de passe invalide';
  }

  this.donnees = utilisateurTrouve;
}

Utilisateur.prototype.inscrire = async function () {
  this.nettoyerEntrees();
  await this.validerEntrees();
  const sel = await bcrypt.genSalt(10);
  this.donnees.mdp = await bcrypt.hash(this.donnees.mdp, sel);
  await utilisateursColl.insertOne(this.donnees);
}

Utilisateur.trouverUtilisateur = async function (nom) {
  if (typeof (nom) !== 'string') {
    throw 'Nom utilisateur invalide';
  }

  let utilisateurTrouve;
  try {
    utilisateurTrouve = await utilisateursColl.findOne({ nom: nom });
  } catch {
    throw "Une erreur s'est produite. Veuillez essayer plus tard.";
  }

  if (utilisateurTrouve) {
    console.log('Utilisateur trouvé : ', utilisateurTrouve);

    // Cleanup
    utilisateurTrouve = {
      _id: utilisateurTrouve._id,
      nom: utilisateurTrouve.nom
    };
    return utilisateurTrouve;
  } else {
    throw 'Utilisateur introuvable';
  }
}

module.exports = Utilisateur;