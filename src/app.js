(() => {
  'use strict';
  document.documentElement.classList.add('js-enabled');
  const data = JSON.parse(document.getElementById('site-content').textContent);
  const dialog = document.getElementById('detail-dialog');
  const content = document.getElementById('dialog-content');
  const navigation = document.getElementById('navigation');
  const menu = document.querySelector('.menu-toggle');
  const status = document.getElementById('site-status');
  let statusTimer;
  let lastTrigger;
  const escape = value => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const safeURL = value => /^(https?:\/\/|mailto:)/i.test(value || '');
  const safeMedia = value => /^(assets\/[a-zA-Z0-9_./-]+|https:\/\/[^\s"<>]+)$/.test(value || '');
  const closeMenu = () => { navigation.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  window.matchMedia('(min-width: 681px)').addEventListener('change', closeMenu);

  const showStatus = message => {
    clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.add('visible');
    statusTimer = setTimeout(() => status.classList.remove('visible'), 4200);
  };
  const makeVideo = (video, title) => {
    const element = document.createElement('video');
    element.className = 'dialog-video';
    element.controls = true;
    element.playsInline = true;
    element.preload = 'none';
    element.setAttribute('aria-label', title);
    element.src = video.src;
    if (safeMedia(video.poster)) element.poster = video.poster;
    if (safeMedia(video.captions)) {
      const track = document.createElement('track');
      track.kind = 'captions'; track.src = video.captions; track.srclang = 'en'; track.label = 'English'; track.default = true;
      element.append(track);
    }
    const fallback = document.createElement('p');
    const link = document.createElement('a');
    link.href = video.src; link.textContent = 'Open the video'; fallback.append(link); element.append(fallback);
    element.addEventListener('error', () => {
      const note = document.createElement('p');
      note.className = 'dialog-media-note'; note.setAttribute('role', 'status');
      note.textContent = 'This video is temporarily unavailable. Please try again later.';
      element.after(note);
    }, { once: true });
    return element;
  };
  const showDialog = (html, trigger) => {
    lastTrigger = trigger;
    content.innerHTML = html;
    dialog.showModal();
    dialog.querySelector('.dialog-close').focus({ preventScroll: true });
  };
  document.addEventListener('click', event => {
    const projectTrigger = event.target.closest('[data-project]');
    if (projectTrigger) {
      const p = data.projects.find(item => item.id === projectTrigger.dataset.project);
      if (!p) return;
      showDialog(`<img class="dialog-cover" src="${escape(p.cover)}" alt="${escape(p.coverAlt)}" width="800" height="560"><div class="dialog-body"><span class="eyebrow">${escape(p.category)}</span><h2 id="dialog-title">${escape(p.title)}</h2><p>${escape(p.detail)}</p>${safeURL(p.url) ? `<a class="button button-primary" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Visit project ↗</a>` : `<div class="dialog-status">${escape(p.status)} · More to share soon</div>`}</div>`, projectTrigger);
      if (safeMedia(p.demo?.src)) content.querySelector('.dialog-body').append(makeVideo(p.demo, `${p.title} demo`));
      return;
    }
    const videoTrigger = event.target.closest('[data-video]');
    if (videoTrigger) {
      const v = [data.featuredVideo, ...data.videos].find(item => item.id === videoTrigger.dataset.video);
      if (!v) return;
      const playable = safeMedia(v.src);
      showDialog(`${playable ? '' : `<img class="dialog-cover" src="${escape(v.poster)}" alt="" width="800" height="450">`}<div class="dialog-body"><span class="eyebrow">${escape(v.category || 'A little introduction')}</span><h2 id="dialog-title">${escape(v.title)}</h2><p>${escape(v.description)}</p>${playable ? '' : `<div class="dialog-status">${escape(v.comingSoon)}</div>`}</div>`, videoTrigger);
      if (playable) {
        const video = makeVideo(v, v.title);
        content.prepend(video);
        video.play().catch(() => {});
      }
      return;
    }
    const social = event.target.closest('[data-social]');
    if (social) showStatus(`${social.dataset.social} link is coming soon. Thanks for stopping by!`);
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    content.querySelectorAll('video').forEach(video => { video.pause(); video.removeAttribute('src'); video.load(); });
    content.replaceChildren();
    lastTrigger?.focus({ preventScroll: true });
  });
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
  if (data.socials.every(s => safeURL(s.url))) document.querySelector('.social-note>span').hidden = true;
})();
