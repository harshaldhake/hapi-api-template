const config = require('../../config');
const knex = require('knex')({
  debug: process.env.DEBUG,
  client: 'pg',
  connection: config('/dbConnection'),
});

module.exports = () => knex;
module.exports['@singleton'] = true;
