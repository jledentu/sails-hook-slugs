import requireAll from 'require-all';
import slug from 'slug';
import _ from 'lodash';

function SlugsHook(sails) {

  return {

    transformModels: function(models) {
      return _.chain(models)
        .mapValues((model, key) => {
          return _.defaults(model, {
            globalId: key,
            identity: key.toLowerCase()
          });
        })
        .mapKeys((model, key) => {
          return key.toLowerCase();
        })
        .value();
    },

    loadModels: function() {
      console.log('Loading Models...');
      try {
        let models = requireAll({
          dirname: __dirname + '/models',
          filter: /(.+)\.js$/
        });

        _.merge(sails.models || {}, this.transformModels(models));
      }
      catch (e) {
        console.log('No Models found');
      }
    },

    configure: function() {

    },

    initialize: function(next) {

      this.loadModels();

      sails.after(['hook:moduleloader:loaded'], function() {

        _.forOwn(sails.models, function(model) {

          if (model.slug && model.slug.from) {
            _.extend(model.attributes, {
              slugs: {
                collection: 'Slug'
              },
              currentSlug: {
                model: 'Slug'
              }
            });

            let beforeCreate = ((previousBeforeCreate) => function(values, cb) {
              Slug.create({
                name: slug(values[model.slug.from]),
                modelName: ''
              }).then(function(slug) {
                values.currentSlug = slug;

                if (typeof previousBeforeCreate === 'function') {
                  previousBeforeCreate(values, cb);
                }
                else {
                  cb();
                }
              })
              .catch(cb);
            })(model.beforeCreate);

            model.beforeCreate = beforeCreate;
          }
        });

        return next();
      });
    }
  };
}

module.exports = SlugsHook;
