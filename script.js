/* ══════════════════════════════════════════════════════════════
   NOESIS — script.js
   "Think Deeper. Build Smarter."
   Features:
     • Animated logo: E ⇄ Σ (optional cycle through Ξ, ∃)
     • GitHub API — live repos from moyinoluwasamuel288
     • Firebase Firestore — idea submission & display
     • Contact copy buttons, theme toggle, scroll reveal
   ══════════════════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────────────────────
   GITHUB CONFIG
   Username is set to the real one. Add names to FEATURED_REPOS
   or put "[featured]" anywhere in a repo description.
───────────────────────────────────────────────────────────────*/
const GITHUB_USERNAME  = 'moyinoluwasamuel288';
const FEATURED_REPOS   = [];           // e.g. ['my-app', 'cool-tool']
const GITHUB_CACHE_KEY = 'noesis_gh';
const GITHUB_CACHE_TTL = 10 * 60 * 1000; // 10 min

/* ─────────────────────────────────────────────────────────────
   APP STATE
───────────────────────────────────────────────────────────────*/
const state = {
  currentPage:      'home',
  activeView:       'featured',
  projectSearch:    '',
  activeIdeaFilter: 'all',
  repos:            [],
  githubLoaded:     false,
  ideas:            [],
  unsubIdeas:       null   // Firestore real-time listener cleanup
};

/* ─────────────────────────────────────────────────────────────
   DOM HELPERS
───────────────────────────────────────────────────────────────*/
const $  = id  => document.getElementById(id);
const $q = sel => document.querySelector(sel);
const $a = sel => document.querySelectorAll(sel);

/* ══════════════════════════════════════════════════════════════
   BOOTSTRAP
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLogoAnimation();
  initTheme();
  initNavigation();
  initCanvas();
  initProjects();
  initIdeas();
  initContact();
  initScrollReveal();
  $('footerYear').textContent = new Date().getFullYear();
});

/* ══════════════════════════════════════════════════════════════
   LOGO ANIMATION
   Phase 1 — initial morph: E → Σ on load (fade transition)
   Phase 2 — idle cycle: E ↔ Σ with optional glitch trigger
   Phase 3 — glitch system: random + hover sigmaGlitch keyframe
   ══════════════════════════════════════════════════════════════ */
const LOGO_CHARS   = ['E', 'Σ'];   // hero & nav use E ↔ Σ
const LOGO_SIMPLE  = ['E', 'Σ'];
let logoIdx        = 0;
let navIdx         = 0;
let logoTimer      = null;
let navTimer       = null;
let glitchTimer    = null;
let isHoveringHero = false;
let isHoveringNav  = false;

function initLogoAnimation() {
  const navLetter  = $('logoLetter');
  const heroLetter = $('heroLetter');
  const heroLogo   = $q('.hero-logo');
  const navBrand   = $('navBrand');
  if (!navLetter || !heroLetter) return;

  /* ── Phase 1: show "E" for ~1.4 s then fade to "Σ" ── */
  setTimeout(() => {
    morphTo(navLetter,  'Σ');
    morphTo(heroLetter, 'Σ');
    navIdx  = 1;
    logoIdx = 1;
  }, 1400);

  /* ── Phase 2: begin idle cycle + pulse after morph settles ── */
  setTimeout(() => {
    startIdleCycle();
    addIdlePulse();
    startGlitchSystem();
  }, 2800);

  /* ── Hover: snap to Σ + trigger glitch immediately ── */
  if (heroLogo) {
    heroLogo.addEventListener('mouseenter', () => {
      isHoveringHero = true;
      stopIdleCycle();
      removePulse(heroLetter);
      snapTo(heroLetter, 'Σ');
      triggerGlitch(heroLetter);
    });
    heroLogo.addEventListener('mouseleave', () => {
      isHoveringHero = false;
      addIdlePulse();
      startIdleCycle();
    });
  }

  if (navBrand) {
    navBrand.addEventListener('mouseenter', () => {
      isHoveringNav = true;
      snapTo(navLetter, 'Σ');
      triggerGlitch(navLetter);
    });
    navBrand.addEventListener('mouseleave', () => {
      isHoveringNav = false;
    });
  }
}

