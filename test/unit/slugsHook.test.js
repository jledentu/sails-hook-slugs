describe('SlugsHook', function() {

  it('should add default config', function(done) {
    sails.config.should.have.property('slugs');
    sails.config.slugs.should.have.property('lowercase');
    sails.config.slugs.lowercase.should.eql(true);
    sails.config.slugs.should.have.property('blacklist');
    sails.config.slugs.blacklist.should.eql([]);
    sails.config.slugs.should.have.property('separator');
    sails.config.slugs.separator.should.eql('-');
    done();
  });
});
