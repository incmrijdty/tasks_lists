class Task {
  constructor(id, content, username, status = 'pending', createdAt = new Date()) {
    this.id = id;
    this.content = content;
    this.username = username;
    this.status = status;
    this.createdAt = createdAt;
  }

  toggleStatus() {
    this.status = this.status === 'pending' ? 'done' : 'pending';
  }
}



class TaskManager {
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


const manager = new TaskManager();
const taskList = document.getElementById('taskList');
const form = document.getElementById('taskForm');
const input = document.getElementById('taskContent');
const userInput = document.getElementById('username');

function renderTasks() {
  taskList.innerHTML = '';
  manager.getAll().forEach(task => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>ID:</strong> ${task.id}</p>
      <p><strong>Content:</strong> ${task.content}</p>
      <p><strong>User:</strong> ${task.username}</p>
      <p><strong>Status:</strong> <em>${task.status}</em></p>
      <div class="buttons">
        <button data-id="${task.id}" class="toggle">✔ Mark as done/pending</button>
        <button data-id="${task.id}" class="delete">🗑 Delete</button>
      </div>
    `;
    taskList.appendChild(div);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  manager.addTask(input.value, userInput.value);
  input.value = '';
  userInput.value = '';
  renderTasks();
});

taskList.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    manager.deleteTask(e.target.dataset.id);
    renderTasks();
  }

  if (e.target.classList.contains('toggle')) {
    manager.toggleStatus(e.target.dataset.id);
    renderTasks();
  }
});

renderTasks();
