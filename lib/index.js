import requireAll from 'require-all';
import slug from 'slug';
import _ from 'lodash';
import * as uuid from 'node-uuid';

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

  function patchModels() {
    _.forOwn(sails.models, function(model, modelName) {

      _.forOwn(model.attributes, function(attr, name) {
        if (attr.type === 'slug' && attr.from) {
          attr.type = 'string';

          model.beforeCreate = ((previousBeforeCreate, from) => function(values, cb) {

            let slugName = slug(values[from], {lower: sails.config.slugs.lowercase});

            let criteria = {};
            criteria[name] = slugName;

            // Check that slug is not already used
            sails.models[modelName].count(criteria)
            .then(function (found) {
              if (found) {
                values[name] = slugName + '-' + uuid.v4();
              }
              else {
                values[name] = slugName;
              }

              if (typeof previousBeforeCreate === 'function') {
                previousBeforeCreate(values, cb);
              }
              else {
                cb();
              }
            })
            .catch(cb);

          })(model.beforeCreate, attr.from);

          delete attr.from;
        }
      });
    });
  }

  return {

    defaults: {
      __configKey__: {
        lowercase: true
      }
    },

    initialize: function(next) {

      //loadModels();

      sails.after(['hook:moduleloader:loaded'], function() {

        patchModels();

        return next();
      });
    }
  };
}

module.exports = SlugsHook;
