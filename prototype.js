document.querySelectorAll('.prototype-stage').forEach(stage => {
  const launch = stage.querySelector('.prototype-launch');
  if (!launch) return;
  launch.addEventListener('click', () => {
    const status = stage.parentElement.querySelector('.prototype-status');
    const frame = document.createElement('iframe');
    frame.className = 'prototype-frame';
    frame.title = stage.dataset.prototypeTitle;
    frame.src = stage.dataset.prototypeSrc;
    frame.width = '100%';
    frame.height = '760';
    frame.allow = 'fullscreen';
    frame.allowFullscreen = true;
    status.textContent = 'Opening the prototype… Figma may take a moment on slower connections.';
    stage.replaceChildren(frame);
    frame.focus({preventScroll: true});
    frame.addEventListener('load', () => {
      status.textContent = 'Click or tap inside the player to explore. If it’s still loading, give it a moment or open it full screen.';
    }, {once: true});
  }, {once: true});
});
