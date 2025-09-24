// src/api/v1/services/todoService
// this file will simulate the database

const todos = [
    {id: 1, task: "Run a 5k", completed: false},
    {id: 2, task: "Go to the gym", completed: true}
];

const findTodoById = async (id) => {
   return todos.find(todo => todo.id === id);
}
const addTodo = async (todo) => {
    todos.push(todo);
    return todo;
}
const updateTodo = async (id, data) => {
    let todo = await findTodoById(id);
    for (const key in todo){
        if (data[key] !== undefined && todo[key] !== data[key]){
            todo[key] = data[key];
        }
    }
    return todo;
}

const deleteTodo = async (id) => {
    todos = todos.filter(todo => todo.id !== id);
}

module.exports = {
    findTodoById,
    addTodo,
    updateTodo,
    deleteTodo
};