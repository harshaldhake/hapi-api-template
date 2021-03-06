const Glue = require('glue');
const manifest = require('./manifest');

const options = {
  relativeTo: __dirname + '/src',
};

Glue.compose(manifest, options, function(err, server) {

  if (err) {
    throw err;
  }

  server.start(function () {
    console.log('Server running at:', server.info.uri);
    console.log('Environment:', process.env.NODE_ENV);
  });
});
