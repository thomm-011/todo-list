
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
  checkbox.className = 'form-checkbox h-5 w-5 text-blue-600 mr-3'; // tamanho padrão restaurado
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
    if (checkbox.checked) {
      plin.currentTime = 0;
      plin.play();
    }
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
    let formattedDate = '';
    if (date) {
      let d = date.split('T')[0];
      const parts = d.split('-');
      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        formattedDate = `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
      } else {
        formattedDate = '';
      }
    }
    let formattedTime = '';
    if (time) {
      let t = time.split(':');
      if (t.length >= 2 && t[0] && t[1]) {
        formattedTime = `${t[0].padStart(2, '0')}:${t[1].padStart(2, '0')}`;
      } else {
        formattedTime = '';
      }
    }
    let text = '';
    if (formattedDate) text += `Data: ${formattedDate}`;
    if (formattedDate && formattedTime) text += ' | ';
    if (formattedTime) text += `Horário: ${formattedTime}`;
    if (text) {
      dateTime.textContent = text;
      li.appendChild(dateTime);
    }
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
        if (subCheckbox.checked) {
          plin.currentTime = 0;
          plin.play();
        }
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
// --- NOVA LÓGICA PARA POPUP UNIFICADO DE DATA/HORA ---
const reminderBtn = document.getElementById('reminder-btn');
const reminderPopup = document.getElementById('reminder-popup');
let selectedDate = '';
let selectedTime = '';

function renderUnifiedPopup() {
  reminderPopup.innerHTML = '';
  // Cabeçalho
  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-2';
  header.innerHTML = '<span class="font-bold text-blue-700">Selecione data e horário</span>';
  reminderPopup.appendChild(header);

  // Calendário
  const calendarDiv = document.createElement('div');
  calendarDiv.className = 'mb-2';
  renderCalendarUnified(calendarDiv);
  reminderPopup.appendChild(calendarDiv);

  // Horário
  const timeDiv = document.createElement('div');
  timeDiv.className = 'mb-2';
  renderTimeSelectorUnified(timeDiv);
  reminderPopup.appendChild(timeDiv);

  // Botão salvar
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Salvar';
  saveBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full';
  saveBtn.onclick = () => {
    // Preenche campos ocultos para o submit
    document.getElementById('hidden-date').value = selectedDate;
    document.getElementById('hidden-time').value = selectedTime;
    reminderPopup.classList.add('hidden');
    reminderBtn.textContent = (selectedDate || selectedTime) ? `Lembrar-me: ${selectedDate}${selectedDate && selectedTime ? ' ' : ''}${selectedTime}` : 'Lembrar-me';
  };
  reminderPopup.appendChild(saveBtn);
}

function renderCalendarUnified(container) {
  container.innerHTML = '';
  const today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  if (selectedDate) {
    const parts = selectedDate.split('/');
    if (parts.length === 3) {
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
    }
  }
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-1';
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '<';
  prevBtn.className = 'px-2 py-1 text-blue-600 hover:bg-blue-100 rounded';
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '>';
  nextBtn.className = 'px-2 py-1 text-blue-600 hover:bg-blue-100 rounded';
  const monthYear = document.createElement('span');
  monthYear.textContent = `${month + 1}/${year}`;
  monthYear.className = 'font-bold text-blue-700';
  header.appendChild(prevBtn);
  header.appendChild(monthYear);
  header.appendChild(nextBtn);
  container.appendChild(header);

  const table = document.createElement('table');
  table.className = 'w-full text-center';
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  daysOfWeek.forEach(d => {
    const th = document.createElement('th');
    th.textContent = d;
    th.className = 'text-xs text-blue-600 py-1';
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let day = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      cell.className = 'py-1 px-2 cursor-pointer hover:bg-blue-100 rounded';
      if (i === 0 && j < firstDay) {
        cell.textContent = '';
      } else if (day > daysInMonth) {
        cell.textContent = '';
      } else {
        cell.textContent = day;
        cell.addEventListener('click', () => {
          selectedDate = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
          renderUnifiedPopup();
        });
        if (selectedDate === `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`) {
          cell.classList.add('bg-blue-200');
        }
        day++;
      }
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  container.appendChild(table);

  prevBtn.onclick = () => {
    let m = month - 1;
    let y = year;
    if (m < 0) { m = 11; y--; }
    month = m; year = y;
    renderCalendarUnified(container);
  };
  nextBtn.onclick = () => {
    let m = month + 1;
    let y = year;
    if (m > 11) { m = 0; y++; }
    month = m; year = y;
    renderCalendarUnified(container);
  };
}

function renderTimeSelectorUnified(container) {
  container.innerHTML = '';
  const hoursRow = document.createElement('div');
  hoursRow.className = 'flex flex-wrap gap-1 mb-2';
  for (let h = 0; h < 24; h++) {
    const hourBtn = document.createElement('button');
    hourBtn.textContent = String(h).padStart(2, '0');
    hourBtn.className = 'px-2 py-1 text-blue-600 hover:bg-blue-100 rounded';
    hourBtn.onclick = () => {
      renderMinuteSelectorUnified(container, h);
    };
    hoursRow.appendChild(hourBtn);
  }
  container.appendChild(hoursRow);
}

function renderMinuteSelectorUnified(container, hour) {
  container.innerHTML = '';
  const minutesRow = document.createElement('div');
  minutesRow.className = 'flex flex-wrap gap-1 mb-2';
  for (let m = 0; m < 60; m += 5) {
    const minBtn = document.createElement('button');
    minBtn.textContent = `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    minBtn.className = 'px-2 py-1 text-blue-600 hover:bg-blue-100 rounded';
    minBtn.onclick = () => {
      selectedTime = minBtn.textContent;
      renderUnifiedPopup();
    };
    minutesRow.appendChild(minBtn);
  }
  container.appendChild(minutesRow);
  const backBtn = document.createElement('button');
  backBtn.textContent = 'Voltar';
  backBtn.className = 'px-2 py-1 text-gray-600 hover:bg-gray-100 rounded';
  backBtn.onclick = () => renderTimeSelectorUnified(container);
  container.appendChild(backBtn);
}

reminderBtn.addEventListener('click', () => {
  reminderPopup.classList.remove('hidden');
  renderUnifiedPopup();
});

// Fecha popup ao clicar fora
document.addEventListener('mousedown', (e) => {
  if (!reminderPopup.contains(e.target) && e.target !== reminderBtn) {
    reminderPopup.classList.add('hidden');
  }
});
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
