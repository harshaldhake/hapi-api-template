module.exports = (server) => {
  return {
    get: (request, reply) => {
      reply('example get request succeeded');
    },
  };
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['server'];
