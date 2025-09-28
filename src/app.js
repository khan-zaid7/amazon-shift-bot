//src/app.js

const express = require('express')
const todoRoutes = require('./api/v1/routes/todoRoutes');

// create an instance of express application
const app = express();

// enable express to receive json
app.use(express.json());

app.use('/api/v1/todos', todoRoutes);

// export the app so tha`t tests can use it 
module.exports = app;