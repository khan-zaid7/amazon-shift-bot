
jest.mock('../src/api/v1/services/todoService')

const request = require('supertest');
const createApp = require('../src/app');
const { createTodoService } = require('../src/api/v1/services/todoService');

const ServiceResult = require('../src/api/v1/utils/serviceResult');
const ResultCode = require('../src/api/v1/utils/resultCode');


describe("Todo API", () => {
    let mockTodoService;
    let app;

    beforeEach(() => {
        jest.clearAllMocks();

        mockTodoService = {
            findAllTodos: jest.fn(),
            findTodoById: jest.fn(),
            createTodo: jest.fn(),
            updateTodo: jest.fn(),
            removeTodo: jest.fn()
        };

        createTodoService.mockReturnValue(mockTodoService);
        app = createApp(mockTodoService);
    });



    // describe = a jest function that groups tests together in a test suite
    describe('GET /api/v1/todos', () => {
        //an individual test case, behavior of test, description should be readable
        it('should response with an array of toods', async () => {
            const todos = [
                { id: 1, task: "Run a 5k", completed: false },
                { id: 2, task: "Go to the gym", completed: true }
            ];
            const result = new ServiceResult({ success: true, data: todos, code: ResultCode.SUCCESS, message: "Todo Found." });
            mockTodoService.findAllTodos.mockResolvedValue(result);


            // the request to app
            //request object takes the app (express application)
            const response = await request(app)
                //performs a Get request to the specified endpoint
                .get('/api/v1/todos')
                //helper function by supertest to assert on the request 
                .expect('Content-Type', /json/) // we expect a json reponse 
                .expect(200); // we expect 200 status code

            // after the request check if the response body is indeed an array
            expect(response.body).toBeInstanceOf(Array);

            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty("id");
                expect(response.body[0]).toHaveProperty("task");
            }
            expect(mockTodoService.findAllTodos).toHaveBeenCalledTimes(1);
        });
    });

    //test to get a single todo
    describe('GET /api/v1/todos/:id', () => {

        // get the todo with the specified id
        it('it should respond with a specific todo object when found', async () => {
            // Arrange
            //telling the mock what to return for this sepcific test
            const mockTodo = { id: 1, task: "Test Todo", completed: false };
            const result = new ServiceResult({ success: true, data: mockTodo, code: ResultCode.SUCCESS, message: "Todo Found." });
            mockTodoService.findTodoById.mockResolvedValue(result);

            // Act: make the request
            const response = await request(app)
                .get('/api/v1/todos/1')
                .expect('Content-type', /json/)
                .expect(200)

            //Assert : checking that the correct data was returned
            expect(response.body).toEqual(mockTodo);
        });

        // // get request if the todo does not exist
        it('it should response with 404 Not Found if todo does not exist', async () => {

            const result = new ServiceResult({ success: false, data: null, code: ResultCode.NOT_FOUND, message: "Todo not found." });
            mockTodoService.findTodoById.mockResolvedValue(result);

            // Act: call the todo api
            const response = await request(app)
                .get('/api/v1/todos/999')
                .expect('Content-Type', /json/)
                .expect(404)

            // Assert check the correct data was retuned
            expect(response.body).toEqual({ message: "Todo not found." });

            // Assert the service was still called
            expect(mockTodoService.findTodoById).toHaveBeenCalledWith(999);
        });

    });


    // test to create a new todo
    describe('POST /api/v1/todos', () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });


        it('it should create and return a new todo', async () => {

            const requestData = { task: "Add a new todo", completed: false };
            const expectedTodo = { id: 1, task: "Add a new todo", completed: false };

            const result = new ServiceResult({ success: true, data: expectedTodo, code: ResultCode.CREATED, message: "Todo created." });
            mockTodoService.createTodo.mockResolvedValue(result);

            const response = await request(app)
                .post('/api/v1/todos')
                .send(requestData)
                .expect('Content-Type', /json/)
                .expect(201);

            // assert: check the correct data was returned
            expect(response.body).toEqual(result.data);

            //assert: check if the function was called with the correct data
            expect(mockTodoService.createTodo).toHaveBeenCalledWith(requestData);
            expect(mockTodoService.createTodo).toHaveBeenCalledTimes(1);

        });

        it('it should return 400 bad status if the requst body is missing a field', async () => {
            const mockTodo = { task: "Add a new todo" };

            const response = await request(app)
                .post('/api/v1/todos')
                .send(mockTodo)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body.errors[0]).toHaveProperty('completed', "The 'completed' field is required.");

        })
        it('it should return 400 bad status if a field in request body is invalid', async () => {
            const mockTodo = { task: 5, completed: false };

            const response = await request(app)
                .post('/api/v1/todos')
                .send(mockTodo)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body.errors[0]).toHaveProperty('task', "The 'task' field must be a string.")
        })

        it('it should return 409 conflict status if the request body already exists', async () => {
            const requestData = { id: 1, task: "Add a new todo", completed: false };
            const result = new ServiceResult({ success: false, data: null, code: ResultCode.DUPLICATE_ENTRY, message: "Duplicate Todo found." });
            mockTodoService.createTodo.mockResolvedValue(result);

            const response = await request(app)
                .post('/api/v1/todos')
                .send(requestData)
                .expect('Content-Type', /json/)
                .expect(409)

            expect(response.body).toEqual({ message: "Duplicate Todo found." });

        });
    });

    describe('PATCH /api/v1/todos/:id', () => {

        beforeEach(() => {
            jest.clearAllMocks();
        })

        it('it should be able to update an existing todo', async () => {
            const requestData = { task: "homework done", completed: true };
            const updatedTodo = { id: 1, task: "homework done", completed: true };

            const result = new ServiceResult({ success: true, data: updatedTodo, code: ResultCode.SUCCESS, message: "Todo updated." });
            mockTodoService.updateTodo.mockResolvedValue(result);

            const response = await request(app)
                .patch('/api/v1/todos/1')
                .send(requestData)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(response.body).toEqual(result.data);
            expect(mockTodoService.updateTodo).toHaveBeenCalledWith(1, requestData);
            expect(mockTodoService.updateTodo).toHaveBeenCalledTimes(1);

        });


        it('it should return a 404 not found error if no todo is found with the specified id', async () => {
            const data = { task: "homework done", completed: true };

            const result = new ServiceResult({ success: false, data: null, code: ResultCode.NOT_FOUND, message: "Todo not found." });
            mockTodoService.updateTodo.mockResolvedValue(result);

            const response = await request(app)
                .patch('/api/v1/todos/222')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(404)

            expect(response.body).toEqual({ message: "Todo not found." })

        })

        it('it should return a 400 bad request error if the request body is invalid', async () => {
            const invalidData = { completed: "not-a-bool" }

            const response = await request(app)
                .patch('/api/v1/todos/2')
                .send(invalidData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body.errors[0]).toHaveProperty("completed", "The 'completed' field must be an boolean.");
        });

        it('it should return a 400 invalid data error if the request body is invalid', async () => {
            const invalidData = { isAdmin: true };
            const result = new ServiceResult({ success: false, data: null, code: ResultCode.VALIDATION_ERROR, message: "No valid fields available to update." });
            mockTodoService.updateTodo.mockResolvedValue(result);

            const response = await request(app)
                .patch('/api/v1/todos/2')
                .send(invalidData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toEqual({ message: result.message });
            expect(mockTodoService.updateTodo).toHaveBeenCalledWith(2, invalidData);

        });

    });

    describe('DELETE /api/v1/todos/:id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })

        it("delete the todo with the specified id in the url", async () => {
            const id = 2;
            
            const result = new ServiceResult({ success: true, data: null, code: ResultCode.NO_CONTENT, message: "Todo Deleted." });
            mockTodoService.removeTodo.mockResolvedValue(result);


            const response = await request(app)
                .delete(`/api/v1/todos/${id}`)
                .expect(204);

            expect(response.body).toEqual({});
            expect(mockTodoService.removeTodo).toHaveBeenCalledTimes(1);
            expect(mockTodoService.removeTodo).toHaveBeenCalledWith(id);
        });

        it("return a 404 Not Found error if the todo with the specified id does not exist", async () => {
            const id = 999;
            const result = new ServiceResult({ success: false, data: null, code: ResultCode.NOT_FOUND, message: "Todo not found." });
            mockTodoService.removeTodo.mockResolvedValue(result);

            const response = await request(app)
                .delete(`/api/v1/todos/${id}`)
                .expect('Content-Type', /json/)
                .expect(404)

            expect(response.body).toEqual({ message: `Todo not found.` })

        });


    })

});








