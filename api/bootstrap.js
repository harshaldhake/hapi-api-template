const ioc = require('electrolyte');
const config = require('./config');
const handlebars = require('handlebars');

exports.register = (server, options, next) => {
  ioc.use(ioc.dir('src/application'));
  ioc.use(ioc.dir('src/lib'));

  // Configure templating engine for emails
  server.views({
    engines: {
      html: handlebars,
    },
    relativeTo: __dirname,
    path: 'templates',
  });

  server.auth.strategy('jwt', 'jwt', {
    key: config('/auth/secret'),
    validateFunc: ioc.create('auth/validateJWT'),
    verifyOptions: { algorithms: [ 'HS256' ] },
  });

  ioc.use(function(id) {
    if (id === 'server') {
      server['@literal'] = true;
      return server;
    }
  });

  server.ext('onRequest', function (request, reply) {
    // allow for the /api prefix
    request.setUrl(request.url.path.replace(/\/api\//, '/'));
    return reply.continue();
  });

  Promise.all([
    ioc.create('example/example-routes'),
  ])
  .then(routeArrays => {
    server.route([{
      method: 'GET',
      path: '/health-check',
      handler: (req, reply) => reply('all good'),
    }]);
    routeArrays.forEach(routes => {
      server.route(routes);
    })
  })
  .catch(e => console.error(e));

  next();
};

exports.register.attributes = {
  name: 'template-bootstrap',
  version: '0.0.1',
};
