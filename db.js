const mongodb = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
const port = process.env.PORT;

const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongodb.connect(connectionString, options, (err, client) => {
  console.log(err);
  module.exports = client.db();
  const serveur = require('./app');
  serveur.listen(port);
  console.log('Serveur écoute sur port ' + port);
});
