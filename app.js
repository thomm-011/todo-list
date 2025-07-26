// =================== CONSTANTES E ELEMENTOS ===================
const TODOS_KEY = 'todo-list-items';
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const notesInput = document.getElementById('todo-notes');
const subtaskInput = document.getElementById('subtask-input');
const addSubtaskBtn = document.getElementById('add-subtask');
const subtaskList = document.getElementById('subtask-list');
const reminderBtn = document.getElementById('reminder-btn');
const reminderPopup = document.getElementById('reminder-popup');
const reminderCancel = document.getElementById('reminder-cancel');
const reminderSave = document.getElementById('reminder-save');
const hiddenDate = document.getElementById('hidden-date');
const hiddenTime = document.getElementById('hidden-time');
const themeToggle = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

// Som de conclusão
const plin = new Audio('plin.mp3');

// =================== GERENCIAMENTO DE DADOS ===================
function saveTodos(todos) {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function loadTodos() {
  return JSON.parse(localStorage.getItem(TODOS_KEY) || '[]');
}

// =================== GERENCIAMENTO DE TEMA ===================
function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add('theme-dark');
    iconSun.classList.add('hidden');
    iconMoon.classList.remove('hidden');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('theme-dark');
    iconSun.classList.remove('hidden');
    iconMoon.classList.add('hidden');
    localStorage.setItem('theme', 'light');
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';
  applyTheme(isDark);
}

// Event listener para toggle de tema
themeToggle.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('theme-dark');
  applyTheme(isDark);
});

// =================== GERENCIAMENTO DE SUBTAREFAS ===================
let subtasks = [];

function renderSubtasks() {
  subtaskList.innerHTML = '';
  subtasks.forEach((sub, idx) => {
    const li = document.createElement('li');
    li.className = 'subtask-item flex items-center rounded px-2 py-1 text-sm';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-checkbox h-4 w-4 text-blue-400 mr-2';
    checkbox.disabled = true;
    
    const span = document.createElement('span');
    span.textContent = sub;
    span.className = 'flex-1';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.className = 'ml-2 text-red-500 hover:text-red-700 font-bold';
    deleteBtn.onclick = () => {
      subtasks.splice(idx, 1);
      renderSubtasks();
    };
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    subtaskList.appendChild(li);
  });
}

function addSubtask() {
  const value = subtaskInput.value.trim();
  if (value) {
    subtasks.push(value);
    subtaskInput.value = '';
    renderSubtasks();
    subtaskInput.focus();
  }
}

function clearSubtasks() {
  subtasks = [];
  renderSubtasks();
}

// Event listeners para subtarefas
addSubtaskBtn.addEventListener('click', addSubtask);
subtaskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addSubtask();
  }
});

