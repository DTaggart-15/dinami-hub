import { createTicker } from './components/ticker.js';
import { createProjectDialog } from './components/project-dialog.js';
import { createProjectGrid } from './components/project-grid.js';
import { projects } from './content/projects.js';
import { contacts } from './content/contacts.js';
import { siteCopy } from './content/site.js';
import { applyLanguage, persistLanguage, readLanguage } from './lib/language.js';
import { updateMetadata } from './lib/metadata.js';

export function createApp({ document: doc, storage }) {
  let language = readLanguage(storage);
  const languageButtons = [...doc.querySelectorAll('[data-language]')];
  const tickerMount = doc.querySelector('#tool-ticker');
  const projectMount = doc.querySelector('#project-grid');
  const dialogMount = doc.querySelector('#dialog-root');
  const contactMount = doc.querySelector('#contact-list');

  if (tickerMount) {
    tickerMount.replaceChildren(createTicker(siteCopy[language].tools.items, siteCopy[language].tools.label));
  }

  const projectDialog = createProjectDialog({
    getLanguage: () => language,
    getCopy: () => siteCopy[language],
  });
  dialogMount?.replaceChildren(projectDialog.element);

  function renderProjects() {
    if (!projectMount) return;
    projectMount.replaceChildren(
      createProjectGrid({
        projects,
        language,
        copy: siteCopy[language],
        onOpen: (project, trigger) => projectDialog.open(project, trigger),
      }),
    );
  }

  function renderContacts() {
    contactMount?.replaceChildren(
      createContactLinks({
        contacts,
        copy: siteCopy[language],
        clipboard: doc.defaultView?.navigator?.clipboard,
      }),
    );
  }

  function renderLanguage(nextLanguage) {
    language = applyLanguage(doc, nextLanguage, siteCopy[nextLanguage] ?? siteCopy.ru);
    const copy = siteCopy[language];
    updateMetadata(doc, copy.meta);
    doc.querySelector('.tool-ticker')?.setAttribute('aria-label', copy.tools.label);
    renderProjects();
    renderContacts();
    if (projectDialog.isOpen()) projectDialog.refresh();

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
    projectDialog,
  };
}
import { createContactLinks } from './components/contact-links.js';
