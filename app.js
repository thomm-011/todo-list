
const TODOS_KEY = 'todo-list-items';
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const plin = new Audio('plin.mp3');

function saveTodos(todos) {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function loadTodos() {
  return JSON.parse(localStorage.getItem(TODOS_KEY) || '[]');
}

function renderTodos() {
  list.innerHTML = '';
  const todos = loadTodos();
  todos.forEach((todo, idx) => {
    const item = createTodoItem(todo.text, todo.date, todo.time, todo.notes, todo.subtasks, todo.done, idx);
    // Aplica classe dark para estilização via CSS, sem alterar padding/borda/sombra
    if (document.body.classList.contains('dark')) {
      item.classList.add('dark');
      const subtaskInputRow = item.querySelector('.subtask-input-row');
      if (subtaskInputRow) subtaskInputRow.classList.add('dark');
    } else {
      item.classList.remove('dark');
      const subtaskInputRow = item.querySelector('.subtask-input-row');
      if (subtaskInputRow) subtaskInputRow.classList.remove('dark');
    }
    list.appendChild(item);
  });
}

function createTodoItem(text, date = '', time = '', notes = '', subtasks = [], done = false, idx = null) {
  const li = document.createElement('li');
  li.className = 'todo-list-item flex flex-col rounded-lg px-4 py-2 shadow-sm';

  const topRow = document.createElement('div');
  topRow.className = 'flex items-center';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'form-checkbox h-5 w-5 text-blue-600 mr-3';
  checkbox.checked = done;

  const span = document.createElement('span');
  span.textContent = text;
  span.className = 'flex-1 text-gray-800';
  if (done) {
    span.classList.add('line-through', 'text-gray-400');
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
  deleteBtn.className = 'ml-3';

  checkbox.addEventListener('change', () => {
    const todos = loadTodos();
    span.classList.toggle('line-through');
    span.classList.toggle('text-gray-400');
    plin.currentTime = 0;
    plin.play();
    if (idx !== null) {
      todos[idx].done = checkbox.checked;
      saveTodos(todos);
    }
  });

  deleteBtn.addEventListener('click', () => {
    if (idx !== null) {
      const todos = loadTodos();
      todos.splice(idx, 1);
      saveTodos(todos);
      renderTodos();
    } else {
      li.remove();
    }
  });

  topRow.appendChild(checkbox);
  topRow.appendChild(span);
  topRow.appendChild(deleteBtn);
  li.appendChild(topRow);

  // Data e horário
  if (date || time) {
    const dateTime = document.createElement('div');
    dateTime.className = 'subtask-input-row text-xs mt-1';
    let formattedDate = date;
    if (date && date.includes('-')) {
      const [yyyy, mm, dd] = date.split('-');
      formattedDate = `${dd}/${mm}/${yyyy}`;
    }
    let text = '';
    if (date) text += `Data: ${formattedDate}`;
    if (date && time) text += ' | ';
    if (time) text += `Horário: ${time}`;
    dateTime.textContent = text;
    li.appendChild(dateTime);
  }

  // Observações
  if (notes) {
    const notesDiv = document.createElement('div');
    notesDiv.className = 'text-xs text-gray-500 mt-1';
    notesDiv.textContent = 'Obs: ' + notes;
    li.appendChild(notesDiv);
  }

  // Subtarefas
  const subList = document.createElement('ul');
  subList.className = 'ml-6 mt-2 space-y-1';
  if (subtasks.length > 0) {
    subtasks.forEach((sub, subIdx) => {
      const subLi = document.createElement('li');
      subLi.className = 'flex items-center bg-gray-100 rounded px-2 py-1 text-sm';
      const subCheckbox = document.createElement('input');
      subCheckbox.type = 'checkbox';
      subCheckbox.className = 'form-checkbox h-4 w-4 text-blue-400 mr-2';
      subCheckbox.checked = Array.isArray(done) ? done[subIdx] : false;
      const subSpan = document.createElement('span');
      subSpan.textContent = sub;
      subSpan.className = 'flex-1';
      if (Array.isArray(done) && done[subIdx]) {
        subSpan.classList.add('line-through', 'text-gray-400');
      }
      subCheckbox.addEventListener('change', () => {
        subSpan.classList.toggle('line-through');
        subSpan.classList.toggle('text-gray-400');
        plin.currentTime = 0;
        plin.play();
        if (idx !== null) {
          const todos = loadTodos();
          if (!Array.isArray(todos[idx].done)) todos[idx].done = [];
          todos[idx].done[subIdx] = subCheckbox.checked;
          saveTodos(todos);
        }
      });
      subLi.appendChild(subCheckbox);
      subLi.appendChild(subSpan);
      subList.appendChild(subLi);
    });
  }
  // Botão para adicionar nova subtarefa
  if (idx !== null) {
    const addSubtaskRow = document.createElement('li');
    addSubtaskRow.className = 'subtask-input-row flex items-center mt-2';
    const addInput = document.createElement('input');
    addInput.type = 'text';
    addInput.placeholder = 'Adicionar subtarefa';
    addInput.className = 'flex-1 border border-blue-200 rounded px-2 py-1 text-sm focus:outline-none';
    const addBtn = document.createElement('button');
    addBtn.textContent = '+';
    addBtn.className = 'ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600';
    addBtn.onclick = () => {
      const value = addInput.value.trim();
      if (value) {
        const todos = loadTodos();
        todos[idx].subtasks.push(value);
        saveTodos(todos);
        renderTodos();
      }
    };
    addInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addBtn.click();
    });
    addSubtaskRow.appendChild(addInput);
    addSubtaskRow.appendChild(addBtn);
    subList.appendChild(addSubtaskRow);
  }
  li.appendChild(subList);

  return li;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  // Coleta dados extras
  const date = document.getElementById('todo-date')?.value || '';
  const time = document.getElementById('todo-time')?.value || '';
  const notes = document.getElementById('todo-notes')?.value || '';
  const subtasks = window.getSubtasks ? window.getSubtasks() : [];

  const todos = loadTodos();
  todos.push({ text: value, date, time, notes, subtasks, done: false });
  saveTodos(todos);
  renderTodos();

  input.value = '';
  if (document.getElementById('todo-date')) document.getElementById('todo-date').value = '';
  if (document.getElementById('todo-time')) document.getElementById('todo-time').value = '';
  if (document.getElementById('todo-notes')) document.getElementById('todo-notes').value = '';
  if (window.clearSubtasks) window.clearSubtasks();
  input.focus();
});

// Carregar tarefas ao iniciar
window.addEventListener('DOMContentLoaded', renderTodos);
// Troca de tema: garante que o body recebe theme-dark ou theme-light
function applyTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('theme-dark');
    document.body.classList.remove('theme-light');
  } else {
    document.body.classList.add('theme-light');
    document.body.classList.remove('theme-dark');
  }
}

// Detecta troca de tema
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const current = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', current);
  applyTheme();
  renderTodos();
});

// Aplica tema ao carregar
applyTheme();
