export const STORAGE_KEY = 'dinami-hub-language';
export const DEFAULT_LANGUAGE = 'ru';

const SUPPORTED_LANGUAGES = new Set(['ru', 'en']);

export function readLanguage(storage) {
  try {
    const value = storage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.has(value) ? value : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function applyLanguage(doc, language, copy) {
  const nextLanguage = SUPPORTED_LANGUAGES.has(language) ? language : DEFAULT_LANGUAGE;
  doc.documentElement.lang = nextLanguage;

  doc.querySelectorAll('[data-i18n]').forEach((node) => {
    const value = node.dataset.i18n
      .split('.')
      .reduce((item, key) => item?.[key], copy);

    if (typeof value === 'string') node.textContent = value;
  });

  return nextLanguage;
}

export function persistLanguage(storage, language) {
  if (!SUPPORTED_LANGUAGES.has(language)) return DEFAULT_LANGUAGE;

  try {
    storage.setItem(STORAGE_KEY, language);
  } catch {
    // The selected language still applies for this page view.
  }

  return language;
}