/* ── Smooth fade-swap a letter element ── */
function morphTo(el, char) {
  if (!el) return;
  el.classList.add('fading');
  setTimeout(() => {
    el.textContent = char;
    el.classList.remove('fading');
  }, 190);
}

/* ── Instant snap (used on hover) ── */
function snapTo(el, char) {
  if (!el) return;
  el.classList.remove('fading');
  el.textContent = char;
}

function addIdlePulse() {
  const h = $('heroLetter');
  const n = $('logoLetter');
  if (h) h.classList.add('pulse-idle');
  if (n) n.classList.add('pulse-idle');
}

function removePulse(el) {
  if (el) el.classList.remove('pulse-idle');
}

function startIdleCycle() {
  stopIdleCycle();
  /* Hero + Nav: E ↔ Σ every 3.2 s */
  logoTimer = setInterval(() => {
    if (isHoveringHero) return;
    logoIdx = (logoIdx + 1) % LOGO_CHARS.length;
    morphTo($('heroLetter'), LOGO_CHARS[logoIdx]);
  }, 3200);
  navTimer = setInterval(() => {
    if (isHoveringNav) return;
    navIdx = (navIdx + 1) % LOGO_SIMPLE.length;
    morphTo($('logoLetter'), LOGO_SIMPLE[navIdx]);
  }, 3800);
}

function stopIdleCycle() {
  clearInterval(logoTimer);
  clearInterval(navTimer);
}

/* ── Glitch system: random trigger every 2.5 s ── */
function triggerGlitch(el) {
  if (!el) return;
  el.classList.remove('glitch');
  /* Force reflow so animation re-triggers even if already applied */
  void el.offsetWidth;
  el.classList.add('glitch');
  setTimeout(() => el.classList.remove('glitch'), 420);
}

function startGlitchSystem() {
  clearInterval(glitchTimer);
  glitchTimer = setInterval(() => {
    if (Math.random() > 0.65) {
      /* Pick one of the visible sigma elements at random */
      const targets = [$('heroLetter'), $('logoLetter')].filter(Boolean);
      if (targets.length) {
        triggerGlitch(targets[Math.floor(Math.random() * targets.length)]);
      }
    }
  }, 2500);
}

/* ══════════════════════════════════════════════════════════════
   THEME
   ══════════════════════════════════════════════════════════════ */
function initTheme() {
  applyTheme(localStorage.getItem('noesis_theme') || 'dark');
}
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $('themeToggle').textContent = t === 'dark' ? '☀' : '☾';
  localStorage.setItem('noesis_theme', t);
}
function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}

/* ══════════════════════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════════════════════ */
function initNavigation() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-nav]');
    if (t) { navigateTo(t.dataset.nav); $('mobileMenu').classList.remove('open'); }
  });
  $('menuToggle').addEventListener('click', () => $('mobileMenu').classList.toggle('open'));
  $('themeToggle').addEventListener('click', toggleTheme);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { $('mobileMenu').classList.remove('open'); closeModal(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (state.currentPage !== 'projects') navigateTo('projects');
      setTimeout(() => $('projectSearch') && $('projectSearch').focus(), 280);
    }
  });

  const hash = location.hash.replace('#','');
  if (['home','projects','journey','ideas','contact'].includes(hash)) {
    state.currentPage = 'home'; navigateTo(hash);
  }
  window.addEventListener('popstate', () => navigateTo(location.hash.replace('#','') || 'home'));
}

