




const state = {
  tags: [],
  projects: [],
  selected: new Set(),
  expanded: new Set() // keeps track of which filter columns are expanded
};

const container = document.querySelector('.projects-grid');
const filtersContainer = document.querySelector('#filters');

async function loadData() {
  const [tags, projects] = await Promise.all([
    fetch('tags.json').then(r => r.json()),
    fetch('projects.json').then(r => r.json())
  ]);
  state.tags = tags;
  state.projects = projects;
  buildFilters();
  renderProjects();
}

function buildFilters() {
  // Group tags by category
  const groups = {};
  for (const tag of state.tags) {
    if (!groups[tag.category]) groups[tag.category] = [];
    groups[tag.category].push(tag);
  }

  filtersContainer.innerHTML = Object.entries(groups)
    .map(([cat, tags]) => renderFilterColumn(cat, tags))
    .join('');

  filtersContainer.addEventListener('change', onFilterChange);
  filtersContainer.addEventListener('click', onToggleExpand);
}

function renderFilterColumn(category, tags) {
  const limited = tags.slice(0, 3);
  const hidden = tags.slice(3);
  const expanded = state.expanded.has(category);

  const visibleTags = expanded ? tags : limited;
  const hasMore = tags.length > 3;

  const options = visibleTags
    .map(
      t => `
      <label class="filter-option">
        <input type="checkbox" value="${t.name}">
        <img src="${t.logo}" alt="${t.name}">
        <span>${t.name}</span>
      </label>`
    ).join('');

  const toggleButton = hasMore
    ? `<button class="toggle-btn" data-category="${category}">
        ${expanded ? '–' : '+'}
      </button>`
    : '';

  return `
    <div class="filter-column" data-category="${category}">
      <h3>${category}</h3>
      <div class="filter-options">${options}</div>
      ${toggleButton}
    </div>`;
}

function onToggleExpand(e) {
  const btn = e.target.closest('.toggle-btn');
  if (!btn) return;
  const cat = btn.dataset.category;
  if (state.expanded.has(cat)) state.expanded.delete(cat);
  else state.expanded.add(cat);
  buildFilters();
  // restore checked states
  for (const name of state.selected) {
    const input = filtersContainer.querySelector(`input[value="${name}"]`);
    if (input) input.checked = true;
  }
}

function onFilterChange(e) {
  if (e.target.tagName !== 'INPUT') return;
  const val = e.target.value;
  if (e.target.checked) state.selected.add(val);
  else state.selected.delete(val);
  renderProjects();
}

function renderProjects() {
  const parseMarkdownBasics = (text) =>
    text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n/g, '<br>');

  const activeTags = Array.from(state.selected);
  const filtered = !activeTags.length
    ? state.projects
    : state.projects.filter(p => p.tags.some(t => activeTags.includes(t)));

  container.innerHTML = filtered.map(p => {
    const tagLogos = p.tags
      .map(name => {
        const tag = state.tags.find(t => t.name === name);
        return tag ? `<img src="${tag.logo}" alt="${name}" title="${name}">` : '';
      }).join('');

    return `
      <div class="project">
        <img src="${p.image}" alt="${p.title}">
        <div class="project-info">
          <div class="project-tags">${tagLogos}</div>
          <div class="project-date">${p.date}</div>
        </div>
        <div class="overlay">
          <h2>${p.title}</h2>
          <p>${parseMarkdownBasics(p.description)}</p>
          <a href="${p.link}" target="_blank">View Repo</a>
        </div>
      </div>`;
  }).join('');
}

loadData();




