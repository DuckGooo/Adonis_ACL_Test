'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ArticleSchema extends Schema {
  up() {
    this.create('articles', (table) => {
      table.increments();
      table.string('title', 254).notNullable();
      table.string('content', 254).notNullable();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamp('deleted_at').nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('articles');
  }
}

module.exports = ArticleSchema;