function navigateTo(page) {
  if (page === state.currentPage) return;
  const old = $(`page-${state.currentPage}`);
  if (old) old.classList.remove('active');
  const nw = $(`page-${page}`);
  if (!nw) return;
  nw.classList.add('active','page-enter');
  nw.addEventListener('animationend', () => nw.classList.remove('page-enter'), { once:true });
  state.currentPage = page;
  $a('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.nav === page));
  window.scrollTo({ top:0, behavior:'smooth' });
  setTimeout(revealVisible, 120);
  history.pushState(null, '', `#${page}`);
}

/* ══════════════════════════════════════════════════════════════
   CANVAS — Parallax particle field
   ══════════════════════════════════════════════════════════════ */
function initCanvas() {
  const canvas = $('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let mouse = { x: 0, y: 0 };

  const LAYERS = [
    { count:60, speed:.12, size:[.4,1.2], alpha:[.12,.4],  parallax:.015 },
    { count:35, speed:.22, size:[.8,1.8], alpha:[.22,.55], parallax:.03  },
    { count:15, speed:.38, size:[1.2,2.8],alpha:[.3,.7],   parallax:.06  },
  ];

  const rnd = (a,b) => Math.random()*(b-a)+a;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  class Particle {
    constructor(layer) { this.layer = layer; this.cfg = LAYERS[layer]; this.reset(true); }
    reset(init) {
      this.x = rnd(0,W); this.y = init ? rnd(0,H) : H+5;
      this.r = rnd(...this.cfg.size);
      this.baseAlpha = rnd(...this.cfg.alpha); this.alpha = this.baseAlpha;
      this.vx = rnd(-.08,.08); this.vy = -rnd(this.cfg.speed*.6, this.cfg.speed*1.4);
      this.life = 0; this.maxLife = rnd(200,600);
      this.pulsePhase = rnd(0,Math.PI*2); this.pulseSpeed = rnd(.005,.02);
      this.glowing = Math.random() < .12;
      const hues = [220,230,210,250,180,0];
      this.hue = hues[Math.floor(Math.random()*hues.length)];
      this.sat = this.hue===0 ? 0 : rnd(40,80);
    }
    update() {
      this.life++; this.pulsePhase += this.pulseSpeed;
      const px = (mouse.x/W-.5)*this.cfg.parallax*W*.01;
      const py = (mouse.y/H-.5)*this.cfg.parallax*H*.01;
      this.x += this.vx + px; this.y += this.vy + py;
      const lr = this.life/this.maxLife;
      const fade = lr<.1 ? lr/.1 : lr>.85 ? 1-(lr-.85)/.15 : 1;
      this.alpha = this.baseAlpha * fade * (this.glowing ? 1+.4*Math.sin(this.pulsePhase) : 1);
      if (this.life >= this.maxLife || this.y<-10 || this.x<-10 || this.x>W+10) this.reset();
    }
    draw() {
      const dark = document.documentElement.dataset.theme !== 'light';
      const c = this.hue===0
        ? (dark ? `rgba(255,255,255,${this.alpha})` : `rgba(0,0,0,${this.alpha*.35})`)
        : `hsla(${this.hue},${this.sat}%,${dark?75:35}%,${this.alpha})`;
      ctx.save();
      if (this.glowing && this.r>1) { ctx.shadowBlur=this.r*6; ctx.shadowColor=c; }
      ctx.globalAlpha = Math.min(Math.max(this.alpha,0),1);
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }

  function buildParticles() {
    particles = [];
    LAYERS.forEach((_,i) => { for(let n=0;n<LAYERS[i].count;n++) particles.push(new Particle(i)); });
  }

  function drawConnections() {
    const D = 80; const top = particles.filter(p=>p.layer===2);
    for(let i=0;i<top.length;i++) for(let j=i+1;j<top.length;j++) {
      const dx=top[i].x-top[j].x, dy=top[i].y-top[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<D){ ctx.strokeStyle=`rgba(91,143,255,${(1-d/D)*.06})`; ctx.lineWidth=.5; ctx.beginPath(); ctx.moveTo(top[i].x,top[i].y); ctx.lineTo(top[j].x,top[j].y); ctx.stroke(); }
    }
  }

  let raf;
  function tick() {
    ctx.clearRect(0,0,W,H); drawConnections();
    particles.forEach(p=>{ p.update(); p.draw(); });
    raf = requestAnimationFrame(tick);
  }

  let mmT;
  document.addEventListener('mousemove', e => { clearTimeout(mmT); mmT=setTimeout(()=>{ mouse.x=e.clientX; mouse.y=e.clientY; },16); });
  document.addEventListener('touchmove', e => { if(e.touches[0]){mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY;} },{passive:true});
  document.addEventListener('visibilitychange', () => { if(document.hidden) cancelAnimationFrame(raf); else tick(); });

  resize(); buildParticles(); tick();
  window.addEventListener('resize', () => { resize(); buildParticles(); });
}

/* ══════════════════════════════════════════════════════════════
   GITHUB PROJECTS
   ══════════════════════════════════════════════════════════════ */
function initProjects() {
  $('repoToggle').addEventListener('click', e => {
    const btn = e.target.closest('.toggle-btn'); if(!btn) return;
    state.activeView = btn.dataset.view;
    $a('#repoToggle .toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.view===state.activeView));
    renderProjects();
  });
  $('projectSearch').addEventListener('input', e => { state.projectSearch=e.target.value.trim(); renderProjects(); });
  fetchRepos();
}

async function fetchRepos() {
  /* Try cache */
  try {
    const c = JSON.parse(localStorage.getItem(GITHUB_CACHE_KEY)||'null');
    if (c && Date.now()-c.ts < GITHUB_CACHE_TTL) {
      state.repos = c.data; state.githubLoaded = true;
      renderProjects(); setGhStatus('cached', `Cached · ${cacheAge(c.ts)}`);
      return;
    }
  } catch{}

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { headers:{'Accept':'application/vnd.github.v3+json'} }
    );
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const all  = await res.json();
    const data = all
      .filter(r => !r.fork)
      .sort((a,b) => new Date(b.updated_at)-new Date(a.updated_at));
    state.repos = data; state.githubLoaded = true;
    localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify({ts:Date.now(), data}));
    renderProjects(); setGhStatus('live','Live from GitHub');
    updateStats();
  } catch(err) {
    console.warn('GitHub fetch failed:', err.message);
    try {
      const c = JSON.parse(localStorage.getItem(GITHUB_CACHE_KEY)||'null');
      if (c) { state.repos=c.data; renderProjects(); setGhStatus('cached','Stale cache'); return; }
    } catch{}
    showProjectsError(); setGhStatus('error','GitHub unavailable');
  }
}

function isFeatured(r) {
  return FEATURED_REPOS.includes(r.name) || (r.description||'').toLowerCase().includes('[featured]');
}

function getFilteredRepos() {
  let repos = [...state.repos];
  if (state.activeView==='featured') {
    const feat = repos.filter(r=>isFeatured(r)||r.stargazers_count>0);
    if (feat.length>0) repos = feat;
  }
  const q = state.projectSearch.toLowerCase();
  if (q) repos = repos.filter(r =>
    r.name.toLowerCase().includes(q) ||
    (r.description||'').toLowerCase().includes(q) ||
    (r.language||'').toLowerCase().includes(q)
  );
  // Featured bubble to top
  repos.sort((a,b) => (isFeatured(b)?1:0)-(isFeatured(a)?1:0));
  return repos;
}

function renderProjects() {
  const grid = $('projectGrid');
  if (!state.githubLoaded) return;
  const repos = getFilteredRepos();
  if (!repos.length) {
    grid.innerHTML=`<div class="no-results"><span class="no-results-icon">⊘</span>${state.projectSearch?'No repos match your search.':'No projects found.'}</div>`;
    return;
  }
  grid.innerHTML = repos.map((r,i) => buildProjectCard(r,i)).join('');
  grid.querySelectorAll('.project-card').forEach(c =>
    c.addEventListener('click', () => openProjectModal(c.dataset.name))
  );
  updateStats();
}

function buildProjectCard(r,i) {
  const featured  = isFeatured(r);
  const langClass = `lang-${(r.language||'default').replace(/[\s#]/g,'')}`;
  const desc = (r.description||'No description provided.').replace(/\[featured\]/gi,'').trim();
  return `
    <div class="project-card" data-name="${esc(r.name)}" style="animation-delay:${i*.06}s">
      <div class="pc-top">
        <div class="pc-title">${esc(r.name.replace(/-/g,' '))}</div>
        ${featured?'<span class="pc-featured-badge">Featured</span>':''}
      </div>
      <p class="pc-desc">${esc(desc)}</p>
      <div class="pc-meta">
        ${r.language?`<span class="pc-lang"><span class="lang-dot ${langClass}"></span>${esc(r.language)}</span>`:''}
        ${r.stargazers_count>0?`<span class="pc-stars">⭐ ${r.stargazers_count}</span>`:''}
      </div>
      <a href="${esc(r.html_url)}" target="_blank" rel="noopener noreferrer" class="pc-link" onclick="event.stopPropagation()">View on GitHub ↗</a>
    </div>`;
}

function showProjectsError() {
  $('projectGrid').innerHTML=`<div class="no-results"><span class="no-results-icon">⚠</span>Projects unavailable — could not reach GitHub API.<br><br><a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);font-family:var(--font-mono);font-size:.8rem">View GitHub directly →</a></div>`;
}

function setGhStatus(type,text) {
  const el = $('githubStatus'); el.textContent=text; el.className=`github-badge ${type}`;
}
function cacheAge(ts) {
  const d=Math.floor((Date.now()-ts)/60000);
  return d<1?'just now':d<60?`${d}m ago`:`${Math.floor(d/60)}h ago`;
}

/* ── Project Modal ── */
function initModal() {}  // delegated inline
function openProjectModal(name) {
  const r = state.repos.find(x=>x.name===name); if(!r) return;
  const desc = (r.description||'No description provided.').replace(/\[featured\]/gi,'').trim();
  const langClass = `lang-${(r.language||'default').replace(/[\s#]/g,'')}`;
  $('modalContent').innerHTML=`
    <div class="modal-tag">GitHub Repository</div>
    <h2 class="modal-title">${esc(r.name.replace(/-/g,' '))}</h2>
    <p class="modal-desc">${esc(desc)}</p>
    <div class="modal-meta-row">
      ${r.language?`<span class="pc-lang"><span class="lang-dot ${langClass}"></span>${esc(r.language)}</span>`:''}
      ${r.stargazers_count>0?`<span class="pc-stars">⭐ ${r.stargazers_count} stars</span>`:''}
      ${r.forks_count>0?`<span style="font-family:var(--font-mono);font-size:.72rem;color:var(--text2)">🍴 ${r.forks_count}</span>`:''}
      <span style="font-family:var(--font-mono);font-size:.7rem;color:var(--text3)">Updated ${new Date(r.updated_at).toLocaleDateString('en-GB',{month:'short',year:'numeric'})}</span>
    </div>
    <a href="${esc(r.html_url)}" target="_blank" rel="noopener noreferrer" class="modal-link-btn">↗ Open on GitHub</a>
    ${r.homepage?`<a href="${esc(r.homepage)}" target="_blank" rel="noopener noreferrer" class="modal-link-btn" style="margin-left:10px;background:transparent;color:var(--accent2);border-color:var(--accent2)">↗ Live Demo</a>`:''}`;
  $('projectModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal() { $('projectModal').classList.remove('open'); document.body.style.overflow=''; }

document.addEventListener('click', e => {
  if (e.target.id==='modalClose' || e.target.id==='projectModal') closeModal();
});

/* ══════════════════════════════════════════════════════════════
   IDEAS VAULT — Firebase Firestore
   ══════════════════════════════════════════════════════════════ */
function initIdeas() {
  /* Toggle form open/close */
  $('ideaFormToggle').addEventListener('click', () => {
    $('ideaFormShell').classList.toggle('expanded');
  });

  /* Submit */
  $('saveIdeaBtn').addEventListener('click', submitIdea);

  /* Category filter pills */
  $('ideasFilterRow').addEventListener('click', e => {
    const btn = e.target.closest('.pill-filter'); if(!btn) return;
    state.activeIdeaFilter = btn.dataset.ideaFilter;
    $a('#ideasFilterRow .pill-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderIdeasFromCache();
  });

  /* Load ideas from Firestore (real-time listener) */
  subscribeIdeas();
}

/* ── Firestore real-time subscription ── */
function subscribeIdeas() {
  if (!window.db) {
    // Firebase not configured — show placeholder
    renderIdeasFallback();
    return;
  }
  try {
    if (state.unsubIdeas) state.unsubIdeas(); // cancel old listener
    state.unsubIdeas = window.db
      .collection('ideas')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        state.ideas = snapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }));
        renderIdeasFromCache();
        updateStats();
      }, err => {
        console.warn('Firestore read error:', err.message);
        renderIdeasFallback();
      });
  } catch(err) {
    console.warn('Firestore init error:', err.message);
    renderIdeasFallback();
  }
}

