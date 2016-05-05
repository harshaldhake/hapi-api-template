var config = require('./config');

module.exports = {
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
