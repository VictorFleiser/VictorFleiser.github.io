fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    const container = document.querySelector('.projects-grid');

    // Convert [text](url) and line breaks
    const parseMarkdownBasics = (text) => {
      return text
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>') // links
        .replace(/\n/g, '<br>'); // new lines
    };

    container.innerHTML = projects.map(p => `
      <div class="project">
        <img src="${p.image}" alt="${p.title}">
        <div class="overlay">
          <h2>${p.title}</h2>
          <p>${parseMarkdownBasics(p.description)}</p>
          <a href="${p.link}" target="_blank">View Repo</a>
        </div>
      </div>
    `).join('');
  });