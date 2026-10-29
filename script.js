const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const numberField = document.querySelector('.number-field');
if (!prefersReducedMotion.matches && numberField) {
  const stream = '010110101001101001011001';
  for (let i = 0; i < 28; i += 1) {
    const span = document.createElement('span');
    span.textContent = stream.slice(i % 9, (i % 9) + 14);
    span.style.left = `${24 + ((i * 37) % 76)}%`;
    span.style.setProperty('--duration', `${12 + ((i * 7) % 12)}s`);
    span.style.setProperty('--delay', `${-((i * 13) % 23)}s`);
    span.style.opacity = `${.45 + ((i * 3) % 5) / 10}`;
    numberField.append(span);
  }
}

const stageData = {
  problem: ['01 / 07', 'The Problem', 'Individual lunch orders can create multiple deliveries and a scattered workplace pickup experience.', '?'],
  hypothesis: ['02 / 07', 'The Hypothesis', 'People could choose their own meals within one order window and receive them at a shared drop zone.', '↗'],
  compound: ['03 / 07', 'The Compound', 'Research the lunch routine, ordering needs, competing services, and operational constraints.', '✳'],
  formula: ['04 / 07', 'The Formula', 'Design a clear flow for discovery, individual choice, the countdown, and coordinated drop-off.', '⌁'],
  reaction: ['05 / 07', 'The Reaction', 'I refined the welcome screen to balance Vittlez’s bold personality with a clearer, more trustworthy first impression. An accessibility review also revealed issues with neon-green text contrast, button sizing, and icon hierarchy, prompting adjustments.', '↝'],
  transformation: ['06 / 07', 'The Transformation', 'I brought workplace verification, curated restaurant options, visible order cutoffs, transparent pricing, and drop-zone pickup details into one ordering experience—designed to help employees choose lunch with less uncertainty.', '✦'],
  'lab-notes': ['07 / 07', 'Lab notes', 'Designing Vittlez reinforced how consistent price visibility can build trust throughout an ordering journey. Next time, I would explore more alternatives earlier and build accessibility into the first wireframes. My next planned addition is a restaurant dashboard for managing batch orders and fulfillment.', '✎']
};
const tabs = [...document.querySelectorAll('.stage-tabs [role="tab"]')];
const stageContent = document.querySelector('#stage-content');
function selectStage(tab, moveFocus = false) {
  const stage = stageData[tab.dataset.stage];
  if (!stage || !stageContent) return;
  tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
  stageContent.setAttribute('aria-labelledby', tab.id);
  stageContent.querySelector('.stage-index').textContent = stage[0];
  stageContent.querySelector('h4').textContent = stage[1];
  stageContent.querySelector('p').textContent = stage[2];
  stageContent.querySelector('.stage-doodle').textContent = stage[3];
  if (moveFocus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStage(tab));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); selectStage(tabs[next], true);
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() { nav?.classList.remove('is-open'); menuToggle?.setAttribute('aria-expanded', 'false'); menuToggle?.setAttribute('aria-label', 'Open menu'); }
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const enterButton = document.querySelector('.enter-button');
const labTransition = document.querySelector('.lab-transition');
const experiments = document.querySelector('#experiments');
let transitioning = false;
const vortexCanvas = document.querySelector('.vortex-canvas');
let vortexFrame = 0;
function startVortex() {
  const ctx = vortexCanvas?.getContext('2d');
  if (!ctx) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  vortexCanvas.width = Math.round(width * dpr);
  vortexCanvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cx = width / 2, cy = height / 2;
  const radius = Math.hypot(cx, cy) * 1.15;
  const started = performance.now();
  const symbols = '01011001<>01';
  function render(now) {
    const seconds = (now - started) / 1000;
    ctx.fillStyle = 'rgba(3,3,13,0.32)';
    ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius * .75);
    glow.addColorStop(0, 'rgba(90,30,170,.11)');
    glow.addColorStop(.45, 'rgba(40,45,180,.035)');
    glow.addColorStop(1, 'rgba(3,3,13,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    // Each arm follows a spiral. Perspective grows the characters toward the viewer.
    for (let arm = 0; arm < 24; arm += 1) {
      for (let step = 0; step < 23; step += 1) {
        const depth = ((step / 23 + seconds * (.25 + seconds * .04) + arm * .017) % 1);
        const distance = 22 + depth * depth * radius;
        const angle = arm / 24 * Math.PI * 2 + (1 - depth) * 3.5 - seconds * .85;
        const x = cx + Math.cos(angle) * distance;
        const y = cy + Math.sin(angle) * distance;
        const size = 7 + depth * depth * 24;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.font = `700 ${size}px monospace`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = .18 + depth * .78;
        ctx.fillStyle = arm % 6 === 0 ? '#e2d9ff' : arm % 3 === 0 ? '#ae78ff' : '#6581ff';
        ctx.fillText(symbols[(arm + step + Math.floor(seconds * 7)) % symbols.length], 0, 0);
        ctx.restore();
      }
    }
    if (seconds < 2.65 && transitioning) vortexFrame = requestAnimationFrame(render);
  }
  ctx.fillStyle = '#03030d';
  ctx.fillRect(0, 0, width, height);
  vortexFrame = requestAnimationFrame(render);
}
enterButton?.addEventListener('click', () => {
  if (transitioning || !experiments) return;
  if (prefersReducedMotion.matches) { experiments.scrollIntoView({behavior:'auto'}); experiments.focus({preventScroll:true}); return; }
  transitioning = true;
  enterButton.disabled = true;
  labTransition.classList.remove('is-active');
  void labTransition.offsetWidth;
  labTransition.classList.add('is-active');
  startVortex();
  window.setTimeout(() => { experiments.scrollIntoView({behavior:'auto'}); experiments.focus({preventScroll:true}); }, 1700);
  window.setTimeout(() => {
    cancelAnimationFrame(vortexFrame);
    labTransition.classList.remove('is-active');
    transitioning = false;
    enterButton.disabled = false;
  }, 2650);
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); } });
  }, {threshold:.12});
  revealItems.forEach(item => revealObserver.observe(item));
} else revealItems.forEach(item => item.classList.add('in-view'));

const progress = document.querySelector('.progress');
const sections = [...document.querySelectorAll('main > section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
let scrollPending = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  const current = [...sections].reverse().find(section => section.getBoundingClientRect().top < innerHeight * .38);
  navLinks.forEach(link => { const active = current && link.hash === `#${current.id}`; link.classList.toggle('active', !!active); if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  scrollPending = false;
}
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); } }, {passive:true});
updateScroll();

// Native modal preserves keyboard focus and supports Escape to close.
const spatialViewer = document.querySelector('.spatial-viewer');
if (spatialViewer) {
  document.querySelectorAll('.spatial-open').forEach(button => {
    button.addEventListener('click', () => {
      const image = spatialViewer.querySelector('img');
      image.src = button.querySelector('img').src;
      image.alt = button.querySelector('img').alt;
      spatialViewer.showModal();
    });
  });
  spatialViewer.querySelector('.spatial-close').addEventListener('click', () => spatialViewer.close());
  spatialViewer.addEventListener('click', event => { if (event.target === spatialViewer) { const rect = spatialViewer.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) spatialViewer.close(); } });
}
