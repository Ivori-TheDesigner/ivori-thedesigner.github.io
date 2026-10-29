(() => {
  const projects = {
    'vittlez.html': ['001', 'Vittlez'],
    'girl-gummy.html': ['002', 'Girl Gummy'],
    'patricks.html': ['003', 'Patrick’s Grocery'],
    'finesse-dayly.html': ['004', 'Finesse Dayly']
  };
  const panel = document.createElement('div');
  panel.className = 'experiment-entry';
  panel.setAttribute('role', 'status');
  panel.setAttribute('aria-live', 'polite');
  panel.innerHTML = '<div class="entry-file"><span class="entry-code"></span><p class="entry-label">OPENING EXPERIMENT</p><h2 class="entry-title"></h2><div class="entry-track" aria-hidden="true"><i></i></div><span class="entry-note">THE DIGITAL LAB / IVORI RAYALE</span></div>';
  document.body.append(panel);
  let navigating = false;
  function reset() {
    navigating = false;
    panel.classList.remove('is-active');
    document.querySelectorAll('.is-opening').forEach(el => el.classList.remove('is-opening'));
  }
  window.addEventListener('pageshow', reset);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.download || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    const project = url.origin === location.origin && projects[url.pathname.split('/').pop()];
    if (!project || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    panel.querySelector('.entry-code').textContent = 'EX. ' + project[0] + ' / CASE FILE';
    panel.querySelector('.entry-title').textContent = project[1];
    link.classList.add('is-opening');
    panel.classList.add('is-active');
    window.setTimeout(() => location.assign(url.href), 720);
  });
})();
