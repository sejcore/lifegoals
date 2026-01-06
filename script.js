const DATA_URL =
  'https://script.google.com/macros/s/AKfycbz83xpHoo_TdXnXO-0y8FftUoZGLmPTs--JFmCMXmdIwqjD8r_HSpIrIQ3lTfuVm5Ty/exec';

const PLACEHOLDER_IMAGE = 'assets/goals/placeholder.png';

let allGoals = [];
let activeCategory = 'All';

/* ---------- QUOTES ---------- */

const QUOTES = [
  "Wealth is built quietly while others are distracted.",
  "Discipline is the currency that buys freedom.",
  "Power comes from patience, not urgency.",
  "Long-term thinking is a competitive advantage.",
  "What you build daily decides what you own permanently.",
  "Most people overestimate a year and underestimate a decade.",
  "Wealth grows where attention is disciplined.",
  "Consistency is more intimidating than talent.",
  "Your future obeys your habits, not your wishes.",
  "Ambition without structure is just noise.",
  "Those who delay pleasure command their future.",
  "Money follows systems, not emotions.",
  "The quiet grind outperforms the loud sprint.",
  "Freedom is rented daily with discipline.",
  "Every shortcut mortgages tomorrow.",
  "Power belongs to those who can wait.",
  "Your standards determine your ceiling.",
  "Focus is the rarest form of wealth.",
  "You don’t rise to goals, you fall to systems.",
  "Time rewards patience more than effort.",
  "What compounds is what you repeat.",
  "Delayed gratification is invisible strength.",
  "Wealth is a byproduct of restraint.",
  "Consistency makes talent irrelevant.",
  "Small advantages compound into dominance.",
  "Self-control is leverage.",
  "Most success is boring by design.",
  "Urgency is the enemy of mastery.",
  "The disciplined outlast the gifted.",
  "Your calendar reveals your priorities.",
  "Power grows where impulse is controlled.",
  "Build assets, not appearances.",
  "Momentum favors the prepared.",
  "The future belongs to planners.",
  "Restraint today creates options tomorrow.",
  "Wealth is built between decisions.",
  "What you ignore is as important as what you chase.",
  "Discipline is silent confidence.",
  "Mastery prefers patience.",
  "Comfort is expensive.",
  "Structure creates freedom.",
  "Focus multiplies effort.",
  "Delayed rewards build permanent advantages.",
  "Power is earned quietly.",
  "Repetition creates inevitability.",
  "Boring habits build extraordinary outcomes.",
  "Freedom is a long game.",
  "Control your inputs, outputs will follow.",
  "The long view wins.",
  "Stability precedes growth.",
  "Wealth respects order.",
  "Your edge is consistency.",
  "Patience is strategic.",
  "Discipline compounds faster than luck.",
  "Leverage comes from preparation.",
  "The future rewards restraint.",
  "Success is scheduled.",
  "Long-term thinkers inherit volatility.",
  "Quiet focus beats loud ambition.",
  "Systems outperform motivation.",
  "Power grows where habits align.",
  "Control precedes expansion.",
  "Time favors the disciplined.",
  "Momentum is manufactured.",
  "Delay is often strategy.",
  "Consistency creates inevitability.",
  "Wealth is the reward for patience.",
  "Focus is ownership of time.",
  "The long road is less crowded.",
  "Power compounds silently.",
  "Restraint creates leverage.",
  "Predictable habits produce rare results.",
  "Structure outperforms inspiration.",
  "The future obeys discipline.",
  "Small wins accumulate quietly.",
  "Stability enables scale.",
  "Wealth grows where discipline stays.",
  "Planning is power.",
  "Consistency beats intensity.",
  "Long-term effort dominates short-term brilliance.",
  "Discipline is freedom in disguise.",
  "Focus is quiet dominance.",
  "Patience multiplies outcomes.",
  "Wealth rewards restraint.",
  "The disciplined become inevitable.",
  "Time favors prepared minds.",
  "Your system defines your ceiling.",
  "Control builds confidence.",
  "Long horizons create advantage.",
  "Discipline turns intention into reality."
];

/* ---------- INIT ---------- */

setRandomQuote();

fetch(DATA_URL)
  .then(res => res.json())
  .then(data => {
    allGoals = data;
    buildCategoryTabs();
    renderGoals();
  });

/* ---------- QUOTE ---------- */

function setRandomQuote() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById('quote').textContent = quote;
}

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
  img.onerror = () => img.src = PLACEHOLDER_IMAGE;

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

/* ---------- TIME ---------- */

function getDaysLeft(deadline) {
  const start = new Date('2026-01-01
