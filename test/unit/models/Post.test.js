import should from 'should';

describe('PostModel', function() {

  describe('#create()', function() {
    it('should create a new post', function(done) {
      Post.create({
        title: 'This is a new post!!!',
        content: 'Post content',
        author: 'Jérémie Ledentu'
      })
      .then(function(post) {
        post.should.have.property('title');
        post.title.should.be.a.String();
        post.title.should.be.eql('This is a new post!!!');

        post.should.have.property('author');
        post.author.should.be.a.String();
        post.author.should.be.eql('Jérémie Ledentu');

        post.should.have.property('slug');
        post.slug.should.be.a.String();
        post.slug.should.be.eql('this-is-a-new-post');

        post.should.have.property('slugAuthor');
        post.slugAuthor.should.be.a.String();
        post.slugAuthor.should.be.eql('jeremie-ledentu');
        done();
      })
      .catch(done);
    });

    it('should resolve slug conflicts', function(done) {
      Post.create({
        title: 'This is a new post!!',
        content: 'Post content 2',
        author: 'Jérémie Ledentu'
      })
      .then(function(post) {
        post.should.have.property('title');
        post.title.should.be.a.String();
        post.title.should.be.eql('This is a new post!!');

        post.should.have.property('author');
        post.author.should.be.a.String();
        post.author.should.be.eql('Jérémie Ledentu');

        post.should.have.property('slug');
        post.slug.should.be.a.String();
        post.slug.should.not.be.eql('this-is-a-new-post');
        post.slug.should.match(/^this-is-a-new-post-/);

        post.should.have.property('slugAuthor');
        post.slugAuthor.should.be.a.String();
        post.slugAuthor.should.not.be.eql('jeremie-ledentu');
        done();
      })
      .catch(done);
    });
  });

  describe('#findOneBySlug()', function() {
    it('should exist in the model', function(done) {
      Post.should.have.property('findBySlug');
      Post.findOneBySlug.should.be.a.Function();
      done();
    });

    it('should return the entity with given slug', function(done) {
      Post.findOneBySlug('this-is-a-new-post')
      .then(function(post) {
        post.should.have.property('title');
        post.title.should.be.a.String();
        post.title.should.be.eql('This is a new post!!!');
        post.slug.should.be.a.String();
        post.slug.should.be.eql('this-is-a-new-post');
        done();
      })
      .catch(done);
    });
  });
});
