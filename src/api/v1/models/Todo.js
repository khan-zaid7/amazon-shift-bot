// src/api/v1/models/Todo

// @desc - Todo Model class
class Todo{
    constructor(id, task, completed){
        this.id = id;
        this.task = task;
        this.completed = completed;
    }
}

module.exports = Todo;