/* ============================================
 * ORGCHART PLATFORM — Theme Engine
 * ============================================ */

OC.Theme = (function() {
  const { Events } = OC;

  function applyTheme(config) {
    const root = document.documentElement;
    const t = config.theme;

    root.style.setProperty('--primary', t.primaryColor);
    root.style.setProperty('--primary-light', t.primaryLight);
    root.style.setProperty('--primary-dark', t.primaryDark);
    root.style.setProperty('--accent', t.accentColor);
    root.style.setProperty('--accent-dark', t.accentDark);

    if (t.mode === 'light') {
      root.style.setProperty('--surface-base', '#f5f7fa');
      root.style.setProperty('--surface-elevated', '#ffffff');
      root.style.setProperty('--surface-card', '#f0f2f5');
      root.style.setProperty('--surface-card-hover', '#e8eaed');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#6b7280');
      root.style.setProperty('--text-muted', '#9ca3af');
      root.style.setProperty('--glass-bg', 'rgba(255,255,255,0.75)');
      root.style.setProperty('--border-subtle', 'rgba(0,0,0,0.06)');
      root.style.setProperty('--border-default', 'rgba(0,0,0,0.1)');
      root.style.setProperty('--border-strong', 'rgba(0,0,0,0.15)');
    }
  }

  return {
    init() {
      applyTheme(CONFIG);
    },
    apply: applyTheme
  };
})();

/* ============================================
 * ORGCHART PLATFORM — i18n Engine
 * ============================================ */

OC.I18n = (function() {
  let locale = 'en';
  let strings = {};

  return {
    init() {
      locale = CONFIG.i18n.defaultLocale || 'en';
      strings = CONFIG.i18n.strings || {};
    },

    t(key) {
      return (strings[locale] && strings[locale][key]) || key;
    },

    setLocale(loc) {
      locale = loc;
      OC.Events.emit('i18n:changed', loc);
    },

    getLocale() { return locale; }
  };
})();
