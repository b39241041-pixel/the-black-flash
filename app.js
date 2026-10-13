/* ============================================================
   PeteZah Games Clone — app.js
   Handles: starfield, games data, search/filter, modal, proxy
   ============================================================ */

/* ── Starfield Canvas ── */
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.0004 + 0.0001,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.speed * 1000 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 210, 255, ${alpha})`;
      ctx.fill();
    }
  }

  // Slow drift
  let driftStars = [];
  function createDrift() {
    driftStars = [];
    for (let i = 0; i < 60; i++) {
      driftStars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.8 + 0.1,
        vx: (Math.random() - 0.5) * 0.06,
        vy: Math.random() * 0.04 + 0.01,
        a: Math.random() * 0.4 + 0.05,
      });
    }
  }

  function updateDrift() {
    for (const s of driftStars) {
      s.x += s.vx;
      s.y += s.vy;
      if (s.y > H) { s.y = -2; s.x = Math.random() * W; }
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 230, 255, ${s.a})`;
      ctx.fill();
    }
  }

  function animate(t) {
    drawStars(t);
    updateDrift();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); createStars(220); createDrift(); });
  resize();
  createStars(220);
  createDrift();
  requestAnimationFrame(animate);
})();


/* ── Sidebar toggle ── */
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// Active nav item on scroll
const sections = ['home', 'games', 'proxy', 'movies', 'music'];
const navItems = document.querySelectorAll('.nav-item[data-section]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id || e.target.closest('section')?.id;
      navItems.forEach(n => {
        n.classList.toggle('active', n.dataset.section === id);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.hero, #proxy, #movies, #music').forEach(el => observer.observe(el));


/* ── Game Data ── */
const GAMES = [
  // Action
  { id: 1,  title: 'Slope',           cat: 'action',    emoji: '🟢', badge: 'hot',  color: '#16a34a', featured: true },
  { id: 2,  title: 'Run 3',           cat: 'action',    emoji: '🏃', badge: 'top',  color: '#d97706', featured: true },
  { id: 3,  title: 'Basketball Stars',cat: 'sports',    emoji: '🏀', badge: null,   color: '#ea580c', featured: false },
  { id: 4,  title: 'Stickman Fighter',cat: 'action',    emoji: '🥊', badge: 'new',  color: '#7c3aed', featured: true },
  { id: 5,  title: 'Subway Surfers',  cat: 'action',    emoji: '🛹', badge: 'hot',  color: '#0891b2', featured: true },
  { id: 6,  title: 'Moto X3M',        cat: 'racing',    emoji: '🏍️', badge: 'top',  color: '#b45309', featured: true },
  { id: 7,  title: 'Among Us',        cat: 'action',    emoji: '👽', badge: 'new',  color: '#1d4ed8', featured: false },
  { id: 8,  title: 'Temple Run 2',    cat: 'action',    emoji: '🏺', badge: null,   color: '#92400e', featured: false },
  // Puzzle
  { id: 9,  title: '2048',            cat: 'puzzle',    emoji: '🔢', badge: null,   color: '#ca8a04', featured: false },
  { id: 10, title: 'Tetris',          cat: 'puzzle',    emoji: '🟦', badge: 'top',  color: '#1e40af', featured: false },
  { id: 11, title: 'Sudoku',          cat: 'puzzle',    emoji: '🧩', badge: null,   color: '#065f46', featured: false },
  { id: 12, title: 'Cut the Rope',    cat: 'puzzle',    emoji: '🐸', badge: null,   color: '#15803d', featured: false },
  // Shooter
  { id: 13, title: 'Bullet Force',    cat: 'shooter',   emoji: '🔫', badge: 'hot',  color: '#991b1b', featured: false },
  { id: 14, title: 'Krunker.io',      cat: 'shooter',   emoji: '🎯', badge: 'top',  color: '#7f1d1d', featured: false },
  { id: 15, title: 'Shell Shockers',  cat: 'shooter',   emoji: '🥚', badge: 'new',  color: '#78350f', featured: false },
  // Racing
  { id: 16, title: 'Drift Hunters',   cat: 'racing',    emoji: '🚗', badge: 'hot',  color: '#1e3a5f', featured: false },
  { id: 17, title: 'Happy Wheels',    cat: 'action',    emoji: '🚲', badge: null,   color: '#4c1d95', featured: false },
  { id: 18, title: 'Road Fury',       cat: 'racing',    emoji: '🏎️', badge: null,   color: '#1c1917', featured: false },
  // Strategy
  { id: 19, title: 'Bloons TD',       cat: 'strategy',  emoji: '🎈', badge: 'top',  color: '#164e63', featured: false },
  { id: 20, title: 'Kingdom Rush',    cat: 'strategy',  emoji: '🏰', badge: null,   color: '#422006', featured: false },
  // Adventure
  { id: 21, title: 'Minecraft Classic',cat:'adventure', emoji: '⛏️', badge: 'hot',  color: '#365314', featured: false },
  { id: 22, title: 'Fireboy & Watergirl',cat:'adventure',emoji:'🔥',  badge: 'top',  color: '#9a3412', featured: false },
  { id: 23, title: 'Papa\'s Freezeria',cat:'adventure', emoji: '🍦', badge: null,   color: '#831843', featured: false },
  // Sports
  { id: 24, title: 'Soccer Physics',  cat: 'sports',    emoji: '⚽', badge: null,   color: '#14532d', featured: false },
  { id: 25, title: 'Boxing Physics',  cat: 'sports',    emoji: '🥊', badge: 'new',  color: '#7f1d1d', featured: false },
  // Idle
  { id: 26, title: 'Cookie Clicker',  cat: 'idle',      emoji: '🍪', badge: 'hot',  color: '#92400e', featured: false },
  { id: 27, title: 'Idle Miner',      cat: 'idle',      emoji: '⛏️', badge: null,   color: '#1c1917', featured: false },
  { id: 28, title: 'Clicker Heroes',  cat: 'idle',      emoji: '⚔️', badge: null,   color: '#312e81', featured: false },
  { id: 29, title: 'Agar.io',         cat: 'action',    emoji: '🔵', badge: 'top',  color: '#065f46', featured: false },
  { id: 30, title: 'Slither.io',      cat: 'action',    emoji: '🐍', badge: null,   color: '#14532d', featured: false },
  { id: 31, title: 'Paper.io',        cat: 'action',    emoji: '📄', badge: 'new',  color: '#1e3a5f', featured: false },
  { id: 32, title: 'Geometry Dash',   cat: 'action',    emoji: '💠', badge: 'hot',  color: '#4338ca', featured: false },
];

const MOVIES = [
  { title: 'Big Buck Bunny',  year: '2008', emoji: '🐰', color: '#365314' },
  { title: 'Elephant Dream',  year: '2006', emoji: '🐘', color: '#164e63' },
  { title: 'Tears of Steel',  year: '2012', emoji: '🤖', color: '#1c1917' },
  { title: 'Cosmos Laundromat',year:'2015', emoji: '🌌', color: '#1e1b4b' },
  { title: 'Sintel',          year: '2010', emoji: '🐉', color: '#7f1d1d' },
  { title: 'Caminandes',      year: '2013', emoji: '🦙', color: '#422006' },
];

const MUSIC = [
  { title: 'Neon Horizon',     artist: 'SynthWave X',   emoji: '🎵', color: '#4338ca' },
  { title: 'Bass Drop City',   artist: 'DJ Overload',   emoji: '🎧', color: '#7c3aed' },
  { title: 'Lo-Fi Study Mix',  artist: 'ChillBeats',    emoji: '☕', color: '#065f46' },
  { title: 'Epic Gaming OST',  artist: 'GameScore Pro', emoji: '🎮', color: '#991b1b' },
  { title: 'Midnight Drive',   artist: 'RetroWave',     emoji: '🌙', color: '#1e3a5f' },
  { title: 'Summer Vibes',     artist: 'Coastal Beats', emoji: '🌊', color: '#0891b2' },
];


/* ── Render Helpers ── */
function badgeHtml(badge) {
  if (!badge) return '';
  const labels = { hot: 'Hot 🔥', new: 'New', top: 'Top' };
  return `<span class="game-badge badge-${badge}">${labels[badge]}</span>`;
}

function thumbGrad(color) {
  return `linear-gradient(135deg, ${color}88 0%, ${color}22 100%)`;
}

function renderGameCard(g, featured = false) {
  const div = document.createElement('div');
  div.className = 'game-card';
  div.innerHTML = `
    <div class="game-thumb" style="background:${thumbGrad(g.color)}">
      <div class="game-thumb-bg"></div>
      <span class="game-thumb-emoji">${g.emoji}</span>
      ${badgeHtml(g.badge)}
    </div>
    <div class="game-info">
      <div class="game-title">${g.title}</div>
      <div class="game-meta">
        <span class="game-cat-tag">${g.cat}</span>
      </div>
    </div>
  `;
  div.addEventListener('click', () => openGame(g));
  return div;
}

function renderGames(list) {
  const grid = document.getElementById('gamesGrid');
  grid.innerHTML = '';
  const noRes = document.getElementById('noResults');
  if (list.length === 0) {
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';
  list.forEach(g => grid.appendChild(renderGameCard(g)));
}

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  GAMES.filter(g => g.featured).forEach(g => grid.appendChild(renderGameCard(g, true)));
}

function renderMovies() {
  const grid = document.getElementById('moviesGrid');
  MOVIES.forEach(m => {
    const div = document.createElement('div');
    div.className = 'media-card';
    div.innerHTML = `
      <div class="media-thumb" style="background:${thumbGrad(m.color)}">${m.emoji}</div>
      <div class="media-info">
        <div class="media-title">${m.title}</div>
        <div class="media-sub">${m.year}</div>
      </div>
    `;
    div.addEventListener('click', () => {
      alert(`▶️ Playing: ${m.title}\n\n(Connect a video source to enable streaming.)`);
    });
    grid.appendChild(div);
  });
}

function renderMusic() {
  const grid = document.getElementById('musicGrid');
  MUSIC.forEach(m => {
    const div = document.createElement('div');
    div.className = 'music-card';
    div.innerHTML = `
      <div class="music-art" style="background:${thumbGrad(m.color)}">${m.emoji}</div>
      <div class="music-info">
        <div class="music-title">${m.title}</div>
        <div class="music-artist">${m.artist}</div>
      </div>
      <div class="music-play">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
    `;
    div.addEventListener('click', () => {
      alert(`🎵 Playing: ${m.title} — ${m.artist}\n\n(Connect a music source to enable streaming.)`);
    });
    grid.appendChild(div);
  });
}


/* ── Search + Filter ── */
let activeCategory = 'all';
let searchQuery = '';

function filteredGames() {
  return GAMES.filter(g => {
    const matchCat = activeCategory === 'all' || g.cat === activeCategory;
    const matchQ   = !searchQuery || g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.cat.includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderGames(filteredGames());
});

document.getElementById('categories').addEventListener('click', (e) => {
  const btn = e.target.closest('.cat');
  if (!btn) return;
  document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  activeCategory = btn.dataset.cat;
  renderGames(filteredGames());
});


/* ── Game Modal ── */
const modal = document.getElementById('gameModal');
const gameFrame = document.getElementById('gameFrame');
const modalName = document.getElementById('modalName');
const modalIcon = document.getElementById('modalIcon');

// We embed games via a placeholder since actual game URLs vary
// In production these would be real iframe src URLs
const GAME_URLS = {
  // Using public game iframes where available
  'Slope':          'https://slope-game.github.io/',
  'Agar.io':        'https://agar.io/',
  'Slither.io':     'https://slither.io/',
  'Paper.io':       'https://paper-io.com/',
  'Krunker.io':     'https://krunker.io/',
};

function openGame(g) {
  modalIcon.textContent = g.emoji;
  modalName.textContent = g.title;
  const url = GAME_URLS[g.title] || null;
  if (url) {
    gameFrame.src = url;
  } else {
    gameFrame.src = 'about:blank';
    gameFrame.srcdoc = `
      <html style="margin:0;background:#050d1a;color:#8aa3c8;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:12px">
        <div style="font-size:4rem">${g.emoji}</div>
        <div style="font-size:1.4rem;font-weight:700;color:#fff">${g.title}</div>
        <div style="font-size:.85rem;opacity:.7">This game requires a server connection.</div>
        <div style="font-size:.75rem;opacity:.5;margin-top:4px">Connect your game backend to enable play.</div>
      </html>
    `;
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  gameFrame.src = 'about:blank';
  gameFrame.srcdoc = '';
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

document.getElementById('modalFullscreen').addEventListener('click', () => {
  const frame = document.getElementById('gameFrame');
  if (frame.requestFullscreen) frame.requestFullscreen();
  else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
});


/* ── Proxy ── */
document.getElementById('proxyGo').addEventListener('click', handleProxy);
document.getElementById('proxyInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleProxy();
});

function handleProxy() {
  let url = document.getElementById('proxyInput').value.trim();
  if (!url) return;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  // In production this would route through Ultraviolet/Scramjet
  // For the clone we show a message
  alert(`🌐 Proxy request for:\n${url}\n\nConnect your proxy backend (Ultraviolet/Scramjet) to enable browsing.`);
}

document.querySelectorAll('.proxy-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.getElementById('proxyInput').value = chip.dataset.url;
  });
});


/* ── Init ── */
renderFeatured();
renderGames(GAMES);
renderMovies();
renderMusic();
