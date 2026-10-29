import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const validURL = value => /^(https?:\/\/|mailto:)/i.test(value);
const asset = value => { if (!/^(assets\/[a-zA-Z0-9_./-]+|https:\/\/[^\s"<>]+)$/.test(value)) throw new Error(`Invalid asset path: ${value}`); return escape(value); };
const cover = (p, cls = '') => `<img class="${cls}" src="${asset(p.cover)}" alt="${escape(p.coverAlt)}" width="800" height="560" loading="lazy" decoding="async">`;
const projects = data.projects.map((p, i) => `<article class="project-card reveal">
  <button class="project-cover media-button" type="button" data-project="${escape(p.id)}" aria-label="Explore ${escape(p.title)}">${cover(p)}<span class="cover-index">0${i + 1}</span><span class="cover-open">${icon('arrow-up-right')}</span></button>
  <div class="project-info"><span class="eyebrow category">${escape(p.category)}</span><h3>${escape(p.title)}</h3><p>${escape(p.description)}</p>
  <button class="text-link" type="button" data-project="${escape(p.id)}">${i === 2 ? 'A little preview' : 'View project'} ${icon('arrow-up-right')}</button></div></article>`).join('');
const videos = data.videos.map((v, i) => `<article class="video-card reveal">
  <button class="video-cover media-button" type="button" data-video="${escape(v.id)}" aria-label="${v.src ? 'Play' : 'Preview'} ${escape(v.title)}${v.src ? '' : ' — coming soon'}"><img src="${asset(v.poster)}" alt="" width="800" height="500" loading="lazy" decoding="async"><span class="play-circle">${icon('play')}</span>${!v.src ? '<span class="media-status">Coming soon</span>' : ''}</button>
  <div class="video-meta"><span>${escape(v.category)}</span><span>0${i + 1}</span></div><h3><button type="button" data-video="${escape(v.id)}">${escape(v.title)}</button></h3></article>`).join('');
const socials = data.socials.map(s => validURL(s.url)
  ? `<a class="social-link" href="${escape(s.url)}"${s.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${icon(s.icon)}<span>${escape(s.label)}</span>${icon('arrow-up-right')}</a>`
  : `<button class="social-link" type="button" data-social="${escape(s.label)}" aria-label="${escape(s.label)} — link coming soon">${icon(s.icon)}<span>${escape(s.label)}</span>${icon('arrow-up-right')}</button>`).join('');
const exploring = data.exploring.map((s, i) => `<li><span class="explore-number">0${i + 1}</span>${escape(s)}${icon('asterisk')}</li>`).join('');
const resumeIcon = icon('download');
const resumeButton = data.resume?.url
  ? `<a class="button button-resume" href="${asset(data.resume.url)}" download="${escape(data.resume.filename || 'Coco-Huang-Resume.pdf')}">Download Resume ${resumeIcon}</a>`
  : `<button class="button button-resume" type="button" data-resume aria-label="Download Resume — coming soon">Download Resume ${resumeIcon}</button>`;
const template = await readFile(path.join(root, 'src/index.html'), 'utf8');
const replacements = {
  NAME: escape(data.name), TAGLINE: escape(data.tagline), INTRO: escape(data.intro),
  RESUME_BUTTON: resumeButton,
  PORTRAIT: asset(data.portrait.image), PORTRAIT_ALT: escape(data.portrait.alt),
  PORTRAIT_LABEL: data.portrait.placeholder ? '<span class="portrait-label">Portrait placeholder</span>' : '',
  PORTRAIT_CAPTION: escape(data.portrait.caption), FEATURE_POSTER: asset(data.featuredVideo.poster),
  FEATURE_STATUS: escape(data.featuredVideo.src ? 'A little introduction' : data.featuredVideo.comingSoon),
  FEATURE_ARIA: escape(data.featuredVideo.src ? 'Play personal introduction' : 'Preview personal introduction — coming soon'),
  FEATURE_BADGE: data.featuredVideo.src ? 'A little of my story' : 'A story in the making',
  PROJECTS: projects, VIDEOS: videos, EXPLORING: exploring, SOCIALS: socials,
  DATA: JSON.stringify(data).replace(/</g, '\\u003c'), DOMAIN: escape(data.domain)
};
const html = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
  if (!(key in replacements)) throw new Error(`Unknown template key: ${key}`);
  return replacements[key];
});
await mkdir(path.join(root, 'dist'), { recursive: true });
await cp(path.join(root, 'src/assets'), path.join(root, 'dist/assets'), { recursive: true });
await Promise.all(['styles.css', 'app.js', '_headers', '404.html'].map(file => cp(path.join(root, 'src', file), path.join(root, 'dist', file))));
await writeFile(path.join(root, 'dist/index.html'), html);
await writeFile(path.join(root, 'dist/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${data.domain}/sitemap.xml\n`);
await writeFile(path.join(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(data.domain)}/</loc></url></urlset>\n`);
console.log(`Built ${data.name}: static HTML, CSS, JS and local SVG assets → dist/`);
