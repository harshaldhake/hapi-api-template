var config = require('./config');

module.exports = {
    server : {
        connections: {
            routes: {
                validate: {
                    options: { abortEarly: false },
                    failAction: (request, reply, source, error) => {
                        error.output.payload.validationErrors = error.data.details.map(failure => ({
                            message    : failure.message,
                            type       : failure.type,
                            key        : failure.path
                        }));
                        reply(error);
                    }
                }
            }
        }
    },
    connections : [{
        port : 9000
    }],
    registrations : [
        {
            plugin : {
                register : 'hapi-auth-jwt2'
            }
        },
        {
            plugin : {
                register : 'vision',
            }
        },
        {
            plugin : {
                register : '../bootstrap'
            }
        },
        {
            plugin : {
                register : 'hapi-email-kue',
                options : config('/email')
            }
        },
    ]
};
