/**
* Slug.js
*
* @description :: This model represents a slug
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      alphanumericdashed: true
    },
    modelName: {
      type: 'string'
    },
    parentId: {
      type: 'string'
    }
  },
};
