// tests/todoRepository.test.js

const knex = require("knex");
const dbConfig = require("../src/config/database");
const createTodoRepository = require("../src/api/v1/repositories/todoRepository");


// create a database connection specifically for testing 
// we pass test configuration to it 
const testDb = knex(dbConfig.test);

// create an instance of todoReportisty 
const todoRepository = createTodoRepository(testDb);

describe("TodoRepository", () => {

    // Runs before all the test in this file 
    beforeAll(async () => {
        // run the migrations in the in-memeory test database
        await testDb.migrate.latest();
    });

    afterAll(async () => {
        // destroy the in-memory database connection after we're done
        await testDb.destroy();
    });

    beforeEach(async () => {
        // reset the database tables before each test 
        await testDb('todos').truncate();
    });

    describe("create", () => {
        it("should be able to create a new todo", async () => {

            const data = { task: "Creating a todo", completed: false };
            const expectedData = {id: 1, task: "Creating a todo", completed: false };

            const returnedData = await todoRepository.create(data);

            expect(returnedData).toEqual(expect.objectContaining(expectedData));
        })

        it("should throw an error when creating duplicate todo", async () => {
            const data = { task: "Creating a todo", completed: false };
            const expectedData = {id: 1, task: "Creating a todo", completed: false };

            const returnedData = await todoRepository.create(data);

            await expect(todoRepository.create(data)).rejects.toThrow("Duplicate todo detected");
        })
    });

    describe("findById", () => {
        const data = { task: "Creating a todo", completed: false };

        it("should be able to find an todo with the sepecified id", async () => {
            const id = 1;
            const expectedData = { id: 1, task: "Creating a todo", completed: false };

            const todo = await todoRepository.create(data);
            const returnedData = await todoRepository.findById(id);

            expect(returnedData).toEqual(expectedData);
        })

        it("should be return null if no todo was found with sepecified id", async () => {
            const id = 1;

            const returnedData = await todoRepository.findById(id);

            expect(returnedData).toEqual(null);
        })
    });

    describe("getAll", () => {
        it("should be able to return all the todos", async () => {

            const todos = [
                { task: "Todo 1", completed: false },
                { task: "Todo 2", completed: true },
                { task: "Todo 3", completed: false }
            ];

            const expectedTodos = [
                { id: 1, task: "Todo 1", completed: false },
                { id: 2, task: "Todo 2", completed: true },
                { id: 3, task: "Todo 3", completed: false }
            ]

            const todoIds = await todoRepository.createMany(todos);
            const returnedTodos = await todoRepository.findAll(testDb);

            expect(returnedTodos).toEqual(returnedTodos);
        });

        it("should be able to return an empty array if no todos exist", async () => {
            const returnedTodos = await todoRepository.findAll(testDb);
            
            expect(returnedTodos).toEqual([]);
        })
    });

    describe("update", () => {
        it("should be able to update an existing todo", async () => {
             
            const data = {task: "Updating a todo.", completed: false};
            const updateData = {task: "Todo Updated.", completed: true};
            
            // create a todo 
            const newTodo = await todoRepository.create(data);
            
            const updatedTodo = await todoRepository.update(newTodo.id, updateData);

            expect(updatedTodo).toEqual(expect.objectContaining(updateData));
        });
    })

    describe("remove", () => {
        it("should be able to delete an exisitng todo", async () => {
            const id = 1;
            const beforeDelete = {id: 1, task: "Delete this todo.", completed: false};
            const afterDelete = null;

            const newTodo = await todoRepository.create({task: "Delete this todo.", completed: false});
            await todoRepository.remove(id);
            const deletedTodo = await todoRepository.findById(id);

            expect(newTodo).toEqual(beforeDelete);
            expect(deletedTodo).toEqual(afterDelete);
        })
    })

});