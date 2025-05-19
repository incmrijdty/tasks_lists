class Task {
  constructor(id, content, username, difficulty, category, status = 'pending', createdAt = new Date()) {
    this.id = id;
    this.content = content;
    this.username = username;
    this.difficulty = difficulty;
    this.category = category;
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
      t => new Task(t.id, t.content, t.username, t.difficulty, t.category, t.status, new Date(t.createdAt))
    );
  }

  save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(content, username, difficulty, category) {
    const id = Date.now().toString();
    const task = new Task(id, content, username, difficulty, category);
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

  updateTask(id, content, username, difficulty, category) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.content = content;
      task.username = username;
      task.difficulty = difficulty;
      task.category = category;
      this.save();
    }
  }
}


const manager = new TaskManager();
const taskList = document.getElementById('taskList');
const form = document.getElementById('taskForm');
const input = document.getElementById('taskContent');
const userInput = document.getElementById('username');
const categoryInput = document.getElementById('category');
const difficultyInput = document.getElementById('difficulty');
const clearFilters = document.getElementById('clearFilters');
const sortDate = document.getElementById('sortDate');

function getCurrentFilters() {
  return {
    status: document.getElementById('filterStatus').value,
    category: document.getElementById('filterCategory').value,
    difficulty: document.getElementById('filterDifficulty').value,
    username: document.getElementById('filterUsername').value.trim().toLowerCase()
  };
}

function renderTasks() {
  const filters = getCurrentFilters();
  const sortOrder = document.getElementById('sortDate').value;
  taskList.innerHTML = '';
  manager.getAll()
    .filter(task => {
      return (
        (!filters.status || task.status === filters.status) &&
        (!filters.category || task.category === filters.category) &&
        (!filters.difficulty || task.difficulty === filters.difficulty) &&
        (!filters.username || task.username.toLowerCase().includes(filters.username))
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    })
    .forEach(task => {
      const div = document.createElement('div');
      div.innerHTML = `
        <div class="task-card">
          <div class="task-display">
            <p><strong>ID:</strong> ${task.id}</p>
            <p><strong>Content:</strong> ${task.content}</p>
            <p><strong>User:</strong> ${task.username}</p>
            <p><strong>Category:</strong> ${task.category}</p>
            <p><strong>Difficulty:</strong> ${task.difficulty}</p>
            <p><strong>Status:</strong> <em>${task.status}</em></p>
          </div>
          <div class="buttons">
            <button data-id="${task.id}" class="toggle">Mark as done/pending</button>
            <form data-id="${task.id}" class="delete-confirm">
              <button type="submit">Delete</button>
            </form>
            <button data-id="${task.id}" class="edit">Edit</button>
          </div>
          <form class="edit-form hidden" data-id="${task.id}">
            <input type="text" name="content" value="${task.content}" required />
            <input type="text" name="username" value="${task.username}" required />
            <select name="category" required>
              <option value="praca" ${task.category === 'praca' ? 'selected' : ''}>Praca</option>
              <option value="nauka" ${task.category === 'nauka' ? 'selected' : ''}>Nauka</option>
              <option value="hobby" ${task.category === 'hobby' ? 'selected' : ''}>Hobby</option>
              <option value="dom" ${task.category === 'dom' ? 'selected' : ''}>Dom</option>
            </select>

            <select name="difficulty" required>
              <option value="low" ${task.difficulty === 'low' ? 'selected' : ''}>Low</option>
              <option value="medium" ${task.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="hard" ${task.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
            </select>
            <button type="submit">Save</button>
            <button type="button" class="cancel-edit">Cancel</button>
          </form>
        </div>
      `;
      taskList.appendChild(div);
    });
}

function resetFilters() {
  ['filterStatus', 'filterCategory', 'filterDifficulty', 'filterUsername'].forEach(
    id => document.getElementById(id).value = ''
  );
}

form.addEventListener('submit', e => {
  e.preventDefault();
  manager.addTask(input.value, userInput.value, difficultyInput.value, categoryInput.value);
  input.value = '';
  userInput.value = '';
  categoryInput.value = '';
  difficultyInput.value = '';
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
    const category = e.target.elements['category'].value;
    const difficulty = e.target.elements['difficulty'].value;
    if (content && username && category && difficulty) {
      manager.updateTask(id, content, username, difficulty, category);
      renderTasks();
    }
  }
});


['filterStatus', 'filterCategory', 'filterDifficulty'].forEach(id => {
  document.getElementById(id).addEventListener('change', renderTasks);
});

document.getElementById('filterUsername').addEventListener('input', renderTasks);


clearFilters.addEventListener('click', () => {
  resetFilters();
  renderTasks();
});

sortDate.addEventListener('change', renderTasks);

renderTasks();
