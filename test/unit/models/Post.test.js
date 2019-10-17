import should from 'should';

describe('PostModel', function() {

  describe('#create()', function() {
    it('should create a new post', function(done) {
      sails.models.post.create({
        title: 'This is a new post!!!',
        content: 'Post content',
        author: 'Jérémie Ledentu'
      })
      .fetch()
      .then(function(post) {
        post.should.have.property('title');
        post.title.should.eql('This is a new post!!!');

        post.should.have.property('author');
        post.author.should.eql('Jérémie Ledentu');

        post.should.have.property('slug');
        post.slug.should.eql('this-is-a-new-post');

        post.should.have.property('slugAuthor');
        post.slugAuthor.should.eql('jeremie-ledentu');
        done();
      })
      .catch(done);
    });

    it('should resolve slug conflicts', function(done) {
      sails.models.post.create({
        title: 'This is a new post!!',
        content: 'Post content 2',
        author: 'Jérémie Ledentu'
      })
      .fetch()
      .then(function(post) {
        post.should.have.property('title');
        post.title.should.eql('This is a new post!!');

        post.should.have.property('author');
        post.author.should.eql('Jérémie Ledentu');

        post.should.have.property('slug');
        post.slug.should.match(/^this-is-a-new-post-/);

        post.should.have.property('slugAuthor');
        post.slugAuthor.should.match(/^jeremie-ledentu-/);
        done();
      })
      .catch(done);
    });

    it('should not use a slug from global blacklist', (done) => {
      sails.config.slugs.blacklist = ['new'];
      sails.models.post.create({
        title: 'New',
        author: 'Jérémie Ledentu'
      })
      .fetch()
      .then((post) => {
        post.should.have.property('slug');
        post.slug.should.match(/^new-/);

        post.should.have.property('author');
        post.slugAuthor.should.match(/^jeremie-ledentu-/);

        done();
      });
    });

    it('should not use a slug from local blacklist', (done) => {
      sails.models.post.create({
        title: 'My new post',
        author: 'Profile'
      })
      .fetch()
      .then((post) => {
        post.should.have.property('author');
        post.slugAuthor.should.match(/^profile-/);

        done();
      });
    });

    it('should not use lowercase if lowercase === false in the config', done => {
      sails.config.slugs.lowercase = false;

      sails.models.post.create({
        title: 'THIS IS A TITLE IN UPPERCASE',
        content: 'Post content',
        author: 'Jérémie Ledentu'
      })
      .fetch()
      .then(post => {
        post.should.have.property('slug');
        post.slug.should.eql('THIS-IS-A-TITLE-IN-UPPERCASE');
        post.slugAuthor.should.eql('Jeremie-Ledentu');

        sails.config.slugs.lowercase = true;

        done();
      })
      .catch(done);
    });

    it('should use separator defined in config', done => {
      sails.config.slugs.separator = '_';

      sails.models.post.create({
        title: 'This is underscore',
        content: 'Post content',
        author: 'Jérémie Ledentu'
      })
      .fetch()
      .then(post => {
        post.should.have.property('slug');
        post.slug.should.eql('this_is_underscore');
        post.slugAuthor.should.eql('jeremie_ledentu');

        sails.config.slugs.separator = '-';

        done();
      })
      .catch(done);
    });
  });

  describe('#findOne({slug})', function() {
    it('should return the entity with given slug', function(done) {
      sails.models.post.findOne({ slug: 'this-is-a-new-post' })
      .then(function(post) {
        post.should.have.property('title');
        post.title.should.eql('This is a new post!!!');
        post.slug.should.eql('this-is-a-new-post');
        done();
      })
      .catch(done);
    });
  });
});
