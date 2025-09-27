// src/api/v1/services/todoService
// this file will simulate the database

let todos = [
    {id: 1, task: "Run a 5k", completed: false},
    {id: 2, task: "Go to the gym", completed: true}
];

const getAllTodos = async () => {
    return todos;
}

const findTodoById = async (id) => {
    const todo = todos.find((todo) => todo.id === id);

    if (!todo){
        return null;
    }

    return todo;
}
const addTodo = async (todo) => {
    const existingTodo = await findTodoById(todo.id);
    if (existingTodo) return null;

    todos.push(todo);
    return todo;
}
const updateTodo = async (id, data) => {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
        return null;
    }

    const updatedTodo = {...todos[todoIndex], ...data};
    todos[todoIndex] = updatedTodo;

    return updatedTodo;
}

const deleteTodo = async (id) => {
   const originalLength = todos.length;
   todos = todos.filter((todo) => todo.id !== id);
   return todos.length < originalLength;
}


const __test__only__ = {
    setTodos: (newTodoState) => {
        //parse to json to prevent test sharing same reference
        todos = JSON.parse(JSON.stringify(newTodoState));
    }
};

module.exports = {
    findTodoById,
    addTodo,
    updateTodo,
    deleteTodo,
    __test__only__,
    getAllTodos
};