// ==============================
// CONFIG
// ==============================
const DATA_URL =
  'https://script.google.com/macros/s/AKfycbz83xpHoo_TdXnXO-0y8FftUoZGLmPTs--JFmCMXmdIwqjD8r_HSpIrIQ3lTfuVm5Ty/exec';

const PLACEHOLDER_IMAGE = 'assets/goals/placeholder.png';

// ==============================
// STATE
// ==============================
let goals = [];
let currentSort = 'category';

// ==============================
// INIT
// ==============================
fetch(DATA_URL)
  .then(res => res.text())
  .then(text => {
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      showError('Invalid data response.');
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      showError('No goals found.');
      return;
    }

    goals = data;
    renderGoals();
  })
  .catch(() => {
    showError('Failed to load goals.');
  });

document.querySelectorAll('#sort-controls button').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    renderGoals();
  });
});

// ==============================
// RENDER
// ==============================
function renderGoals() {
  const container = document.getElementById('goals-container');
  container.innerHTML = '';

  sortGoals(goals).forEach(goal => {
    container.appendChild(createGoalElement(goal));
  });
}

// ==============================
// SORTING
// ==============================
function sortGoals(list) {
  const copy = [...list];

  if (currentSort === 'deadline') {
    copy.sort((a, b) => a.deadline.localeCompare(b.deadline));
  } else if (currentSort === 'reward') {
    copy.sort((a, b) => a.reward.localeCompare(b.reward));
  } else {
    copy.sort((a, b) => a.category.localeCompare(b.category));
  }

  return copy.sort(
    (a, b) => (a.status === 'COMPLETED') - (b.status === 'COMPLETED')
  );
}

// ==============================
// GOAL ELEMENT
// ==============================
function createGoalElement(goal) {
  const wrapper = document.createElement('div');
  wrapper.className = 'goal';

  if (goal.status === 'COMPLETED') {
    wrapper.classList.add('completed');
  }

  if (goal.lastupdated) {
    const updated = new Date(goal.lastupdated);
    const diffDays =
      (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) {
      wrapper.classList.add('recent');
    }
  }

  // Image
  const img = document.createElement('img');
  img.src = goal.image
    ? `assets/goals/${goal.image}`
    : PLACEHOLDER_IMAGE;

  img.onerror = () => {
    img.src = PLACEHOLDER_IMAGE;
  };

  // Text
  const text = document.createElement('div');

  const title = document.createElement('div');
  title.className = 'goal-title';
  title.textContent = goal.goal;

  const meta = document.createElement('div');
  meta.className = 'goal-meta';
  meta.textContent = `${goal.category} · ${goal.reward}`;

  text.append(title, meta);

  // Deadline
  const countdown = document.createElement('div');
  countdown.className = 'countdown';
  countdown.textContent = `Deadline: ${goal.deadline}`;

  // Status
  const status = document.createElement('div');
  status.className = 'status';
  status.textContent = goal.status;

  wrapper.append(img, text, countdown, status);
  return wrapper;
}

// ==============================
// ERROR
// ==============================
function showError(msg) {
  document.getElementById('goals-container').innerHTML =
    `<div style="color:#888;">${msg}</div>`;
}
