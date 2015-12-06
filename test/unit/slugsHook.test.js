describe('SlugsHook', function() {

  it('should add default config', function(done) {
    sails.config.should.have.property('slugs');
    sails.config.slugs.should.have.property('lowercase');
    sails.config.slugs.lowercase.should.be.eql(true);
    done();
  });
});
