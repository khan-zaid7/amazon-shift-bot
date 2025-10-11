// src/api/v1/services/todoService
const ServiceResult = require('../utils/serviceResult');

const ResultCode = {
    NOT_FOUND: 'NOT_FOUND',
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SUCCESS: 'SUCCESS',
    DEFAULT: 'DEFAULT',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
};

const createTodoService = (todoRepository) => {
    return {
        async createTodo(requestData) {
            try {
                const { task, completed } = requestData;
                const existingTodo = await todoRepository.findByTask(task);

                if (existingTodo && (existingTodo.length !== 0)) {
                    return new ServiceResult({ success: false, code: ResultCode.DUPLICATE_ENTRY, message: "Duplicate todo found." });
                }

                const todo = await todoRepository.create({ task, completed });
                return new ServiceResult({ success: true, data: todo, code: ResultCode.SUCCESS, message: "Todo Created." });
            }
            catch (error) {
                // Log the real error for debugging purposes
                console.error('An unexpected error occurred in the service:', error);
                // Return a standardized error response to the caller
                return new ServiceResult({
                    success: false,
                    code: ResultCode.DEFAULT, // Or a new 'INTERNAL_ERROR' code
                    message: 'An unexpected error occurred.'
                });
            }
        },
        async findTodoById(id) {
            try {
                const todo = await todoRepository.findById(id);
                if (!todo) {
                    return new ServiceResult({ success: false, code: ResultCode.NOT_FOUND, message: "Todo not found." });
                }
                return new ServiceResult({ success: true, data: todo, code: ResultCode.SUCCESS, message: "Todo Found." });
            }
            catch (error) {
                // Log the real error for debugging purposes
                console.error('An unexpected error occurred in the service:', error);
                // Return a standardized error response to the caller
                return new ServiceResult({
                    success: false,
                    code: ResultCode.DEFAULT, // Or a new 'INTERNAL_ERROR' code
                    message: 'An unexpected error occurred.'
                });
            }
        },
        async findAllTodos() {
            try {
                const todos = await todoRepository.findAll();
                return new ServiceResult({ success: true, data: todos, code: ResultCode.SUCCESS, message: "Todos found." });
            }
            catch (error) {
                // Log the real error for debugging purposes
                console.error('An unexpected error occurred in the service:', error);
                // Return a standardized error response to the caller
                return new ServiceResult({
                    success: false,
                    code: ResultCode.DEFAULT, // Or a new 'INTERNAL_ERROR' code
                    message: 'An unexpected error occurred.'
                });
            }
        },
        async updateTodo(id, data) {
            try {
                // find the todo 
                const todo = await todoRepository.findById(id);
                if (!todo) {
                    return new ServiceResult({ success: false, code: ResultCode.NOT_FOUND, message: "Todo not found." });
                }

                //check if the data is valid 
                const allowedFields = ['task', 'completed'];
                const fieldsToUpdate = {};

                allowedFields.forEach(field => {
                    if (data[field] !== undefined) {
                        fieldsToUpdate[field] = data[field];
                    }
                });

                if (Object.keys(fieldsToUpdate).length === 0) {
                    return new ServiceResult({ success: false, code: ResultCode.VALIDATION_ERROR, message: "No valid fields available to update." });
                }
                const updatedTodo = await todoRepository.update(id, fieldsToUpdate);
                return new ServiceResult({ success: true, data: updatedTodo, code: ResultCode.SUCCESS, message: "Todo updated." });
            }
            catch (error) {
                // Log the real error for debugging purposes
                console.error('An unexpected error occurred in the service:', error);
                // Return a standardized error response to the caller
                return new ServiceResult({
                    success: false,
                    code: ResultCode.DEFAULT, // Or a new 'INTERNAL_ERROR' code
                    message: 'An unexpected error occurred.'
                });
            }
        },
        async removeTodo(id) {
            try {
                // find the id 
                const todo = await todoRepository.findById(id);
                if (!todo) {
                    return new ServiceResult({ success: false, code: ResultCode.NOT_FOUND, message: "Todo not found." });
                }
                const deleted = await todoRepository.remove(id);
                return new ServiceResult({ success: true, code: ResultCode.SUCCESS, message: "Todo deleted." });
            }
            catch (error) {
                // Log the real error for debugging purposes
                console.error('An unexpected error occurred in the service:', error);
                // Return a standardized error response to the caller
                return new ServiceResult({
                    success: false,
                    code: ResultCode.DEFAULT, // Or a new 'INTERNAL_ERROR' code
                    message: 'An unexpected error occurred.'
                });
            }
        }
    }
}

module.exports = { createTodoService, ServiceResult, ResultCode };