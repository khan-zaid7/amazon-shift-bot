// src/app.js

const express = require('express');
const todoRoutes = require('./api/v1/routes/todoRoutes');

// This is now a FACTORY function. It ACCEPTS the service it needs.
const createApp = (todoService) => {
    const app = express();
    app.use(express.json());

    // It uses the provided service to wire up the routes.
    app.use('/api/v1/todos', todoRoutes(todoService));

    // It returns the fully configured app instance.
    return app;
};

module.exports = createApp;


