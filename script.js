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
  .then(res => res.text())
  .then(text => {
    console.log('Raw response:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      showError('Data is not valid JSON. Check Apps Script access.');
      throw e;
    }

    if (!Array.isArray(data) || data.length === 0) {
      showError('No goals returned from Google Sheets.');
      return;
    }

    goals = data;
    renderGoals();
  })
  .catch(err => {
    console.error(err);
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
    copy.sort((a,
