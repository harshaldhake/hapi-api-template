module.exports = (knex) => {
  const bookshelf = require('bookshelf')(knex);
  bookshelf.plugin('registry');
  return bookshelf;
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['knex'];
