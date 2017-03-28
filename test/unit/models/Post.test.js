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
        post.slug.should.match(/^this-is-a-new-post-/);

        post.should.have.property('slugAuthor');
        post.slugAuthor.should.be.a.String();
        post.slugAuthor.should.match(/^jeremie-ledentu-/);
        done();
      })
      .catch(done);
    });

    it('should not use a slug from global blacklist', (done) => {
      sails.config.slugs.blacklist = ['new'];
      Post.create({
        title: 'New',
        author: 'Jérémie Ledentu'
      })
      .then((post) => {
        post.should.have.property('slug');
        post.slug.should.be.a.String();
        post.slug.should.match(/^new-/);

        post.should.have.property('author');
        post.author.should.be.a.String();
        post.slugAuthor.should.match(/^jeremie-ledentu-/);

        done();
      });
    });

    it('should not use a slug from local blacklist', (done) => {
      Post.create({
        title: 'My new post',
        author: 'Profile'
      })
      .then((post) => {
        post.should.have.property('author');
        post.slugAuthor.should.match(/^profile-/);

        done();
      });
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
