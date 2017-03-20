import slug from 'slug';
import * as uuid from 'node-uuid';

function SlugsHook(sails) {

  function patchModels() {

    for (let modelName of Object.keys(sails.models)) {
      let model = sails.models[modelName];

      for (let name of Object.keys(model.attributes)) {
        let attr = model.attributes[name];
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
      }
    }
  }

  return {

    defaults: {
      __configKey__: {
        lowercase: true
      }
    },

    initialize: function(next) {

      sails.after(['hook:moduleloader:loaded'], function() {

        patchModels();

        return next();
      });
    }
  };
}

module.exports = SlugsHook;