// =================== POPUP DE LEMBRETE ===================
let selectedDate = '';
let selectedTime = '';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function formatDate(day, month, year) {
  return `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
}

function renderCalendar(container) {
  container.innerHTML = '';
  
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                     'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  // Cabeçalho do calendário
  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-3';
  
  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '‹';
  prevBtn.className = 'px-3 py-1 text-blue-600 hover:bg-blue-100 rounded font-bold';
  prevBtn.type = 'button';
  
  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = '›';
  nextBtn.className = 'px-3 py-1 text-blue-600 hover:bg-blue-100 rounded font-bold';
  nextBtn.type = 'button';
  
  const monthYear = document.createElement('span');
  monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  monthYear.className = 'font-bold text-blue-700';
  
  header.appendChild(prevBtn);
  header.appendChild(monthYear);
  header.appendChild(nextBtn);
  container.appendChild(header);

  // Tabela do calendário
  const table = document.createElement('table');
  table.className = 'w-full text-center text-sm border-collapse';
  
  // Cabeçalho dos dias da semana
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  daysOfWeek.forEach(d => {
    const th = document.createElement('th');
    th.textContent = d;
    th.className = 'text-xs text-blue-600 py-2 font-medium';
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  // Corpo do calendário
  const tbody = document.createElement('tbody');
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  let day = 1;
  
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      cell.className = 'py-2 px-2 cursor-pointer hover:bg-blue-100 rounded transition-colors';
      
      if (i === 0 && j < firstDay) {
        cell.textContent = '';
        cell.className = 'py-2 px-2';
      } else if (day > daysInMonth) {
        cell.textContent = '';
        cell.className = 'py-2 px-2';
      } else {
        cell.textContent = day;
        const currentDate = formatDate(day, currentMonth, currentYear);
        
        // Destacar dia atual
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            day === today.getDate()) {
          cell.classList.add('bg-blue-50', 'font-bold');
        }
        
        // Destacar data selecionada
        if (selectedDate === currentDate) {
          cell.classList.remove('hover:bg-blue-100');
          cell.classList.add('bg-blue-500', 'text-white', 'font-bold');
        }
        
        cell.addEventListener('click', (e) => {
          e.preventDefault();
          selectedDate = currentDate;
          updateReminderDisplay();
          renderCalendar(container); // Re-render para mostrar seleção
        });
        
        day++;
      }
      row.appendChild(cell);
    }
    tbody.appendChild(row);
    if (day > daysInMonth) break; // Não criar linhas vazias desnecessárias
  }
  table.appendChild(tbody);
  container.appendChild(table);

  // Event listeners para navegação
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(container);
  });
  
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(container);
  });
}

function renderTimeSelector(container) {
  container.innerHTML = '';
  
  // Título da seção
  const title = document.createElement('div');
  title.textContent = 'Selecionar Horário:';
  title.className = 'text-sm font-bold text-blue-700 mb-2';
  container.appendChild(title);
  
  // Container para horários predefinidos
  const quickTimes = document.createElement('div');
  quickTimes.className = 'mb-3';
  
  const quickLabel = document.createElement('div');
  quickLabel.textContent = 'Horários rápidos:';
  quickLabel.className = 'text-xs text-gray-600 mb-1';
  quickTimes.appendChild(quickLabel);
  
  const quickTimesRow = document.createElement('div');
  quickTimesRow.className = 'flex flex-wrap gap-1';
  
  const commonTimes = ['08:00', '09:00', '12:00', '14:00', '17:00', '18:00', '20:00'];
  commonTimes.forEach(time => {
    const timeBtn = document.createElement('button');
    timeBtn.textContent = time;
    timeBtn.type = 'button';
    timeBtn.className = `px-2 py-1 text-xs rounded border transition-colors ${
      selectedTime === time 
        ? 'bg-blue-500 text-white border-blue-500' 
        : 'text-blue-600 hover:bg-blue-100 border-blue-300'
    }`;
    
    timeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedTime = time;
      updateReminderDisplay();
      renderTimeSelector(container); // Re-render para mostrar seleção
    });
    
    quickTimesRow.appendChild(timeBtn);
  });
  
  quickTimes.appendChild(quickTimesRow);
  container.appendChild(quickTimes);
  
  // Seletor de hora personalizada
  const customTime = document.createElement('div');
  customTime.className = 'mb-2';
  
  const customLabel = document.createElement('div');
  customLabel.textContent = 'Horário personalizado:';
  customLabel.className = 'text-xs text-gray-600 mb-1';
  customTime.appendChild(customLabel);
  
  const timeInputs = document.createElement('div');
  timeInputs.className = 'flex items-center gap-2';
  
  // Input de hora
  const hourSelect = document.createElement('select');
  hourSelect.className = 'px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500';
  for (let h = 0; h < 24; h++) {
    const option = document.createElement('option');
    option.value = h;
    option.textContent = String(h).padStart(2, '0');
    hourSelect.appendChild(option);
  }
  
  const separator = document.createElement('span');
  separator.textContent = ':';
  separator.className = 'font-bold';
  
  // Input de minuto
  const minuteSelect = document.createElement('select');
  minuteSelect.className = 'px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500';
  for (let m = 0; m < 60; m += 15) {
    const option = document.createElement('option');
    option.value = m;
    option.textContent = String(m).padStart(2, '0');
    minuteSelect.appendChild(option);
  }
  
  const setTimeBtn = document.createElement('button');
  setTimeBtn.textContent = 'Definir';
  setTimeBtn.type = 'button';
  setTimeBtn.className = 'px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors';
  
  setTimeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const hour = String(hourSelect.value).padStart(2, '0');
    const minute = String(minuteSelect.value).padStart(2, '0');
    selectedTime = `${hour}:${minute}`;
    updateReminderDisplay();
    renderTimeSelector(container);
  });
  
  timeInputs.appendChild(hourSelect);
  timeInputs.appendChild(separator);
  timeInputs.appendChild(minuteSelect);
  timeInputs.appendChild(setTimeBtn);
  
  customTime.appendChild(timeInputs);
  container.appendChild(customTime);
  
  // Botão para limpar horário
  if (selectedTime) {
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Limpar horário';
    clearBtn.type = 'button';
    clearBtn.className = 'px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors mt-2';
    
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedTime = '';
      updateReminderDisplay();
      renderTimeSelector(container);
    });
    
    container.appendChild(clearBtn);
  }
}

function renderReminderPopup() {
  const calendarContainer = document.getElementById('reminder-calendar');
  const timeContainer = document.getElementById('reminder-time');
  
  if (calendarContainer && timeContainer) {
    renderCalendar(calendarContainer);
    renderTimeSelector(timeContainer);
  }
}

function updateReminderDisplay() {
  const parts = [];
  if (selectedDate) parts.push(`📅 ${selectedDate}`);
  if (selectedTime) parts.push(`🕐 ${selectedTime}`);
  
  if (parts.length > 0) {
    reminderBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      ${parts.join(' ')}
    `;
  } else {
    reminderBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      Lembrar-me
    `;
  }
}

// Event listeners para popup de lembrete
reminderBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  // Resetar mês/ano para o atual se não há data selecionada
  if (!selectedDate) {
    const today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
  }
  
  reminderPopup.classList.remove('hidden');
  renderReminderPopup();
});

reminderCancel.addEventListener('click', (e) => {
  e.preventDefault();
  reminderPopup.classList.add('hidden');
});

reminderSave.addEventListener('click', (e) => {
  e.preventDefault();
  hiddenDate.value = selectedDate;
  hiddenTime.value = selectedTime;
  updateReminderDisplay();
  reminderPopup.classList.add('hidden');
});

// Botão para limpar lembrete
const clearReminderBtn = document.getElementById('clear-reminder');
if (clearReminderBtn) {
  clearReminderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearReminder();
    renderReminderPopup(); // Re-render para mostrar estado limpo
  });
}

// Fechar popup ao clicar fora
document.addEventListener('click', (e) => {
  if (!reminderPopup.contains(e.target) && 
      !reminderBtn.contains(e.target) && 
      !reminderPopup.classList.contains('hidden')) {
    reminderPopup.classList.add('hidden');
  }
});

// Prevenir que cliques dentro do popup o fechem
reminderPopup.addEventListener('click', (e) => {
  e.stopPropagation();
});

// =================== GERENCIAMENTO DE TODOS ===================
function createTodoItem(todo, idx) {
  const li = document.createElement('li');
  li.className = 'todo-list-item flex flex-col rounded-lg px-4 py-3 shadow-sm border';

  // Linha principal da tarefa
  const topRow = document.createElement('div');
  topRow.className = 'flex items-center';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'form-checkbox h-5 w-5 text-blue-600 mr-3';
  checkbox.checked = todo.done;

  const span = document.createElement('span');
  span.textContent = todo.text;
  span.className = 'flex-1 text-gray-800';
  if (todo.done) {
    span.classList.add('line-through', 'text-gray-400');
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '×';
  deleteBtn.className = 'ml-3 text-red-500 hover:text-red-700 font-bold text-xl';

  // Event listeners
  checkbox.addEventListener('change', () => {
    const todos = loadTodos();
    todos[idx].done = checkbox.checked;
    saveTodos(todos);
    
    span.classList.toggle('line-through');
    span.classList.toggle('text-gray-400');
    
    if (checkbox.checked) {
      plin.currentTime = 0;
      plin.play().catch(() => {}); // Ignora erro se não conseguir tocar
    }
  });

  deleteBtn.addEventListener('click', () => {
    const todos = loadTodos();
    todos.splice(idx, 1);
    saveTodos(todos);
    renderTodos();
  });

  topRow.appendChild(checkbox);
  topRow.appendChild(span);
  topRow.appendChild(deleteBtn);
  li.appendChild(topRow);

  // Data e horário
  if (todo.date || todo.time) {
    const dateTimeDiv = document.createElement('div');
    dateTimeDiv.className = 'text-xs text-gray-500 mt-2';
    
    let dateTimeText = '';
    if (todo.date) dateTimeText += `📅 ${todo.date}`;
    if (todo.date && todo.time) dateTimeText += ' ';
    if (todo.time) dateTimeText += `🕐 ${todo.time}`;
    
    dateTimeDiv.textContent = dateTimeText;
    li.appendChild(dateTimeDiv);
  }

  // Observações
  if (todo.notes) {
    const notesDiv = document.createElement('div');
    notesDiv.className = 'text-xs text-gray-500 mt-1';
    notesDiv.textContent = `📝 ${todo.notes}`;
    li.appendChild(notesDiv);
  }

  // Container para subtarefas
  const subtaskContainer = document.createElement('div');
  subtaskContainer.className = 'subtask-container ml-6 mt-2';

  // Subtarefas existentes
  if (todo.subtasks && todo.subtasks.length > 0) {
    const subList = document.createElement('ul');
    subList.className = 'space-y-1 mb-2';
    
    todo.subtasks.forEach((sub, subIdx) => {
      const subLi = document.createElement('li');
      subLi.className = 'subtask-item flex items-center rounded px-2 py-1 text-sm';
      
      const subCheckbox = document.createElement('input');
      subCheckbox.type = 'checkbox';
      subCheckbox.className = 'form-checkbox h-4 w-4 text-blue-400 mr-2';
      subCheckbox.checked = Array.isArray(todo.subtasksDone) ? todo.subtasksDone[subIdx] : false;
      
      const subSpan = document.createElement('span');
      subSpan.textContent = sub;
      subSpan.className = 'flex-1';
      
      // Botão para deletar subtarefa
      const deleteSubBtn = document.createElement('button');
      deleteSubBtn.innerHTML = '×';
      deleteSubBtn.className = 'delete-subtask-btn ml-2 text-red-400 hover:text-red-600 text-sm font-bold';
      deleteSubBtn.type = 'button';
      
      if (subCheckbox.checked) {
        subSpan.classList.add('line-through', 'text-gray-400');
      }
      
      subCheckbox.addEventListener('change', () => {
        const todos = loadTodos();
        if (!Array.isArray(todos[idx].subtasksDone)) {
          todos[idx].subtasksDone = [];
        }
        todos[idx].subtasksDone[subIdx] = subCheckbox.checked;
        saveTodos(todos);
        
        subSpan.classList.toggle('line-through');
        subSpan.classList.toggle('text-gray-400');
        
        if (subCheckbox.checked) {
          plin.currentTime = 0;
          plin.play().catch(() => {});
        }
      });

      // Event listener para deletar subtarefa
      deleteSubBtn.addEventListener('click', () => {
        const todos = loadTodos();
        todos[idx].subtasks.splice(subIdx, 1);
        if (todos[idx].subtasksDone) {
          todos[idx].subtasksDone.splice(subIdx, 1);
        }
        saveTodos(todos);
        renderTodos();
      });
      
      subLi.appendChild(subCheckbox);
      subLi.appendChild(subSpan);
      subLi.appendChild(deleteSubBtn);
      subList.appendChild(subLi);
    });
    
    subtaskContainer.appendChild(subList);
  }

  // Campo para adicionar nova subtarefa
  const addSubtaskRow = document.createElement('div');
  addSubtaskRow.className = 'flex items-center gap-2 mt-1';
  
  const addSubtaskInput = document.createElement('input');
  addSubtaskInput.type = 'text';
  addSubtaskInput.placeholder = 'Adicionar subtarefa...';
  addSubtaskInput.className = 'flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  
  const addSubtaskBtn = document.createElement('button');
  addSubtaskBtn.innerHTML = '+';
  addSubtaskBtn.type = 'button';
  addSubtaskBtn.className = 'bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors text-sm font-bold';
  
  // Event listener para adicionar subtarefa
  const addNewSubtask = () => {
    const value = addSubtaskInput.value.trim();
    if (value) {
      const todos = loadTodos();
      if (!todos[idx].subtasks) {
        todos[idx].subtasks = [];
      }
      if (!todos[idx].subtasksDone) {
        todos[idx].subtasksDone = [];
      }
      
      todos[idx].subtasks.push(value);
      todos[idx].subtasksDone.push(false);
      saveTodos(todos);
      
      addSubtaskInput.value = '';
      renderTodos();
    }
  };
  
  addSubtaskBtn.addEventListener('click', addNewSubtask);
  
  addSubtaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewSubtask();
    }
  });
  
  addSubtaskRow.appendChild(addSubtaskInput);
  addSubtaskRow.appendChild(addSubtaskBtn);
  subtaskContainer.appendChild(addSubtaskRow);
  
  li.appendChild(subtaskContainer);

  return li;
}

function renderTodos() {
  list.innerHTML = '';
  const todos = loadTodos();
  
  todos.forEach((todo, idx) => {
    const item = createTodoItem(todo, idx);
    list.appendChild(item);
  });
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  const todo = {
    text: text,
    date: hiddenDate.value,
    time: hiddenTime.value,
    notes: notesInput.value.trim(),
    subtasks: [...subtasks],
    done: false,
    subtasksDone: []
  };

  const todos = loadTodos();
  todos.push(todo);
  saveTodos(todos);
  
  // Limpar formulário completamente
  input.value = '';
  notesInput.value = '';
  hiddenDate.value = '';
  hiddenTime.value = '';
  selectedDate = '';
  selectedTime = '';
  clearSubtasks();
  updateReminderDisplay();
  
  renderTodos();
  input.focus();
}

// Função para limpar lembrete
function clearReminder() {
  selectedDate = '';
  selectedTime = '';
  hiddenDate.value = '';
  hiddenTime.value = '';
  updateReminderDisplay();
}

// Event listener para formulário
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo();
});

// =================== INICIALIZAÇÃO ===================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderTodos();
  input.focus();
});
