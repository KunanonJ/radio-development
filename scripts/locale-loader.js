/**
 * Load locale JSON files for a given language. Use in web apps (Node or browser).
 * Usage (browser with fetch):
 *   const t = await loadLocale('th', { baseUrl: '/locales' });
 *   t('common.ok')  // => "ตกลง"
 *
 * Usage (Node with fs):
 *   const { loadLocaleSync } = require('./locale-loader.js');
 *   const t = loadLocaleSync('th', { localesDir: path.join(__dirname, '../locales') });
 */
const DEFAULT_BASE = '../locales';

const MODULES = [
  'common', 'player', 'playlist', 'library', 'scheduler',
  'streaming', 'ads', 'reports', 'errors'
];

/**
 * Flatten loaded modules to module.key -> value. common keys also exposed as key.
 */
function flatten(langData) {
  const out = {};
  for (const [mod, obj] of Object.entries(langData)) {
    if (!obj || obj._meta) continue;
    for (const [k, v] of Object.entries(obj)) {
      if (k === '_meta' || typeof v !== 'string') continue;
      out[`${mod}.${k}`] = v;
      if (mod === 'common') out[k] = v;
    }
  }
  return out;
}

/**
 * Async: load locale for lang. baseUrl = path to locales folder (no trailing slash).
 * Returns t(key) function. Fallback to 'en' for missing keys.
 */
async function loadLocale(lang, options = {}) {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE;
  const fallbackLang = options.fallbackLang ?? 'en';

  const loadModule = async (l, mod) => {
    const url = `${baseUrl}/${l}/${mod}.json`;
    const res = await fetch(url);
    if (!res.ok) return {};
    return res.json();
  };

  const [data, fallback] = await Promise.all([
    Promise.all(MODULES.map(m => loadModule(lang, m))).then(arr => {
      const o = {};
      MODULES.forEach((m, i) => { o[m] = arr[i] || {}; });
      return o;
    }),
    lang !== fallbackLang
      ? Promise.all(MODULES.map(m => loadModule(fallbackLang, m))).then(arr => {
          const o = {};
          MODULES.forEach((m, i) => { o[m] = arr[i] || {}; });
          return o;
        })
      : {}
  ]);

  const flat = flatten(data);
  const flatFallback = flatten(fallback);

  return function t(key) {
    return flat[key] ?? flatFallback[key] ?? key;
  };
}

/**
 * Sync (Node only): load locale from disk. localesDir = path to locales folder.
 */
function loadLocaleSync(lang, options = {}) {
  const fs = require('fs');
  const path = require('path');
  const localesDir = options.localesDir ?? path.join(__dirname, '..', 'locales');
  const fallbackLang = options.fallbackLang ?? 'en';

  const loadModule = (l, mod) => {
    const file = path.join(localesDir, l, `${mod}.json`);
    try {
      const raw = fs.readFileSync(file, 'utf8');
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  const data = {};
  const fallback = {};
  for (const mod of MODULES) {
    data[mod] = loadModule(lang, mod);
    if (lang !== fallbackLang) fallback[mod] = loadModule(fallbackLang, mod);
  }

  const flat = flatten(data);
  const flatFallback = flatten(fallback);

  return function t(key) {
    return flat[key] ?? flatFallback[key] ?? key;
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadLocale, loadLocaleSync, MODULES };
}
