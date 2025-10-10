//src/app.js

const express = require('express')
const dbConfig = require('./config/database');
const createTodoRepository = require('./api/v1/repositories/todoRepository');
const {createTodoService} = require('./api/v1/services/todoService');
const createTodoRouter = require('./api/v1/routes/todoRoutes');
const knex = require('knex');

// create an instance of express application
const app = express();

// enable express to receive json
app.use(express.json());

// create the db connection 
const db = knex(dbConfig.development)

// create the repository instance
const todoRepository = createTodoRepository(db);

// create the todo service instance 
const todoService = createTodoService(todoRepository);

app.use('/api/v1/todos', createTodoRouter(todoService));

// export the app so tha`t tests can use it 
module.exports = app;