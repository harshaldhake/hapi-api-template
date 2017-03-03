const models = require('../application/models');

module.exports = (knex) => {
  const bookshelf = require('bookshelf')(knex);
  bookshelf.plugin('registry');

  models.forEach(modelInfo => {
    bookshelf.model(modelInfo.name, modelInfo.model);
  });

  return bookshelf;
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['knex'];
