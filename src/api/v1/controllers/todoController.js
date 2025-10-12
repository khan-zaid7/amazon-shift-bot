const statusCode = require('../utils/responseMapping');
const resolveResponse = require('../utils/resolveResponse');

const createTodoController = (todoService) => {
    return {
        async getTodos(req, res, next) {
            const result = await todoService.findAllTodos();

            if ((result.success === true) && Array.isArray(result.data) && (result.code === 'SUCCESS')) {
                return res.status(statusCode[result.code]).json(result.data);
            }

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

            if ((result.success === true) && (result.code === 'SUCCESS')) {
                return res.status(statusCode[result.code]).json({ message: result.message });
            }
            
            return resolveResponse(result, res);
        }

    };
}


module.exports = createTodoController;