// Language handling shared by the alternative design directions.
// Static copy is marked up with data-i18n* attributes and swapped in place;
// data-driven regions (the case studies) subscribe to language changes and
// re-render themselves.

const LANG_STORAGE_KEY = 'anominsight:lang';
const SUPPORTED_LANGS = ['en', 'hu'];

export const getPreferredLang = () => {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(stored)) {
      return stored;
    }
  } catch {
    // Storage blocked (private mode, disabled site data) — fall through to
    // the browser's own language list.
  }

  const browserLangs = navigator.languages || [navigator.language];
  return browserLangs.some((lang) => String(lang).toLowerCase().startsWith('hu')) ? 'hu' : 'en';
};

const storeLangPreference = (lang) => {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Storage blocked — the choice just won't survive a reload this time.
  }
};

const applyAttribute = (dict, selector, attribute, apply) => {
  document.querySelectorAll(selector).forEach((el) => {
    const key = el.getAttribute(attribute);
    const value = key && dict[key];
    if (value) {
      apply(el, value);
    }
  });
};

export function applyTranslations(translations, lang) {
  const dict = translations[lang] || translations.en;
  document.documentElement.lang = lang;

  applyAttribute(dict, '[data-i18n]', 'data-i18n', (el, value) => {
    el.textContent = value;
  });
  applyAttribute(dict, '[data-i18n-aria]', 'data-i18n-aria', (el, value) => {
    el.setAttribute('aria-label', value);
  });
  applyAttribute(dict, '[data-i18n-placeholder]', 'data-i18n-placeholder', (el, value) => {
    el.setAttribute('placeholder', value);
  });
  applyAttribute(dict, '[data-i18n-title]', 'data-i18n-title', (el, value) => {
    el.setAttribute('title', value);
  });
}

// One controller per page. Owns the current language, applies it, and lets
// data-driven sections subscribe so they re-render in the new language.
export function createLanguageController(translations) {
  let currentLang = getPreferredLang();
  const subscribers = new Set();

  const notify = () => {
    subscribers.forEach((fn) => fn(currentLang));
  };

  const apply = () => {
    applyTranslations(translations, currentLang);
    notify();
  };

  return {
    get lang() {
      return currentLang;
    },
    t(key) {
      const dict = translations[currentLang] || translations.en;
      return dict[key] ?? translations.en[key] ?? key;
    },
    subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    set(lang) {
      if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) {
        return;
      }
      currentLang = lang;
      storeLangPreference(currentLang);
      apply();
    },
    toggle() {
      this.set(currentLang === 'en' ? 'hu' : 'en');
    },
    start() {
      apply();
    },
  };
}
