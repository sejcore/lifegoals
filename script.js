const DATA_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';

let goals = [];
let currentSort = 'category';

fetch(DATA_URL)
  .then(res => res.json())
  .then(data => {
    goals = data;
    renderGoals();
  });

document.querySelectorAll('#sort-controls button').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    renderGoals();
  });
});

function renderGoals() {
  const container = document.getElementById('goals-container');
  container.innerHTML = '';

  const sorted = sortGoals(goals);

  sorted.forEach(goal => {
    container.appendChild(createGoalElement(goal));
  });
}

function sortGoals(list) {
  const copy = [...list];

  if (currentSort === 'deadline') {
    copy.sort((a, b) => a.deadline.localeCompare(b.deadline));
  } else if (currentSort === 'reward') {
    copy.sort((a, b) => a.reward.localeCompare(b.reward));
  } else {
    copy.sort((a, b) => a.category.localeCompare(b.category));
  }

  // completed goals always at bottom
  return copy.sort((a, b) =>
    (a.status === 'COMPLETED') - (b.status === 'COMPLETED')
  );
}
