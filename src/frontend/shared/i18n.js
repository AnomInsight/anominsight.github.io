// Language handling shared by the alternative design directions.
// Static copy is marked up with data-i18n* attributes and swapped in place;
// data-driven regions (the case studies) subscribe to language changes and
// re-render themselves.

const LANG_STORAGE_KEY = 'anominsight:lang';
const SUPPORTED_LANGS = ['en', 'hu'];

const LANG_PARAM = 'lang';

// The language also travels in the URL (?lang=en), so it survives page changes
// even where storage is blocked or not shared: embedded preview panes,
// private windows, or the same site opened under another host or port.
const getUrlLang = () => {
  try {
    const value = new URL(window.location.href).searchParams.get(LANG_PARAM);
    return SUPPORTED_LANGS.includes(value) ? value : null;
  } catch {
    return null;
  }
};

export const getPreferredLang = () => {
  const fromUrl = getUrlLang();
  if (fromUrl) {
    return fromUrl;
  }

  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(stored)) {
      return stored;
    }
  } catch {
    // Storage blocked (private mode, disabled site data) - fall through to
    // the browser's own language list.
  }

  const browserLangs = navigator.languages || [navigator.language];
  return browserLangs.some((lang) => String(lang).toLowerCase().startsWith('hu')) ? 'hu' : 'en';
};

const storeLangPreference = (lang) => {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Storage blocked - the choice just won't survive a reload this time.
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

// Writes the current language into this page's URL (so a reload keeps it) and
// into every link to another page of the site (so navigation carries it).
// External links, mailto: and same-page #anchors are left alone.
const syncLangInUrls = (lang) => {
  try {
    const here = new URL(window.location.href);
    if (here.searchParams.get(LANG_PARAM) !== lang) {
      here.searchParams.set(LANG_PARAM, lang);
      window.history.replaceState(window.history.state, '', here);
    }

    document.querySelectorAll('a[href]').forEach((link) => {
      const raw = link.getAttribute('href');
      if (!raw || raw.startsWith('#') || /^(mailto|tel|javascript):/i.test(raw)) {
        return;
      }
      const target = new URL(raw, window.location.href);
      const isSitePage = target.origin === here.origin && /(\.html|\/)$/.test(target.pathname);
      if (!isSitePage) {
        return;
      }
      target.searchParams.set(LANG_PARAM, lang);
      link.setAttribute('href', target.href);
    });
  } catch {
    // URL or History API unavailable - storage alone will have to do.
  }
};

// One controller per page. Owns the current language, applies it, and lets
// data-driven sections subscribe so they re-render in the new language.
export function createLanguageController(translations) {
  let currentLang = getPreferredLang();
  // A language arriving via the URL (a shared link, or another page of the
  // site) becomes the stored preference too.
  if (getUrlLang()) {
    storeLangPreference(currentLang);
  }
  const subscribers = new Set();

  const notify = () => {
    subscribers.forEach((fn) => fn(currentLang));
  };

  const apply = () => {
    applyTranslations(translations, currentLang);
    syncLangInUrls(currentLang);
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
