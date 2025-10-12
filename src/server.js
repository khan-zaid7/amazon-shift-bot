// src/server.js
const knex = require('knex');
const createApp = require('./app'); // Import the new app factory

const dbConfig = require('./config/database');
const createTodoRepository = require('./api/v1/repositories/todoRepository');
const createTodoService = require('./api/v1/services/todoService');

// --- The Real "DI Wiring" ---
const db = knex(dbConfig.development);
const todoRepository = createTodoRepository(db);
const todoService = createTodoService(todoRepository);

// Create the real app instance by passing the real service to the factory.
const app = createApp(todoService);
// --- End of Wiring ---

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});