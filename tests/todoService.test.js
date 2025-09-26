// amazon-shift-bot/tests/todoService.test.js
const todoService = require("../src/api/v1/services/todoService");

describe("Todo service unit tests", () => {
    let initalTodoState;

    // this hook runs before every it(test) block in this describe.
    beforeEach(() => {
        jest.clearAllMocks();

        initalTodoState = [
            { id: 1, task: "Walk 5 kms.", completed: false },
            { id: 2, task: "Do homework", completed: true }
        ];
        // tell the service to use this state
        todoService.__test__only__.setTodos(initalTodoState);
    });

    describe("getAllTodo", () => {

        it("should be able to return all todos", async () => {
            const expectedTodos = [
                { id: 1, task: "Walk 5 kms.", completed: false },
                { id: 2, task: "Do homework", completed: true }
            ];

            const returnedTodos = await todoService.getAllTodos();

            expect(returnedTodos).toEqual(expectedTodos);
            expect(returnedTodos.length).toEqual(2);
        })

        it("should return an empty array if no todos exits", async () => {
            // arrange: 
            // change the state to initalize the todos array to be empty
            todoService.__test__only__.setTodos([]);

            // act
            const expectedTodos = [];
            const returnedTodos = await todoService.getAllTodos();

            // assert
            expect(returnedTodos.length).toEqual(0);
            expect(returnedTodos).toEqual(expectedTodos);
        })
    })

    describe("findTodoById", () => {
        it("should be able to find todos by id", async () => {
            const expectedTodo = { id: 2, task: "Do homework", completed: true };
            let id = 2;
            const todo = await todoService.findTodoById(id);
            expect(todo).toEqual(expectedTodo);
        });

        it("should return null if todo does not exisit", async () => {
            const id = 999;
            const todo = await todoService.findTodoById(id);
            expect(todo).toEqual(null);
        })
    })

    describe("addTodo", () => {
        it("should be able to add a new todo", async () => {
            const newTodo = { id: 3, task: "Added a new todo", completed: false };

            const returnedTodo = await todoService.addTodo(newTodo);
            const updatedTodos = await todoService.getAllTodos();

            expect(returnedTodo).toEqual(newTodo);
            expect(updatedTodos).toContainEqual(returnedTodo);
            expect(updatedTodos.length).toEqual(3);

        });

        it("should be able to return an error if the todo already exisits", async () => {
            const newTodo = { id: 1, task: "Walk 5 kms.", completed: false };

            const todo = await todoService.addTodo(newTodo);

            expect(todo).toEqual(null);
        });
    })

    describe("updateTodo", () => {
        it("should be able to update an existing todo", async () => {
            const data = { completed: true };
            const updatedTodo = { id: 1, task: "Walk 5 kms.", completed: true };
            const id = 1;

            const todo = await todoService.updateTodo(id, data);

            expect(todo).toEqual(updatedTodo);
        });

        it("should return null if the todo does not exist with specified id", async () => {
            const data = { completed: true };
            const id = 999;

            const todo = await todoService.updateTodo(id, data);

            expect(todo).toEqual(null);
        })
    });

    describe("deleteTodo", () => {
        it("should delete an todo", async () => {

            const id = 2;
            const isDeleted = await todoService.deleteTodo(id);

            expect(isDeleted).toEqual(true);
        });

        it("should return null if the todo is already deleted", async () => {
            const id = 3;

            const isDeleted = await todoService.deleteTodo(id);

            expect(isDeleted).toBe(false);

        });
    })


});