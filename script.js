fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    const container = document.querySelector('.projects-grid');
    container.innerHTML = projects.map(p => `
      <div class="project">
        <img src="${p.image}" alt="${p.title}">
        <div class="overlay">
          <h2>${p.title}</h2>
          <p>${p.description}</p>
          <a href="${p.link}" target="_blank">View Repo</a>
        </div>
      </div>
    `).join('');
  });
