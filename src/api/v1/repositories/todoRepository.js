//src/api/v1/repositories/todoRepository.js

const createTodoRepository = (db) => {
    return {
        // cerate a new todo 
        async create(data) {
            console.log(data)
            const [todo] = await db('todos')
                .returning(['id', 'task', 'completed'])
                .insert({ task: data.task, completed: data.completed });
            return normalizeTodo(todo);
        },

        // create many new todos at once
        async createMany(data) {
            const todos = await db('todos')
                .returning(['id', 'task', 'completed'])
                .insert(data);
            return todos.map(todo => normalizeTodo(todo));
        },

        async findById(id) {
            const todo = await db('todos')
                .where({ id })
                .select('id', 'task', 'completed')
                .first();
            return todo ? normalizeTodo(todo) : undefined;
        },

        async findAll() {
            const todos = await db('todos')
                .select('id', 'task', 'completed');
            return todos.map(todo => normalizeTodo(todo));
        },

        async update(id, { task, completed }) {

            const [updatedTodo] = await db('todos')
                .where({ id })
                .update({ task: task, completed: completed })
                .returning(['id', 'task', 'completed']);

            return normalizeTodo(updatedTodo);
        },

        async remove(id) {
            return await db('todos')
                .where({ id })
                .del();
        }
    }
}

const normalizeTodo = (todo) => {
    return {
        ...todo,
        completed: Boolean(todo.completed)
    };
}

module.exports = createTodoRepository
