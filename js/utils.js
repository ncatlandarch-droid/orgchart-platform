/* ============================================
 * ORGCHART PLATFORM — Utility Functions
 * ============================================ */

const OC = window.OC || {};
window.OC = OC;

/* ── DOM Helpers ──────────────────────────── */
OC.Utils = {
  $(sel, ctx) { return (ctx || document).querySelector(sel); },
  $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); },

  el(tag, attrs, ...children) {
    const elem = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class' || k === 'className') elem.className = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(elem.style, v);
        else if (k.startsWith('on')) elem.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'dataset') Object.assign(elem.dataset, v);
        else if (k === 'innerHTML') elem.innerHTML = v;
        else elem.setAttribute(k, v);
      });
    }
    children.forEach(c => {
      if (c == null) return;
      if (typeof c === 'string') elem.appendChild(document.createTextNode(c));
      else if (Array.isArray(c)) c.forEach(ch => ch && elem.appendChild(ch));
      else elem.appendChild(c);
    });
    return elem;
  },

  svgEl(tag, attrs) {
    const ns = 'http://www.w3.org/2000/svg';
    const elem = document.createElementNS(ns, tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => elem.setAttribute(k, v));
    return elem;
  },

  empty(elem) {
    while (elem.firstChild) elem.removeChild(elem.firstChild);
    return elem;
  },

  debounce(fn, delay = 250) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  throttle(fn, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  getInitials(name) {
    if (!name) return '?';
    return name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  },

  slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  },

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

/* ── SVG Icon Library ─────────────────────── */
OC.Icons = {
  // Using inline SVG for zero-dependency icons
  _svg(paths, size = 16) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  },

  chevronRight(s)   { return this._svg('<path d="M9 18l6-6-6-6"/>', s); },
  chevronDown(s)    { return this._svg('<path d="M6 9l6 6 6-6"/>', s); },
  chevronLeft(s)    { return this._svg('<path d="M15 18l-6-6 6-6"/>', s); },
  chevronUp(s)      { return this._svg('<path d="M18 15l-6-6-6 6"/>', s); },
  search(s)         { return this._svg('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>', s); },
  x(s)              { return this._svg('<path d="M18 6L6 18"/><path d="M6 6l12 12"/>', s); },
  plus(s)           { return this._svg('<path d="M12 5v14"/><path d="M5 12h14"/>', s); },
  minus(s)          { return this._svg('<path d="M5 12h14"/>', s); },
  users(s)          { return this._svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', s); },
  user(s)           { return this._svg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', s); },
  building(s)       { return this._svg('<rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>', s); },
  award(s)          { return this._svg('<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>', s); },
  target(s)         { return this._svg('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', s); },
  briefcase(s)      { return this._svg('<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', s); },
  bookOpen(s)       { return this._svg('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>', s); },
  gradCap(s)        { return this._svg('<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/>', s); },
  network(s)        { return this._svg('<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>', s); },
  treeView(s)       { return this._svg('<path d="M12 3v18"/><path d="M8 7h8"/><path d="M6 11h12"/><path d="M4 15h16"/><path d="M2 19h20"/>', s); },
  grid(s)           { return this._svg('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>', s); },
  download(s)       { return this._svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>', s); },
  upload(s)         { return this._svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>', s); },
  edit(s)           { return this._svg('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>', s); },
  settings(s)       { return this._svg('<circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>', s); },
  zoomIn(s)         { return this._svg('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/>', s); },
  zoomOut(s)        { return this._svg('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/>', s); },
  maximize(s)       { return this._svg('<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>', s); },
  printer(s)        { return this._svg('<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>', s); },
  menu(s)           { return this._svg('<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>', s); },
  panelLeft(s)      { return this._svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>', s); },
  info(s)           { return this._svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>', s); },
  arrowUp(s)        { return this._svg('<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>', s); },
  filter(s)         { return this._svg('<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>', s); },
  shield(s)         { return this._svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', s); },
  fileText(s)       { return this._svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>', s); },
  globe(s)          { return this._svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', s); },
  trash(s)          { return this._svg('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>', s); },
  save(s)           { return this._svg('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>', s); },
  chart(s)          { return this._svg('<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>', s); },
  warning(s)        { return this._svg('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', s); },
};
