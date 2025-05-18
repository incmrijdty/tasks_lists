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

  updateTask(id, content, username) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.content = content;
      task.username = username;
      this.save();
    }
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
      <div class="task-card">
        <div class="task-display">
          <p><strong>ID:</strong> ${task.id}</p>
          <p><strong>Content:</strong> ${task.content}</p>
          <p><strong>User:</strong> ${task.username}</p>
          <p><strong>Status:</strong> <em>${task.status}</em></p>
        </div>
        <div class="buttons">
          <button data-id="${task.id}" class="toggle">✔ Mark as done/pending</button>
          <form data-id="${task.id}" class="delete-confirm">
            <button type="submit">🗑 Delete</button>
          </form>
          <button data-id="${task.id}" class="edit">Edit</button>
        </div>
        <form class="edit-form hidden" data-id="${task.id}">
          <input type="text" name="content" value="${task.content}" required />
          <input type="text" name="username" value="${task.username}" required />
          <button type="submit">Save</button>
          <button type="button" class="cancel-edit">Cancel</button>
        </form>
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
  if (e.target.classList.contains('toggle')) {
    manager.toggleStatus(e.target.dataset.id);
    renderTasks();
  }

   if (e.target.classList.contains('edit')) {
    const card = e.target.closest('.task-card');
    if (!card) return;

    const display = card.querySelector('.task-display');
    const form = card.querySelector('.edit-form');

    if (display && form) {
      display.classList.add('hidden');
      form.classList.remove('hidden');
    }
  }

  if (e.target.classList.contains('cancel-edit')) {
    const card = e.target.closest('.task-card');
   if (!card) return;

    const form = card.querySelector('.edit-form');
    const display = card.querySelector('.task-display');

    if (form && display) {
      form.classList.add('hidden');
      display.classList.remove('hidden');
    }
  }
});

taskList.addEventListener('submit', e => {
  if (e.target.classList.contains('delete-confirm')) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this task?')) {
      const id = e.target.dataset.id;
      manager.deleteTask(id);
      renderTasks();
    }
  }
});

taskList.addEventListener('submit', e => {
  if (e.target.classList.contains('edit-form')) {
    e.preventDefault();
    const id = e.target.dataset.id;
    const content = e.target.elements['content'].value.trim();
    const username = e.target.elements['username'].value.trim();
    if (content && username) {
      manager.updateTask(id, content, username);
      renderTasks();
    }
  }
});

renderTasks();
