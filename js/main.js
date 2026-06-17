const createImageMarkup = (person) => {
  if (!person.image) {
    return `
      <div class="person-image placeholder" aria-hidden="true">
        <span>${person.name.charAt(0)}</span>
      </div>
    `;
  }

  return `
    <button class="image-button" type="button" data-image="${person.image}" data-title="${person.name}" aria-label="פתיחת תמונה של ${person.name}">
      <img class="person-image" src="${person.image}" alt="${person.name}" loading="lazy">
    </button>
  `;
};

const createPageLinkMarkup = (person) => {
  if (!person.page) return '';

  return `<a class="card-link" href="${person.page}">לעמוד המלא</a>`;
};

const renderCards = (items, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map((person) => `
    <article class="person-card">
      ${createImageMarkup(person)}
      <span class="tag">${person.field}</span>
      <h3>${person.name}</h3>
      <div class="meta">${person.years} • ${person.country}</div>
      <p>${person.summaryHe}</p>
      <p><strong>השפעה:</strong> ${person.impactHe}</p>
      ${createPageLinkMarkup(person)}
    </article>
  `).join('');
};

const setupImageModal = () => {
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" data-close="true"></div>
    <figure class="modal-content">
      <button class="modal-close" type="button" aria-label="סגירת תמונה">×</button>
      <img src="" alt="">
      <figcaption></figcaption>
    </figure>
  `;
  document.body.appendChild(modal);

  const modalImage = modal.querySelector('img');
  const caption = modal.querySelector('figcaption');
  const close = () => modal.classList.remove('is-open');

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.image-button');
    if (button) {
      modalImage.src = button.dataset.image;
      modalImage.alt = button.dataset.title;
      caption.textContent = button.dataset.title;
      modal.classList.add('is-open');
    }

    if (event.target.matches('[data-close="true"], .modal-close')) {
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
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
    setupImageModal();
  } catch (error) {
    console.error(error);
    document.querySelectorAll('.cards-grid').forEach((grid) => {
      grid.innerHTML = '<p class="error">לא ניתן לטעון את הנתונים כרגע. בדקו שהקבצים בתיקיית data קיימים.</p>';
    });
  }
};

init();