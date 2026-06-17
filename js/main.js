const renderCards = (items, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map((person) => `
    <article class="person-card">
      <span class="tag">${person.field}</span>
      <h3>${person.name}</h3>
      <div class="meta">${person.years} • ${person.country}</div>
      <p>${person.summaryHe}</p>
      <p><strong>השפעה:</strong> ${person.impactHe}</p>
    </article>
  `).join('');
};

const loadJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
};

const init = async () => {
  try {
    const [leaders, scientists] = await Promise.all([
      loadJson('data/leaders.json'),
      loadJson('data/scientists.json')
    ]);

    renderCards(leaders, 'leaders-grid');
    renderCards(scientists, 'scientists-grid');
  } catch (error) {
    console.error(error);
    document.querySelectorAll('.cards-grid').forEach((grid) => {
      grid.innerHTML = '<p class="error">לא ניתן לטעון את הנתונים כרגע. בדקו שהקבצים בתיקיית data קיימים.</p>';
    });
  }
};

init();
