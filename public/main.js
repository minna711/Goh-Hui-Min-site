/* ── Year ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Sticky header shadow ── */
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ── Mobile nav toggle ── */
const toggle = document.querySelector('.nav-toggle');
const menu   = document.querySelector('.nav-menu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('main section[id]');
const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

/* ── GitHub repos ── */
const GITHUB_USER = 'minna711';
const LANG_COLORS  = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  HTML:       '#e34c26', CSS: '#563d7c',        Java: '#b07219',
  'C++':      '#f34b7d', Ruby: '#701516',        Go: '#00ADD8',
  Rust:       '#dea584', Shell: '#89e051',
};

async function loadRepos() {
  const grid = document.getElementById('repos-grid');
  try {
    const res  = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6&type=public`
    );
    if (!res.ok) throw new Error(res.status);

    const repos = await res.json();
    if (!repos.length) {
      grid.innerHTML = '<p class="repos-error">No public repositories yet.</p>';
      return;
    }

    grid.innerHTML = repos.map(r => {
      const lang    = r.language || '';
      const dot     = lang
        ? `<span class="lang-dot" style="background:${LANG_COLORS[lang] || '#8b949e'}"></span>${lang}`
        : '';
      const stars   = r.stargazers_count
        ? `<span class="repo-meta-item">
             <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
               <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
             </svg>
             ${r.stargazers_count}
           </span>`
        : '';
      const updated = new Date(r.updated_at).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' });

      return `<a href="${r.html_url}" class="repo-card" target="_blank" rel="noopener"
                 aria-label="${r.name} repository">
        <div class="repo-name">${r.name}</div>
        <div class="repo-desc">${r.description || 'No description provided.'}</div>
        <div class="repo-meta">
          ${dot ? `<span class="repo-meta-item">${dot}</span>` : ''}
          ${stars}
          <span class="repo-meta-item" title="Last updated">${updated}</span>
        </div>
      </a>`;
    }).join('');

  } catch {
    grid.innerHTML = '<p class="repos-error">Could not load repositories. Check back later.</p>';
  }
}

loadRepos();
