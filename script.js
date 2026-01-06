const DATA_URL =
  'https://script.google.com/macros/s/AKfycbz83xpHoo_TdXnXO-0y8FftUoZGLmPTs--JFmCMXmdIwqjD8r_HSpIrIQ3lTfuVm5Ty/exec';

const PLACEHOLDER_IMAGE = 'assets/goals/placeholder.png';

let allGoals = [];
let activeCategory = 'All';

/* ---------- INIT ---------- */

fetch(DATA_URL)
  .then(res => res.json())
  .then(data => {
    allGoals = data;
    buildCategoryTabs();
    renderGoals();
  });

/* ---------- CATEGORY TABS ---------- */

function buildCategoryTabs() {
  const categories = ['All', ...new Set(allGoals.map(g => g.category))];
  const container = document.getElementById('category-tabs');
  container.innerHTML = '';

  categories.forEach(cat => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (cat === 'All' ? ' active' : '');
    tab.textContent = cat;

    tab.onclick = () => {
      activeCategory = cat;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderGoals();
    };

    container.appendChild(tab);
  });
}

/* ---------- RENDER ---------- */

function renderGoals() {
  const container = document.getElementById('goals-container');
  container.innerHTML = '';

  const filtered =
    activeCategory === 'All'
      ? allGoals
      : allGoals.filter(g => g.category === activeCategory);

  filtered.forEach(goal => {
    container.appendChild(createGoal(goal));
  });
}

/* ---------- GOAL CARD ---------- */

function createGoal(goal) {
  const wrapper = document.createElement('div');
  wrapper.className = 'goal';

  const img = document.createElement('img');
  img.src = goal.image
    ? `assets/goals/${goal.image}`
    : PLACEHOLDER_IMAGE;
  img.onerror = () => (img.src = PLACEHOLDER_IMAGE);

  const text = document.createElement('div');

  const title = document.createElement('div');
  title.className = 'goal-title';
  title.textContent = goal.goal;

  const meta = document.createElement('div');
  meta.className = 'goal-meta';
  meta.innerHTML = `
    <span>🏷️ ${goal.category}</span>
    <span>🎁 ${goal.reward}</span>
  `;

  const countdown = document.createElement('div');
  countdown.className = 'countdown';
  countdown.textContent = getDaysLeft(goal.deadline);

  const status = document.createElement('div');
  status.className = 'status';
  status.textContent = goal.status;

  text.append(title, meta, countdown, status);
  wrapper.append(img, text);

  return wrapper;
}

/* ---------- TIME LOGIC ---------- */

function getDaysLeft(deadline) {
  const start = new Date('2026-01-01');
  const end = new Date(deadline);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (diff < 0) return `Overdue by ${Math.abs(diff)} days`;
  return `${diff} days left`;
}
