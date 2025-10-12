// src/api/v1/routes/todoRoutes

const express = require('express')
const createTodoController = require('../controllers/todoController');

const { todoValidationRules, updateTodoValidationRules, idValidator, validate } = require('../middleware/validators');

const createTodoRouter = (todoService) => {

    const router = express.Router();

    const todoController = createTodoController(todoService);

    router.route('/')
        .get(todoController.getTodos)
        .post(todoValidationRules(), validate, todoController.createTodo);
        
    router.route('/:id')
        .get(idValidator('id'), validate, todoController.getTodo)
        .patch(idValidator('id'), validate, updateTodoValidationRules(), validate, todoController.updateTodo)
        .delete(idValidator('id'), validate, todoController.removeTodo);

    return router;
}

module.exports = createTodoRouter;