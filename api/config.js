var Confidence = require('confidence');

var redis = {
    host : process.env.REDIS_HOST || 'localhost',
    port : process.env.REDIS_PORT || 6379
};
var kue   = {
    prefix : 'q',
    redis  : redis
};

var DEV_EMAIL_DOMAIN = 'sandbox-subdomain-goes-here.mailgun.org';

var config = {
    '$filter' : 'env',
    '$base'   : {
        dbConnection : {
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER,
            password : process.env.DB_PASS,
            database : process.env.DB_NAME,
            port     : process.env.DB_PORT
        },
        auth : {
            secret : process.env.JWT_SECRET
        },
        redis : redis,
        kue : kue,
        email : {
            kueConfig    : kue,
            driver       : 'mailgun',
            driverConfig : {
                key    : process.env.MAILGUN_API_KEY,
                domain : DEV_EMAIL_DOMAIN,
            },
        },
    },
    'development' : {
        rollbar : {
            enabled : false
        },
        email : {
            rfqRecipient : process.env.DEVELOPER_NAME + '+' + process.env.APP_NAME + '@' + process.env.DEV_DOMAIN,
            driverConfig : {
                trap : process.env.DEVELOPER_NAME + '+' + process.env.APP_NAME + '@' + process.env.DEV_DOMAIN,
                whitelist : [
                    'syn0.com',
                    'synapsestudios.com',
                ]
            },
        },
    },
    'qa' : {
        email : {
            rfqRecipient : 'qa@syn0.com',
            driverConfig : {
                trap : 'qa@syn0.com',
                whitelist : [
                    'syn0.com',
                    'synapsestudios.com',
                ]
            },
        },
    },

    'staging' : {
        email : {
            rfqRecipient : 'qa@syn0.com',
            driverConfig : {
                trap : 'qa@syn0.com',
                whitelist : [
                    'syn0.com',
                    'synapsestudios.com',
                ]
            },
        },
    },
    'production' : {
    }
};

module.exports = function(path, criteria) {
    var store = new Confidence.Store();
    path = path ? path : '/';
    criteria = criteria ? criteria : {};
    criteria.env = process.env.NODE_ENV || 'development';

    store.load(config);
    return store.get(path, criteria);
};
