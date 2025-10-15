// src/config/database.js
const knex = require("knex");
const path = require("path");

// Configuration for our development database
const development = {
    client: "sqlite3",
    connection: {
        filename: path.resolve(__dirname, "..", "..", "db", "dev.db3")
    },
    useNullAsDefault: true,
    migrations: {
        directory: "./src/db/migrations"
    },
    seeds: {
        directory: "./src/db/seeds"
    }
};

// Configration for our testing database
const test = {
    client: "sqlite3", 
    connection: {
        filename: ":memory:" // using in-memory database for testing
    },
    useNullAsDefault: true, 
    migrations: {
        directory: "./src/db/migrations"
    },
    seeds: {
        directory: "./src/db/seeds"
    }
};

// exporting the configrations objects that knex expects 
module.exports = {
    development, 
    test
}