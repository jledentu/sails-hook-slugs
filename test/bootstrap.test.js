var Sails = require('sails');

before(function(done) {

  console.log('before');
  this.timeout(50000);
  let config = {
    log: {
      level: 'info'
    },
    hooks: {
      slugs: require('../'),
      grunt: false,
      views: false
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
