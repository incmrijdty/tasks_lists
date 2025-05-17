import { TaskManager } from "./modules/TaskManager.js";

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
      <strong>${task.content}, ${task.id}</strong> (User: ${task.username}) - Status: <em>${task.status}</em>
      <button data-id="${task.id}" class="toggle">Mark as done/pending</button>
      <button data-id="${task.id}" class="delete">Delete</button>
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
