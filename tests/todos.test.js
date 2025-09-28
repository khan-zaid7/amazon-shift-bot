const request = require('supertest');
const app = require('../src/app'); // this will fail 
const todoService = require('../src/api/v1/services/todoService')

// mocking the todo service 
// replace all the functions in the todoService with functions we can control
jest.mock("../src/api/v1/services/todoService")

// describe = a jest function that groups tests together in a test suite
describe('GET /api/v1/todos', () => {
    //an individual test case, behavior of test, description should be readable
    it('should response with an array of toods', async () => {
        todoService.getAllTodos.mockResolvedValue([
            { id: 1, task: "Run a 5k", completed: false },
            { id: 2, task: "Go to the gym", completed: true }
        ]);
        // the request to app
        //request object takes the app (express application)
        const response = await request(app)
            //performs a Get request to the specified endpoint
            .get('/api/v1/todos')
            //helper function by supertest to assert on the request 
            .expect('CONTENT-TYPE', /json/) // we expect a json reponse 
            .expect(200); // we expect 200 status code

        // after the request check if the response body is indeed an array
        expect(response.body).toBeInstanceOf(Array);
    });
})

//test to get a single todo
describe('GET /api/v1/todos/:id', () => {
    //clear the mock history before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });


    // get the todo with the specified id
    it('it should respond with a specific todo object when found', async () => {
        // Arrange
        //telling the mock what to return for this sepcific test 
        const mockTodo = { id: 1, task: "Test Todo", completed: false };
        todoService.findTodoById.mockResolvedValue(mockTodo);

        // Act: make the request
        const response = await request(app)
            .get('/api/v1/todos/1')
            .expect('Content-type', /json/)
            .expect(200)

        //Assert : checking that the correct data was returned 
        expect(response.body).toEqual(mockTodo);

        // Assert : that the service was called correclty 
        expect(todoService.findTodoById).toHaveBeenCalledWith(1);
        expect(todoService.findTodoById).toHaveBeenCalledTimes(1);
    });

    // // get request if the todo does not exist
    it('it should response with 404 Not Found if todo does not exist', async () => {

        // Arrange: tell mock to return null for this case
        todoService.findTodoById.mockResolvedValue(null);

        // Act: call the todo api
        const response = await request(app)
            .get('/api/v1/todos/999')
            .expect('Content-Type', /json/)
            .expect(404)

        // Assert check the correct data was retuned 
        expect(response.body).toEqual({ message: "Todo with id 999 not found" });

        // Assert the service was still called
        expect(todoService.findTodoById).toHaveBeenCalledWith(999);
    })

})

// test to create a new todo
describe('POST /api/v1/todos', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    it('it should create and return a new todo', async () => {
        const mockTodo = { id: 25, task: "Add a new todo", completed: false };
        todoService.addTodo.mockResolvedValue(mockTodo);
        todoService.findTodoById.mockResolvedValue(undefined);

        const response = await request(app)
            .post('/api/v1/todos')
            .send(mockTodo)
            .expect('Content-Type', /json/)
            .expect(201);

        // assert: check the correct data was returned 
        expect(response.body).toEqual(mockTodo);

        //assert: check if the function was called with the correct data
        expect(todoService.addTodo).toHaveBeenCalledWith(mockTodo);
        expect(todoService.addTodo).toHaveBeenCalledTimes(1);

    });

    it('it should return 400 bad status if the requst body is missing a field', async () => {
        const mockTodo = { task: "Add a new todo", completed: false };

        const response = await request(app)
            .post('/api/v1/todos')
            .send(mockTodo)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body.errors[0]).toHaveProperty('id', "The 'id' field is required.");

    })
    it('it should return 400 bad status if a field in request body is invalid', async () => {
        const mockTodo = { id: 20, task: 5, completed: false };

        const response = await request(app)
            .post('/api/v1/todos')
            .send(mockTodo)
            .expect('Content-Type', /json/)
            .expect(400)

        expect(response.body.errors[0]).toHaveProperty('task', "The 'task' field must be a string.")
    })

    it('it should return 409 conflict status if the request body already exists', async () => {
        const mockTodo = { id: 25, task: "Add a new todo", completed: false };
        todoService.findTodoById.mockResolvedValue(mockTodo);

        const response = await request(app)
            .post('/api/v1/todos')
            .send(mockTodo)
            .expect('Content-Type', /json/)
            .expect(409)

        expect(response.body).toEqual({ message: "Todo with id 25 already exists." });

    })
})

describe('PATCH /api/v1/todos/:id', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('it should be able to update an existing todo', async () => {
        const originalTodo = { id: 2, task: "do homework", completed: false };
        const data = { task: "homework done", completed: true };
        const updatedTodo = { id: 2, task: "homework done", completed: true };

        // finds the todo
        todoService.findTodoById.mockResolvedValue(originalTodo);
        todoService.updateTodo.mockResolvedValue(updatedTodo);

        const response = await request(app)
            .patch('/api/v1/todos/2')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body).toEqual(updatedTodo);
        expect(todoService.findTodoById).toHaveBeenCalledWith(2);
        expect(todoService.updateTodo).toHaveBeenCalledWith(2, data);

    })
    it('it should return a 404 not found error if no todo is found with the specified id', async () => {
        const data = { task: "homework done", completed: true };

        // finds the todo
        todoService.findTodoById.mockResolvedValue(null);

        const response = await request(app)
            .patch('/api/v1/todos/222')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(404)

        expect(response.body).toEqual({ message: "Todo with id 222 not found." })

    })

    it('it should return a 400 bad request error if the request body is invalid', async () => {
        const invalidData = { completed: "not-a-bool" }

        const response = await request(app)
            .patch('/api/v1/todos/2')
            .send(invalidData)
            .expect('Content-Type', /json/)
            .expect(400)

        expect(response.body.errors[0]).toHaveProperty("completed", "The 'completed' field must be an boolean.");
    })

})

describe('DELETE /api/v1/todos/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("delete the todo with the specified id in the url", async () => {
        const id = 2;
        todoService.findTodoById.mockResolvedValue({ id: 2, task: "Complete Homework", completed: false });
        todoService.deleteTodo.mockResolvedValue(true);
        const response = await request(app)
            .delete(`/api/v1/todos/${id}`)
            .expect(204)

        expect(response.body).toEqual({});
        expect(todoService.deleteTodo).toHaveBeenCalledTimes(1);
        expect(todoService.deleteTodo).toHaveBeenCalledWith(id);
    });

    it("return a 404 Not Found error if the todo with the specified id does not exist", async () => {
        const id = 999;
        todoService.findTodoById.mockResolvedValue(null);

        const response = await request(app)
            .delete(`/api/v1/todos/${id}`)
            .expect('Content-Type', /json/)
            .expect(404)

        expect(response.body).toEqual({ message: `Todo with id ${id} does not exist.` })

    });


})