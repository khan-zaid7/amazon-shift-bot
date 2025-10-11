// amazon-shift-bot/tests/todoService.test.js
const createTodoRepository = require('../src/api/v1/repositories/todoRepository');
const { createTodoService, ServiceResult, ResultCode } = require('../src/api/v1/services/todoService');


jest.mock('../src/api/v1/repositories/todoRepository');

describe("Todo Service", () => {
    let mockTodoRepository;
    let todoService;

    beforeEach(() => {
        jest.clearAllMocks();

        mockTodoRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByTask: jest.fn()
        };

        createTodoRepository.mockReturnValue(mockTodoRepository);

        todoService = createTodoService(mockTodoRepository);
    })

    describe("create todo", () => {
        it("should be able to create a new todo", async () => {
            // Act
            const requestData = { task: "Create a new todo", completed: false };
            const expectedData = { id: 1, ...requestData };
            const expectedResult = new ServiceResult({ "code": ResultCode.SUCCESS, "data": expectedData, "message": "Todo Created.", "success": true });


            mockTodoRepository.create.mockResolvedValue(expectedData);
            mockTodoRepository.findByTask.mockResolvedValue([]);

            // Action
            const returnedData = await todoService.createTodo(requestData);

            //Assert 
            expect(returnedData).toEqual(expectedResult);
            expect(mockTodoRepository.create).toHaveBeenCalledWith(requestData);
            expect(mockTodoRepository.create).toHaveBeenCalledTimes(1);

        });

        it("should not be able to create duplicate todos", async () => {
            // Act
            const requestData = { task: "Create a new todo", completed: false };
            const expectedData = { id: 1, ...requestData };
            const expectedResult = new ServiceResult({ "code": ResultCode.DUPLICATE_ENTRY, "message": "Duplicate todo found.", "success": false });
            mockTodoRepository.findByTask.mockResolvedValue([expectedData]);
            // Action
            const todo = await todoService.createTodo(requestData);
            // Assert 
            expect(todo).toEqual(expectedResult);
            expect(mockTodoRepository.create).not.toHaveBeenCalled();
        });
    });

    describe("Get todo", () => {
        it("should be able to get a todo with specified id", async () => {

            // Act
            const id = 1;
            const expectedTodo = { id: 1, task: "First Todo", completed: false };
            mockTodoRepository.findById.mockResolvedValue(expectedTodo);
            const expectedResult = new ServiceResult({ "code": ResultCode.SUCCESS, "data": expectedTodo, "message": "Todo Found.", "success": true });


            // Action 
            const returnedTodo = await todoService.findTodoById(id);

            // Assert
            expect(returnedTodo).toEqual(expectedResult);
            expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);

        });

        it("should be return null if todo is not found with the given id", async () => {

            // act 
            const id = 1;
            mockTodoRepository.findById.mockResolvedValue(null);
            const expectedResult = new ServiceResult({ "code": ResultCode.NOT_FOUND, "message": "Todo not found.", "success": false });

            const todo = await todoService.findTodoById(id);

            expect(todo).toEqual(expectedResult);
            expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
        })
    });

    describe("Get all todos", () => {
        it("Should be able to get all the todos", async () => {
            // Act
            const todos = [
                { id: 1, task: "First Todo", completed: false },
                { id: 2, task: "Second Todo", completed: true },
                { id: 3, task: "Third Todo", completed: true }
            ];
            mockTodoRepository.findAll.mockResolvedValue(todos);

            const returnedTodos = await todoService.findAllTodos();
            const expectedTodos = new ServiceResult({ success: true, data: todos, code: ResultCode.SUCCESS, message: "Todos found." })

            expect(returnedTodos).toEqual(expectedTodos);
            expect(mockTodoRepository.findAll).toHaveBeenCalledTimes(1);

        });

        it("Should return an empty array if there are no todos", async () => {
            mockTodoRepository.findAll.mockResolvedValue([]);
            const expectedData = new ServiceResult({ "code": "SUCCESS", "data": [], "message": "Todos found.", "success": true });
            const todos = await todoService.findAllTodos();

            expect(todos).toEqual(expectedData);
            expect(mockTodoRepository.findAll).toHaveBeenCalledTimes(1);
        })
    });

    describe("Update todo", () => {
        it("Should be able to udpate an existing todo", async () => {
            const id = 1;
            const data = { task: "Task 1 completed" };
            const initialTodo = { id: 1, task: "Task 1 not completed", completed: false };
            const expectedTodo = { id: 1, task: "Task 1 completed", completed: true };
            const expectedData = new ServiceResult({ success: true, data: expectedTodo, code: ResultCode.SUCCESS, message: "Todo updated." });

            mockTodoRepository.findById.mockResolvedValue(initialTodo);
            mockTodoRepository.update.mockResolvedValue(expectedTodo);

            const updatedData = await todoService.updateTodo(id, data);

            expect(updatedData).toEqual(expectedData);
            expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);


            expect(mockTodoRepository.update).toHaveBeenCalledTimes(1);
            expect(mockTodoRepository.update).toHaveBeenCalledWith(id, data);

        });
        it("Should be return null if no todo found with id", async () => {
            const id = 1;
            const data = { task: "task 1 completed" };
            const expectedData = new ServiceResult({ success: false, code: ResultCode.NOT_FOUND, message: "Todo not found." });

            mockTodoRepository.findById.mockResolvedValue(null);

            const updatedTodo = await todoService.updateTodo(id, data);

            expect(updatedTodo).toEqual(expectedData);
            expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockTodoRepository.update).toHaveBeenCalledTimes(0);
            expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);

        });

        it("Should return null if no validated field found to update", async () => {
            const id = 1;
            const data = { isAdmin: true };
            const expectedData = new ServiceResult({ success: false, code: ResultCode.VALIDATION_ERROR, message: "No valid fields available to update." });

            mockTodoRepository.findById.mockResolvedValue({ id: 1, task: "Task not completed", completed: false });

            const updatedTodo = await todoService.updateTodo(id, data);
            expect(updatedTodo).toEqual(expectedData);
            expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
        });

        it("Should only be able to update valid fields", async () => {
            const id = 1;
            const data = { isAdmin: true, task: "Done" };
            const sanitizedData = { task: "Done" };
            const expectedTodo = { id: 1, task: "Done", completed: true };
            const expectedData = new ServiceResult({ success: true, data: expectedTodo, code: ResultCode.SUCCESS, message: "Todo updated." });


            mockTodoRepository.findById.mockResolvedValue({ id: 1, task: "Task not completed", completed: false });
            mockTodoRepository.update.mockResolvedValue({ id: 1, task: "Done", completed: true });

            const updatedTodo = await todoService.updateTodo(id, data);
            expect(updatedTodo).toEqual(expectedData);

            expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);

            expect(mockTodoRepository.update).toHaveBeenCalledTimes(1);
            expect(mockTodoRepository.update).toHaveBeenCalledWith(id, sanitizedData);
        });
    })

    describe("Remove todo", () => {
        it("should be able to remove a todo", async () => {
            const id = 1;
            mockTodoRepository.findById.mockResolvedValue({ id: 1, task: "remove this todo", completed: false });
            mockTodoRepository.remove.mockResolvedValue(true);
            const expectedData = new ServiceResult({ success: true, code: ResultCode.SUCCESS, message: "Todo deleted." });

            const isDeleted = await todoService.removeTodo(id);

            expect(isDeleted).toEqual(expectedData);
            expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
            expect(mockTodoRepository.remove).toHaveBeenCalledWith(id);
            expect(mockTodoRepository.remove).toHaveBeenCalledTimes(1);

        });
        it("should be able to return null if no todo was found", async () => {
            const id = 1;
            mockTodoRepository.findById.mockResolvedValue(null);
            const expectedData = new ServiceResult({ success: false, code: ResultCode.NOT_FOUND, message: "Todo not found." });

            const isDeleted = await todoService.removeTodo(id);

            expect(isDeleted).toEqual(expectedData);
            expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
            

        });

    })

})