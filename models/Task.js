class Task {
    constructor(id, content) {
        this.id = id;
        this.content = content;
        //this.status = status;
    }
    
    static #tasks = [];
    
    
    static add(task) {
        if (!this.findById(task.id)) {
        this.#tasks.push(task);
        }
    }

    static deleteById(id) {
        this.#tasks = this.#tasks.filter((task) => task.id !== id);
    }

    static getAll() {
        return this.#tasks;
    }

    static findById(id) {
        return this.#tasks.find((task) => task.id === id);
    }

}


module.exports = Task;