// src/db/migrations/20250929_create_todos_table.js

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
exports.up = function(knex) {
    // up function happens when we run the migrations
    return knex.schema.createTable('todos', (table) => {
        table.increments('id').primary(); // create an auto-incremeting id column as the primary key
        table.string('task').notNullable().unique(); //create a task column of type string that cannot be null 
        table.boolean('completed').notNullable(); // create a completed column of type boolean that cannot be null
        table.timestamp(true, true); // Adds created_at and updated_at table
    });
}


/**
 * @param {import ("knex").Knex} knex
 * @returns {Promise<void>}
 */
exports.down = function(knex) {
    // the down function happens when we need to undo the database migration
    return knex.schema.dropTable('todos');
}