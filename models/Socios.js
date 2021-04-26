const sociosColl = require('../db').db().collection('socios');
const ObjectID = require('mongodb').ObjectID;

const Socios = function (donnees, idUtilisateur, idSociosEdite) {
  this.donnees = donnees;
  this.idUtilisateur = ObjectID(idUtilisateur);
  this.idSociosEdite = ObjectID(idSociosEdite);
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
    auteur: this.idUtilisateur,
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

Socios.prototype.mettreAJour = async function () {
  this.nettoyerEntrees();
  this.validerEntrees();

  try {
    await sociosColl.findOneAndUpdate(
      { _id: this.idSociosEdite },
      {
        $set:
        {
          titre: this.donnees.titre,
          contenu: this.donnees.contenu
        }
      }
    );
  } catch {
    throw "Une erreur s'est produite. Veuillez réessayer plus tard.";
  }
}

Socios.trouverSocios = async function (id) {
  if (typeof (id) !== 'string' || !ObjectID.isValid(id)) {
    throw 'ID invalide';
  }

  let sociosTrouve;
  try {
    //sociosTrouve = await sociosColl.findOne({ _id: new ObjectID(id) });

    let sociosTrouves = await sociosColl.aggregate([
      { $match: { _id: new ObjectID(id) } },
      {
        $lookup:
        {
          from: 'utilisateurs',
          localField: 'auteur',
          foreignField: '_id',
          as: 'documentAuteur'
        }
      },
      {
        $project: {
          titre: 1,
          contenu: 1,
          dateCreation: 1,
          auteur: { $arrayElemAt: ['$documentAuteur', 0] }
        }
      }
    ]).toArray();

    sociosTrouve = sociosTrouves[0];

  } catch {
    console.log('Erreur dans trouverSocios : \n', err);
    throw "Une erreur s'est produite. Veuillez essayer plus tard.";
  }

  if (sociosTrouve) {
    sociosTrouve.auteur =
    {
      id: sociosTrouve.auteur._id.toString(),
      nom: sociosTrouve.auteur.nom
    }
    console.log('Socios trouvé : ', sociosTrouve);
    return sociosTrouve;
  } else {
    throw 'ID introuvable';
  }
}

Socios.trouverLesSociosDe = async function (idAuteur) {
  if (!ObjectID.isValid(idAuteur)) {
    throw 'ID invalide';
  }

  let sociosTrouves = [];

  try {
    sociosTrouves = await sociosColl.find({ auteur: idAuteur }).toArray();
  } catch (err) {
    console.log('Erreur dans trouverLesSociosDe : \n', err);
    throw "Une erreur s'est produite. Veuillez essayer plus tard.";
  }

  console.log('Socios trouvés : \n', sociosTrouves);
  return sociosTrouves;
}

module.exports = Socios;
