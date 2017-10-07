import slug from 'slugg';
import uuid from 'uuid/v4';

function SlugsHook(sails) {

  /**
   * Indicate whether a given slug can be used as it is or not.
   *
   * @param {string}    slugName      Slug to check
   * @param {string}    modelName     Name of the model
   * @param {string}    attributeName Attribute on which the slug is defined
   * @param {Array}     blacklist     List of names to not use
   * @returns {Promise}
   */
  function slugCanBeUsed(slugName, modelName, attributeName, blacklist) {

    return new Promise((resolve, reject) => {

      if (sails.config.slugs.blacklist.indexOf(slugName) !== -1 ||
          (Array.isArray(blacklist) && blacklist.indexOf(slugName) !== -1)) {
        return resolve(false);
      }

      const criteria = {};
      criteria[attributeName] = slugName;
  
      sails.models[modelName].count(criteria)
      .then((found) => {
        resolve(!found);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  function patchModels() {

    for (let modelName of Object.keys(sails.models)) {
      let model = sails.models[modelName];

      for (let name of Object.keys(model.attributes)) {
        let attr = model.attributes[name];
        if (attr.type === 'slug' && attr.from) {
          attr.type = 'string';

          model.beforeCreate = ((previousBeforeCreate, from, blacklist) => function(values, cb) {

            const slugName = slug(values[from], {
              toLowerCase: sails.config.slugs.lowercase,
              separator: sails.config.slugs.separator
            });

            // Check that slug is not already used
            slugCanBeUsed(slugName, modelName, name, blacklist)
            .then(ok => {
              values[name] = ok ? slugName : slugName + sails.config.slugs.separator + uuid();

              if (typeof previousBeforeCreate === 'function') {
                previousBeforeCreate(values, cb);
              }
              else {
                cb();
              }
            })
            .catch(cb);

          })(model.beforeCreate, attr.from, attr.blacklist);

          delete attr.from;
        }
      }
    }
  }

  return {

    defaults: {
      __configKey__: {
        lowercase: true,
        blacklist: [],
        separator: '-'
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
