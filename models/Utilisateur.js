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

//
Utilisateur.prototype.connecter = async function () {
  // Vérifier les credentials
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

  // utilisateursColl.findOne({ nom: this.donnees.nom }, (err, utilisateurTrouve) => {
  //   if (utilisateurTrouve) {
  //     if (utilisateurTrouve.mdp === this.donnees.mdp) {
  //       console.log('succes');
  //     } else {
  //       console.log('echec - mdp pas ok');
  //     }
  //   } else {
  //     console.log('echec - nom pas ok');
  //   }
  // });
}

// Version avec callback
// Utilisateur.prototype.connecter = function (callback) {
//   this.nettoyerEntrees();
//   utilisateursColl.findOne({ nom: this.donnees.nom }, (err, utilisateurTrouve) => {
//     if (utilisateurTrouve && utilisateurTrouve.mdp === this.donnees.mdp) {
//       callback('succes');
//     } else {
//       callback('echec');
//     }
//   });
// }

// Version avec promesses
// Utilisateur.prototype.connecter = function () {
//   return new Promise((resolve, reject) => {
//     this.nettoyerEntrees();
//     utilisateursColl.findOne({ nom: this.donnees.nom }, (err, utilisateurTrouve) => {
//       if (utilisateurTrouve && utilisateurTrouve.mdp === this.donnees.mdp) {
//         resolve('succes');
//       } else {
//         reject('Utilisateur ou mot de passe invalide');
//       }
//     });
//   });
// }

Utilisateur.prototype.inscrire = async function () {
  this.nettoyerEntrees();
  await this.validerEntrees();

  // TODO: après validation, sauvegarder en DB

  if (this.erreurs.length === 0) {
    const sel = bcrypt.genSaltSync(10);
    this.donnees.mdp = bcrypt.hashSync(this.donnees.mdp, sel);
    utilisateursColl.insertOne(this.donnees);
  }
}

module.exports = Utilisateur;