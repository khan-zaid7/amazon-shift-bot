// src/api/v1/controllers/todoController
const todoService = require('../services/todoService');

// @desc Get all todos
// @route GET /api/v1/todos
// @access PUBLIC 
const getTodos = async (req, res, next) => {
    const todos = await todoService.getAllTodos();
    res.status(200).json(todos);
}

// @desc Get a single todo by ID
// @route GET /api/v1/todos/id
// @access PUBLIC
const getTodoById = async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    let todo = await todoService.findTodoById(id);


    if (!todo) {
        return res.status(404).json({ message: `Todo with id ${id} not found` });
    }

    return res.status(200).json(todo);
}

// @desc Post a new Todo
// @route POST /api/v1/todos
// @access PUBLIC
const createTodo = async (req, res, next) => {

    const { id, task, completed } = req.body;


    const existingTodo = await todoService.findTodoById(id);
    if (existingTodo) return res.status(409).json({ message: `Todo with id ${id} already exists.` });


    const newTodoData = { id, task, completed };
    let newTodo = await todoService.addTodo(newTodoData);

    return res.status(201).json(newTodo);
}


// @desc Update an exisiting Todo
// @route PATCH /api/v1/todos
// @access PUBLIC
const updateTodo = async (req, res, next) => {

    const id = parseInt(req.params.id, 10);

    const existingTodo = await todoService.findTodoById(id);
    if (!existingTodo) { 
        return res.status(404).json({ message: `Todo with id ${id} not found.` });
    };

    // build an object with only the fields persent in the request body
    // This is secure and correctly handles partical updates 
    const updateData = {};
    
    // list of all the field which can be updated
    const allowedUpdates = ['task', 'completed'];

    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined){
            updateData[field] = req.body[field];
        }
    });
    
    //return an error if no valid fields found in the request body
    if (Object.keys(updateData).length === 0){
        return res.status(400).json({message: 'No valid fields provided for update.'});
    }

    const updatedTodo = await todoService.updateTodo(existingTodo.id, updateData);

    res.status(200).json(updatedTodo);
};


// @desc Delete a Todo
// @route DELETE /api/v1/todos
// @access PUBLIC
const deleteTodo = async (req, res, next) => {
    const id = parseInt(req.params.id, 10);

    const existingTodo = await todoService.findTodoById(id);
    if (!existingTodo) {
        return res.status(404).json({message: `Todo with id ${id} does not exist.`})
    }

    await todoService.deleteTodo(existingTodo.id);
    
    res.status(204).send();
}


module.exports = {
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};