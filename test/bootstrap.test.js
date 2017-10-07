require('should');
var Sails = require('sails');

before(function(done) {

  this.timeout(50000);
  let config = {
    log: {
      level: 'info'
    },
    hooks: {
      slugs: require('../lib'),
      grunt: false,
      views: false
    },
    models: {
      migrate: 'drop'
    }
  };

  Sails.lift(config, function (err, sails) {
    if (err) {
      return done(err);
    }
    return done();
  });
});

after(function(done) {
  Sails.lower(done);
});
