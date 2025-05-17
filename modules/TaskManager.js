import { Task } from './Task.js';

export class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]').map(
      t => new Task(t.id, t.content, t.username, t.status, new Date(t.createdAt))
    );
  }

  save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(content, username) {
    const id = Date.now().toString();
    const task = new Task(id, content, username);
    this.tasks.push(task);
    this.save();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.save();
  }

  toggleStatus(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.toggleStatus();
      this.save();
    }
  }

  getAll() {
    return this.tasks;
  }
}
