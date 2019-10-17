/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    id: { type: 'number', autoIncrement: true},
    title: {
      type: 'string',
      required: true,
      unique: true
    },
    author: {
      type: 'string'
    },
    content: {
      type: 'string'
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
