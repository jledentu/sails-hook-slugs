/**
* Slug.js
*
* @description :: This model represents a slug
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    slugs: {
      type: 'array'
    },
    current: {
      type: 'string',
      alphanumericdashed: true
    }
  },
};
