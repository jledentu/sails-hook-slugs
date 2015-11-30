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

  function getBeforeCreateFunction(previousBeforeCreate) {
    return function(values, cb) {
      values.slug = slug(values[attr.from]);

      if (typeof previousBeforeCreate === 'function') {
        previousBeforeCreate(values, cb);
      }
      else {
        cb();
      }
    };
  }

  function patchModels() {
    _.forOwn(sails.models, function(model) {

      _.forOwn(model.attributes, function(attr, name) {
        if (attr.type === 'slug' && attr.from) {
          attr.type = 'string';

          model.beforeCreate = ((previousBeforeCreate) => function(values, cb) {
            values[name] = slug(values[attr.from]);

            if (typeof previousBeforeCreate === 'function') {
              previousBeforeCreate(values, cb);
            }
            else {
              cb();
            }
          })(model.beforeCreate);
        }
      });
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
