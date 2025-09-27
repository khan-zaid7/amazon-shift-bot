// src/api/v1/routes/todoRoutes

const express = require('express')
const {getTodos, getTodoById, createTodo, updateTodo, deleteTodo} = require('../controllers/todoController');
const {todoValidationRules,updateTodoValidationRules,idValidator, validate} = require('../middleware/validators');

const router = express.Router();

router.route('/')
    .get(getTodos)
    .post(todoValidationRules(), validate, createTodo);

router.route('/:id')
    .get(idValidator('id'), validate, getTodoById)
    .patch(idValidator('id'), validate, updateTodoValidationRules(), validate, updateTodo)
    .delete(idValidator('id'), validate, deleteTodo);


module.exports = router;