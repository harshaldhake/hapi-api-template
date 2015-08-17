var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.register([
    {
        register: require('hapi-bookshelf-models'),
        options: {
            knex: {
                client: 'pg',
                connection: {
                    host: 'localhost',
                    user: 'maia',
                    password: 'password',
                    database: 'maia',
                    port: 5432
                }
            },
            plugins: ['registry'],
            models: './models/'
        }
    }
], function(err) {
    // TODO: handle errors
});

server.route({
    method: 'GET',
    path: '/things',
    handler: function(request, reply) {
        var Thing = server.plugins.bookshelf.model('Thing');
        Thing.fetchAll().then(function(things) {
            reply(things.toJSON());
        }).catch(function(err) {
            // TODO: Handle error
        });
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
