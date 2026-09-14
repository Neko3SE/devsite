'use strict';

(function createI18n(global) {
  const locales = new Map();
  const listeners = new Set();
  const storageKey = 'mudagiken.language';
  let currentLanguage = 'ja';

  function getPath(source, path) {
    return path.split('.').reduce((value, key) => value == null ? undefined : value[key], source);
  }

  function format(value, params) {
    if (typeof value !== 'string') return value;
    return value.replace(/\{(\w+)\}/g, (match, key) =>
      Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match
    );
  }

  function register(code, messages) {
    locales.set(code, messages);
  }

  function value(path, params = {}) {
    const selected = locales.get(currentLanguage);
    const fallback = locales.get('ja');
    const found = getPath(selected, path);
    const resolved = found === undefined ? getPath(fallback, path) : found;
    if (resolved === undefined) {
      console.warn(`[i18n] Missing key: ${currentLanguage}.${path}`);
      return path;
    }
    return format(resolved, params);
  }

  function saveLanguage(code) {
    try {
      localStorage.setItem(storageKey, code);
    } catch (_) {
      // Some local-file/private browsing environments do not expose storage.
    }
  }

  function loadLanguage() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && locales.has(saved)) return saved;
    } catch (_) {
      // Fall back to Japanese when storage is unavailable.
    }
    return 'ja';
  }

  function setLanguage(code, options = {}) {
    if (!locales.has(code)) code = 'ja';
    currentLanguage = code;
    document.documentElement.lang = code;
    if (options.save !== false) saveLanguage(code);
    listeners.forEach(listener => listener(code));
  }

  function onChange(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function list() {
    return Array.from(locales.entries()).map(([code, messages]) => ({
      code,
      name: messages.meta.name
    }));
  }

  function init() {
    setLanguage(loadLanguage(), { save: false });
  }

  global.MudaI18n = {
    register,
    value,
    setLanguage,
    getLanguage: () => currentLanguage,
    onChange,
    list,
    init
  };
  global.registerLocale = register;
  global.t = value;
})(window);
