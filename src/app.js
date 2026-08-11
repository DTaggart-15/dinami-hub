import { createTicker } from './components/ticker.js';
import { siteCopy } from './content/site.js';
import { applyLanguage, persistLanguage, readLanguage } from './lib/language.js';

export function createApp({ document: doc, storage }) {
  let language = readLanguage(storage);
  const languageButtons = [...doc.querySelectorAll('[data-language]')];
  const tickerMount = doc.querySelector('#tool-ticker');

  if (tickerMount) {
    tickerMount.replaceChildren(createTicker(siteCopy[language].tools.items, siteCopy[language].tools.label));
  }

  function renderLanguage(nextLanguage) {
    language = applyLanguage(doc, nextLanguage, siteCopy[nextLanguage] ?? siteCopy.ru);
    const copy = siteCopy[language];
    doc.title = copy.meta.title;
    doc.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta.description);
    doc.querySelector('.tool-ticker')?.setAttribute('aria-label', copy.tools.label);

    languageButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
  }

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const scrollPosition = doc.defaultView?.scrollY ?? 0;
      const nextLanguage = persistLanguage(storage, button.dataset.language);
      renderLanguage(nextLanguage);

      if (scrollPosition > 0) {
        doc.defaultView?.scrollTo({ top: scrollPosition, left: 0, behavior: 'instant' });
      }
    });
  });

  renderLanguage(language);

  return {
    getLanguage: () => language,
    setLanguage: (nextLanguage) => renderLanguage(persistLanguage(storage, nextLanguage)),
  };
}
