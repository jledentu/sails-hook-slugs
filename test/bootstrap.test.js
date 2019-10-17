require('should');
var sails = require('sails');

before(function(done) {

  this.timeout(50000);
  let config = {
    log: {
      level: 'verbose'
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

  sails.lift(config, function (err) {
    if (err) {
      return done(err);
    }
    global.sails = sails;
    return done();
  });
});

after(function(done) {
  sails.lower(done);
});
