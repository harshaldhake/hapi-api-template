var ioc = require('electrolyte');
var config = require('./config');
var handlebars = require('handlebars');

exports.register = (server, options, next) => {
    ioc.use(ioc.dir('src/application'));
    ioc.use(ioc.dir('src/lib'));

    // Configure templating engine for emails
    server.views({
        engines: {
            html: handlebars
        },
        relativeTo: __dirname,
        path: 'templates'
    });

    server.auth.strategy('jwt', 'jwt', {
        key: config('/auth/secret'),
        validateFunc: ioc.create('auth/validateJWT'),
        verifyOptions: { algorithms: [ 'HS256' ] }
    });

    ioc.use(function(id) {
        if (id === 'server') {
            server['@literal'] = true;
            return server;
        }
    });

    Promise.all([
        ioc.create('example/example-routes')
    ])
    .then(routeArrays => {
        routeArrays.forEach(routes => {
            server.route(routes);
        })
    })
    .catch(e => console.error(e));

    next();
};

exports.register.attributes = {
    name    : 'template-bootstrap',
    version : '0.0.1'
};
