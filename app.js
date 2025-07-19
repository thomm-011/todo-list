
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
// Corrige campo de data para exibir e salvar no formato brasileiro
const dateInput = document.getElementById('todo-date');
const calendarPopup = document.getElementById('calendar-popup');
let selectedDate = '';

function renderCalendar(month, year) {
  calendarPopup.innerHTML = '';
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-2';
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
  calendarPopup.appendChild(header);

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
          dateInput.value = selectedDate;
          calendarPopup.classList.add('hidden');
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
  calendarPopup.appendChild(table);

  prevBtn.onclick = () => {
    let m = month - 1;
    let y = year;
    if (m < 0) { m = 11; y--; }
    renderCalendar(m, y);
  };
  nextBtn.onclick = () => {
    let m = month + 1;
    let y = year;
    if (m > 11) { m = 0; y++; }
    renderCalendar(m, y);
  };
}

dateInput.addEventListener('focus', () => {
  const today = selectedDate ? new Date(selectedDate.split('/').reverse().join('-')) : new Date();
  renderCalendar(today.getMonth(), today.getFullYear());
  calendarPopup.classList.remove('hidden');
});
dateInput.addEventListener('blur', () => {
  setTimeout(() => calendarPopup.classList.add('hidden'), 200);
});

// Corrige campo de hora para popup customizado
const timeInput = document.getElementById('todo-time');
const timePopup = document.getElementById('time-popup');
let selectedTime = '';

function renderTimeSelector() {
  timePopup.innerHTML = '';
  const hoursRow = document.createElement('div');
  hoursRow.className = 'flex flex-wrap gap-1 mb-2';
  for (let h = 0; h < 24; h++) {
    const hourBtn = document.createElement('button');
    hourBtn.textContent = String(h).padStart(2, '0');
    hourBtn.className = 'px-2 py-1 text-blue-600 hover:bg-blue-100 rounded';
    hourBtn.onclick = () => {
      renderMinuteSelector(h);
    };
    hoursRow.appendChild(hourBtn);
  }
  timePopup.appendChild(hoursRow);
}

function renderMinuteSelector(hour) {
  timePopup.innerHTML = '';
  const minutesRow = document.createElement('div');
  minutesRow.className = 'flex flex-wrap gap-1 mb-2';
  for (let m = 0; m < 60; m += 5) {
    const minBtn = document.createElement('button');
    minBtn.textContent = `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    minBtn.className = 'px-2 py-1 text-blue-600 hover:bg-blue-100 rounded';
    minBtn.onclick = () => {
      selectedTime = minBtn.textContent;
      timeInput.value = selectedTime;
      timePopup.classList.add('hidden');
    };
    minutesRow.appendChild(minBtn);
  }
  timePopup.appendChild(minutesRow);
  const backBtn = document.createElement('button');
  backBtn.textContent = 'Voltar';
  backBtn.className = 'px-2 py-1 text-gray-600 hover:bg-gray-100 rounded';
  backBtn.onclick = () => renderTimeSelector();
  timePopup.appendChild(backBtn);
}

timeInput.addEventListener('focus', () => {
  renderTimeSelector();
  timePopup.classList.remove('hidden');
});
timeInput.addEventListener('blur', () => {
  setTimeout(() => timePopup.classList.add('hidden'), 200);
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