/* ── Submit a new idea to Firestore ── */
async function submitIdea() {
  const name      = $('ideaName').value.trim();
  const email     = $('ideaEmail').value.trim();
  const desc      = $('ideaDesc').value.trim();
  const protoLink = $('ideaProtoLink').value.trim();
  const errEl     = $('formError');

  /* Validate */
  if (!name)        { errEl.textContent='Please enter your name.';       return; }
  if (!email)       { errEl.textContent='Please enter your email.';      return; }
  if (!isValidEmail(email)) { errEl.textContent='Please enter a valid email address.'; return; }
  if (!desc)        { errEl.textContent='Please describe your idea.';    return; }
  errEl.textContent = '';

  if (!window.db) {
    errEl.textContent='Firebase is not configured yet. See setup instructions.';
    return;
  }

  /* Disable button during save */
  const btn = $('saveIdeaBtn');
  btn.disabled = true;
  $('saveIdeaBtnText').textContent = 'Submitting…';

  try {
    await window.db.collection('ideas').add({
      name,
      email,          // stored in DB but NOT shown publicly
      idea: desc,
      prototypeLink: protoLink || null,
      status: 'idea',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    /* Reset form */
    $('ideaName').value      = '';
    $('ideaEmail').value     = '';
    $('ideaDesc').value      = '';
    $('ideaProtoLink').value = '';
    $('ideaFormShell').classList.remove('expanded');
    showToast('Idea submitted to the vault ✓');

  } catch(err) {
    errEl.textContent = 'Failed to submit. Please try again.';
    console.error('Firestore write error:', err);
  } finally {
    btn.disabled = false;
    $('saveIdeaBtnText').textContent = 'Submit Idea';
  }
}

/* ── Render ideas from in-memory state ── */
function renderIdeasFromCache() {
  const grid = $('ideasGrid');
  const list = state.ideas;

  if (!list.length) {
    grid.innerHTML=`<div class="no-results"><span class="no-results-icon">💡</span>No ideas yet. Be the first to submit one above.</div>`;
    return;
  }

  grid.innerHTML = list.map((idea,i) => buildIdeaCard(idea,i)).join('');
}

function buildIdeaCard(idea,i) {
  const title = idea.idea
    ? (idea.idea.length>80 ? idea.idea.slice(0,77)+'…' : idea.idea)
    : 'Untitled Idea';

  const date = idea.createdAt
    ? (idea.createdAt.toDate ? idea.createdAt.toDate() : new Date(idea.createdAt))
    : null;
  const dateStr = date ? date.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '';

  return `
    <div class="idea-card" style="animation-delay:${i*.05}s">
      <div class="ic-top">
        <div class="ic-title">${esc(title)}</div>
        <span class="ic-status">${esc(idea.status||'Idea')}</span>
      </div>
      <p class="ic-desc">${esc(idea.idea||'')}</p>
      <div class="ic-footer">
        <span class="ic-author">by ${esc(idea.name||'Anonymous')}</span>
        ${idea.prototypeLink?`<a href="${esc(idea.prototypeLink)}" target="_blank" rel="noopener noreferrer" class="ic-proto">View Prototype →</a>`:''}
        <span class="ic-date">${dateStr}</span>
      </div>
    </div>`;
}

/* Fallback when Firebase isn't configured */
function renderIdeasFallback() {
  $('ideasGrid').innerHTML=`
    <div class="no-results">
      <span class="no-results-icon">🔥</span>
      Firebase not yet configured.<br><br>
      <span style="font-size:.78rem;color:var(--text2);line-height:2">
        Add your Firebase config in the &lt;script&gt; block at the top of index.html.<br>
        See the setup instructions below.
      </span>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════
   CONTACT
   ══════════════════════════════════════════════════════════════ */
function initContact() {
  $('copyEmail').addEventListener('click',  e => { e.preventDefault(); copyText('moyinoluwasamuel288@gmail.com', $('copyEmail')); });
  $('copyPhone').addEventListener('click',  e => { e.preventDefault(); copyText('07070944581', $('copyPhone')); });
  $('emailCard').addEventListener('keydown',e => { if(e.key==='Enter'||e.key===' ') copyText('moyinoluwasamuel288@gmail.com', $('copyEmail')); });
  $('phoneCard').addEventListener('keydown',e => { if(e.key==='Enter'||e.key===' ') copyText('07070944581', $('copyPhone')); });
  $('cfSubmit').addEventListener('click', handleContactForm);
}

function copyText(text, btn) {
  const finish = () => {
    const orig = btn.textContent; btn.textContent='Copied!'; btn.classList.add('copied');
    showToast('Copied to clipboard ✓');
    setTimeout(() => { btn.textContent=orig; btn.classList.remove('copied'); }, 2400);
  };
  navigator.clipboard
    ? navigator.clipboard.writeText(text).then(finish).catch(finish)
    : (function(){
        const el=document.createElement('textarea'); el.value=text;
        el.style.cssText='position:fixed;opacity:0'; document.body.appendChild(el);
        el.select(); document.execCommand('copy'); document.body.removeChild(el); finish();
      })();
}

function handleContactForm() {
  const name    = $('cfName').value.trim();
  const email   = $('cfEmail').value.trim();
  const subject = $('cfSubject').value.trim();
  const message = $('cfMessage').value.trim();
  const fb = $('cfFeedback');
  fb.className='form-feedback';
  if (!name||!email||!message) { fb.textContent='Please fill in name, email and message.'; fb.classList.add('error'); return; }
  if (!isValidEmail(email))    { fb.textContent='Please enter a valid email address.'; fb.classList.add('error'); return; }
  window.open(`mailto:moyinoluwasamuel288@gmail.com?subject=${encodeURIComponent(subject||'Portfolio Contact')}&body=${encodeURIComponent(`Name: ${name}\n\n${message}`)}`);
  fb.textContent="Message opened in your mail client — thanks for reaching out!"; fb.classList.add('success');
  $('cfName').value=$('cfEmail').value=$('cfSubject').value=$('cfMessage').value='';
}

/* ══════════════════════════════════════════════════════════════
   STATS
   ══════════════════════════════════════════════════════════════ */
function updateStats() {
  const p = $('statProjects'), id = $('statIdeas');
  if (p) { p.dataset.target = state.repos.length; animateCounter(p); }
  if (id){ id.dataset.target = state.ideas.length; animateCounter(id); }
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target)||0;
  let cur=0; const step=Math.max(1,Math.ceil(target/28));
  const t=setInterval(()=>{ cur=Math.min(cur+step,target); el.textContent=cur; if(cur>=target)clearInterval(t); },42);
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('revealed'); obs.unobserve(e.target); } });
  }, { threshold:.08, rootMargin:'0px 0px -40px 0px' });

  function observeAll() { $a('.scroll-reveal:not(.revealed)').forEach(el=>obs.observe(el)); }
  observeAll();
  new MutationObserver(()=>setTimeout(observeAll,60))
    .observe($('mainContent'),{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
}

function revealVisible() {
  $a('.scroll-reveal:not(.revealed)').forEach(el=>{
    if (el.getBoundingClientRect().top < window.innerHeight*.92) el.classList.add('revealed');
  });
}
window.addEventListener('scroll', revealVisible, {passive:true});

/* ══════════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════════ */
let toastT;
function showToast(msg, dur=2800) {
  const t=$('toast'); t.textContent=msg; t.classList.add('visible');
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('visible'),dur);
}

/* ══════════════════════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════════════════════ */
function esc(s) {
  if (s==null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

/* ── Console greeting ── */
console.log('%cNOΣIS', 'color:#5b8fff;font-size:20px;font-weight:bold;font-family:monospace;letter-spacing:.2em');
console.log('%cThink Deeper. Build Smarter.', 'color:#7d8fa8;font-family:monospace;font-size:12px;letter-spacing:.15em');
