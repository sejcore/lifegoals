// ==============================
// CONFIG
// ==============================
const DATA_URL = 'https://script.google.com/macros/s/AKfycbz83xpHoo_TdXnXO-0y8FftUoZGLmPTs--JFmCMXmdIwqjD8r_HSpIrIQ3lTfuVm5Ty/exec';
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
  .then(res => res.json())
  .then(data => {
    goals = data;
    renderGoals();
  })
  .catch(err => {
    console.error('Failed to load goals:', err);
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

  const sorted = sortGoals(goals);

  sorted.forEach(goal => {
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

  // Completed goals always go to bottom
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

  // Completed styling
  if (goal.status === 'COMPLETED') {
    wrapper.classList.add('completed');
  }

  // Momentum highlight (updated within last 7 days)
  if (goal.lastupdated) {
    const updated = new Date(goal.lastupdated);
    const now = new Date();
    const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) {
      wrapper.classList.add('recent');
    }
  }

  // ==============================
  // IMAGE
  // ==============================
  const img = document.createElement('img');
  img.src = goal.image
    ? `assets/goals/${goal.image}`
    : PLACEHOLDER_IMAGE;
  img.alt = goal.goal;

  img.onerror = () => {
    img.src = PLACEHOLDER_IMAGE;
  };

  // ==============================
  // TEXT / MEANING
  // ==============================
  const text = document.createElement('div');

  const title = document.createElement('div');
  title.className = 'goal-title';
  title.textContent = goal.goal;

  const meta = document.createElement('div');
  meta.className = 'goal-meta';
  meta.textContent = `${goal.category} · ${goal.reward}`;

  text.appendChild(title);
  text.appendChild(meta);

  // ==============================
  // DEADLINE (placeholder for now)
  // ==============================
  const countdown = document.createElement('div');
  countdown.className = 'countdown';
  countdown.textContent = goal.deadline
    ? `Deadline: ${goal.deadline}`
    : '';

  // ==============================
  // STATUS
  // ==============================
  const status = document.createElement('div');
  status.className = 'status';
  status.textContent = goal.status;

  // ==============================
  // ASSEMBLE
  // ==============================
  wrapper.appendChild(img);
  wrapper.appendChild(text);
  wrapper.appendChild(countdown);
  wrapper.appendChild(status);

  return wrapper;
}
