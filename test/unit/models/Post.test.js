import should from 'should';

describe('PostModel', function() {

  describe('#create()', function() {
    it('should create a new post', function(done) {
      Post.create({
        title: 'This is a new post!!!',
        content: 'Post content'
      })
      .then(function(post) {
        post.title.should.be.eql('This is a new post!!!');
        post.slug.should.be.a.String();
        post.slug.should.be.eql('This-is-a-new-post');
        done();
      })
      .catch(done);
    });
  });
});
