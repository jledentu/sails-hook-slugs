import requireAll from 'require-all';
import slug from 'slug';
import _ from 'lodash';

function SlugsHook(sails) {

  function transformModels(models) {
    return _.chain(models)
      .mapValues((model, key) => {
        return _.defaults(model, {
          globalId: key,
          identity: key.toLowerCase()
        });
      })
      .mapKeys((model, key) => key.toLowerCase())
      .value();
  }

  function loadModels() {
    console.log('Loading Models...');
    try {
      let models = requireAll({
        dirname: __dirname + '/models',
        filter: /(.+)\.js$/
      });

      _.merge(sails.models || {}, transformModels(models));
    }
    catch (e) {
      console.log('No Models found');
    }
  }

  function findBySlug(model) {

    return function(slugName) {
      Slug.findOne({modelName: model.globalId, name: slugName})
        .then((slug) => model.findOne(slug.parentId))
        .catch();
    };
  }

  function patchModels() {
    _.forOwn(sails.models, function(model) {

      if (model.slug && model.slug.from) {
        model.attributes.slug = {type: 'string'};

        let beforeCreate = ((previousBeforeCreate) => function(values, cb) {
          values.slug = slug(values[model.slug.from]);

          if (typeof previousBeforeCreate === 'function') {
            previousBeforeCreate(values, cb);
          }
          else {
            cb();
          }
        })(model.beforeCreate);

        let afterCreate = ((previousAfterCreate) => function(values, cb) {
          Slug.create({
            name: values.slug,
            modelName: model.globalId,
            parentId: values.id
          })
          .then(function(slug) {
            if (typeof previousAfterCreate === 'function') {
              previousAfterCreate(values, cb);
            }
            else {
              cb();
            }
          })
          .catch(cb);
        })(model.afterCreate);

        model.beforeCreate = beforeCreate;
        model.afterCreate = afterCreate;

        model.findBySlug = ((model) => function(slugName) {
          Slug.findOne({modelName: model.globalId, name: slugName})
            .then((slug) => model.findOne(slug.parentId))
            .catch();
        })(model);
      }
    });
  }

  return {

    configure: function() {

    },

    initialize: function(next) {

      loadModels();

      sails.after(['hook:moduleloader:loaded'], function() {

        patchModels();

        return next();
      });
    }
  };
}

module.exports = SlugsHook;
