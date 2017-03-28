/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title: {
      type: 'string',
      required: true,
      unique: true
    },
    author: {
      type: 'string'
    },
    content: {
      type: 'text'
    },
    slug: {
      type: 'slug',
      from: 'title'
    },
    slugAuthor: {
      type: 'slug',
      from: 'author',
      blacklist: ['profile']
    }
  }
};
