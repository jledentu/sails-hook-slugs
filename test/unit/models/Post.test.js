var should = require('should');

describe('PostModel', function() {

  describe('#create()', function() {
    it('should create a new post', function(done) {
      Post.create({
        title: 'This is a new post!!!',
        content: 'Post content'
      })
      .populate('currentSlug')
      .then(function(post) {
        should.exist(post.currentSlug);
        post.title.should.be.eql('This is a new post!!!');
        should.exist(post.currentSlug);
        done();
      })
      .catch(done);
    });
  });
});
