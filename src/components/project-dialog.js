import { h } from '../lib/dom.js';

const LOCAL_MEDIA_PATH = /^\/media\/[a-z0-9._/-]+$/;

function createMedia(media, language) {
  if (!LOCAL_MEDIA_PATH.test(media.src)) return null;

  if (media.type === 'image') {
    return h('img', {
      attrs: {
        src: media.src,
        alt: media.alt?.[language] ?? '',
        loading: 'lazy',
        decoding: 'async',
      },
    });
  }

  if (media.type === 'video') {
    return h('video', {
      attrs: {
        src: media.src,
        controls: '',
        preload: 'metadata',
      },
    });
  }

  return null;
}

export function createProjectDialog({ getLanguage, getCopy }) {
  const element = h('dialog', { className: 'project-dialog', attrs: { 'aria-labelledby': 'project-dialog-title' } });
  let activeProject = null;
  let savedTrigger = null;

  function restoreFocus() {
    if (savedTrigger?.isConnected) savedTrigger.focus();
    savedTrigger = null;
  }

  function render() {
    if (!activeProject) return;

    const language = getLanguage();
    const site = getCopy();
    const project = activeProject.copy[language];
    const mediaItems = activeProject.media.map((item) => createMedia(item, language)).filter(Boolean);
    const closeButton = h('button', {
      className: 'project-dialog__close',
      text: site.actions.close,
      attrs: { type: 'button', 'aria-label': site.actions.close },
    });
    closeButton.addEventListener('click', close);

    const gallery = mediaItems.length
      ? h('div', { className: 'project-dialog__media' }, mediaItems)
      : h('p', { className: 'project-dialog__empty', text: site.dialog.empty });

    element.replaceChildren(
      h('div', { className: 'project-dialog__panel' }, [
        h('div', { className: 'project-dialog__topline' }, [
          h('p', { className: 'eyebrow', text: project.type ?? '' }),
          closeButton,
        ]),
        h('h2', { text: project.title, attrs: { id: 'project-dialog-title' } }),
        h('p', { className: 'project-dialog__detail', text: project.detail ?? project.description ?? '' }),
        h('ul', { className: 'project-dialog__tags', attrs: { 'aria-label': 'Tags' } },
          activeProject.tags.map((tag) => h('li', { text: tag }))),
        gallery,
      ]),
    );
  }

  function open(project, trigger = null) {
    activeProject = project;
    savedTrigger = trigger;
    render();

    if (!element.hasAttribute('open')) {
      if (typeof element.showModal === 'function') element.showModal();
      else element.setAttribute('open', '');
    }

    element.querySelector('.project-dialog__close')?.focus();
  }

  function close() {
    if (element.hasAttribute('open') && typeof element.close === 'function') {
      element.close();
      return;
    }

    element.removeAttribute('open');
    restoreFocus();
  }

  element.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  element.addEventListener('close', restoreFocus);
  element.addEventListener('click', (event) => {
    if (event.target === element) close();
  });

  return {
    element,
    open,
    close,
    refresh: render,
    isOpen: () => element.hasAttribute('open'),
  };
}
