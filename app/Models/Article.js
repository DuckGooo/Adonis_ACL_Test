'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Article extends Model {
  users() {
    return this.belongsTo('App/Models/User', 'user_id', 'id');
  }
}

module.exports = Article
