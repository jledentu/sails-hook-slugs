import requireAll from 'require-all';
import _ from 'lodash';

function SlugsHook(sails) {

  return {

    loadModels: function() {
      console.log('Loading Models...');
      try {
        let models = requireAll({
          dirname: __dirname + '/models',
          filter: /(.+)\.js$/
        });

        console.log(models);
      }
      catch (e) {
        console.log('No Models found');
      }
    },

    configure: function() {

    },

    initialize: function(cb) {

      this.loadModels();

      sails.after(['hook:moduleloader:loaded'], function() {

        _(sails.models).forEach(function(model) {
          if (model.slug) {
            _.extend(model.attributes, {
              slugs: {
                collection: 'Slug'
              }
            });
          }
        });
      });
    }
  };
}

module.exports = SlugsHook;
