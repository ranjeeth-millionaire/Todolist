(() => {
  const input      = document.getElementById('taskInput');
  const addBtn     = document.getElementById('addBtn');
  const taskList   = document.getElementById('taskList');
  const taskCount  = document.getElementById('taskCount');
  const footer     = document.getElementById('footer');
  const remaining  = document.getElementById('remaining');
  const clearBtn   = document.getElementById('clearCompleted');

  let tasks = JSON.parse(localStorage.getItem('doit-tasks') || '[]');

  /* ── Render ── */
  function render() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      taskList.innerHTML = `
        <li class="empty-state">
          <span class="emoji">✦</span>
          <p>Nothing on the list yet.<br>Add something above.</p>
        </li>`;
    } else {
      tasks.forEach((task, i) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.done ? ' done' : '');
        li.dataset.index = i;
        li.innerHTML = `
          <button class="check-btn" aria-label="Toggle complete" data-action="toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
          <span class="task-text">${escapeHtml(task.text)}</span>
          <button class="delete-btn" aria-label="Delete task" data-action="delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>`;
        taskList.appendChild(li);
      });
    }

    /* counts */
    const total  = tasks.length;
    const doneN  = tasks.filter(t => t.done).length;
    const leftN  = total - doneN;

    taskCount.textContent = total === 0 ? '0 tasks'
      : total === 1 ? '1 task' : `${total} tasks`;

    if (total > 0) {
      footer.classList.remove('hidden');
      remaining.textContent = leftN === 0 ? 'All done 🎉'
        : leftN === 1 ? '1 left' : `${leftN} left`;
    } else {
      footer.classList.add('hidden');
    }

    save();
  }

  /* ── Add ── */
  function addTask() {
    const text = input.value.trim();
    if (!text) { input.focus(); shake(input); return; }
    tasks.unshift({ text, done: false });
    input.value = '';
    input.focus();
    render();
  }

  /* ── Delegation ── */
  taskList.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const li  = btn.closest('.task-item');
    const idx = parseInt(li.dataset.index);

    if (btn.dataset.action === 'toggle') {
      tasks[idx].done = !tasks[idx].done;
    } else if (btn.dataset.action === 'delete') {
      li.style.transition = 'opacity .15s, transform .15s';
      li.style.opacity = '0';
      li.style.transform = 'translateX(12px)';
      setTimeout(() => { tasks.splice(idx, 1); render(); }, 150);
      return;
    }
    render();
  });

  /* ── Clear completed ── */
  clearBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.done);
    render();
  });

  /* ── Events ── */
  addBtn.addEventListener('click', addTask);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

  /* ── Helpers ── */
  function save() {
    localStorage.setItem('doit-tasks', JSON.stringify(tasks));
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function shake(el) {
    el.style.animation = 'none';
    el.style.borderColor = 'var(--accent)';
    el.style.boxShadow = '0 0 0 3px var(--accent-light)';
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }, 600);
  }

  /* ── Init ── */
  render();
})();
