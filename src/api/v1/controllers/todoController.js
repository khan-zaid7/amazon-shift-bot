const statusCode = require('../utils/responseMapping');
const resolveResponse = require('../utils/resolveResponse');

const createTodoController = (todoService) => {
    return {
        async getTodos(req, res, next) {
            const result = await todoService.findAllTodos();
            return resolveResponse(result, res);
        },
        async getTodo(req, res, next) {
            const id = parseInt(req.params.id, 10);
            const result = await todoService.findTodoById(id);
            return resolveResponse(result, res);

        },
        async createTodo(req, res, next) {
            const requestData = req.body;
            const result = await todoService.createTodo(requestData);
            return resolveResponse(result, res);
        },
        async updateTodo(req, res, next) {
            const id = parseInt(req.params.id, 10);
            const requestData = req.body;

            const result = await todoService.updateTodo(id, requestData);
            return resolveResponse(result, res);
        },
        async removeTodo(req, res, next) {
            const id = parseInt(req.params.id, 10);
            const result = await todoService.removeTodo(id);
            return resolveResponse(result, res);
        }

    };
}


module.exports = createTodoController;