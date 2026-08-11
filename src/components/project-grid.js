import { h } from '../lib/dom.js';
import { safePublicUrl } from '../lib/urls.js';

function createAction(project, copy, onOpen) {
  if (project.action === 'external') {
    return h('a', {
      className: 'project-folder__action',
      text: `${copy.actions.open} ↗`,
      attrs: {
        href: safePublicUrl(project.href),
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    });
  }

  const button = h('button', {
    className: 'project-folder__action',
    text: copy.actions.view,
    attrs: { type: 'button' },
  });
  button.addEventListener('click', () => onOpen(project, button));
  return button;
}

export function createProjectGrid({ projects, language, copy, onOpen }) {
  return h(
    'div',
    { className: 'project-grid' },
    projects.map((project, index) => {
      const projectCopy = project.copy[language];
      const titleId = `project-${project.id}-title`;
      const tagList = h(
        'ul',
        { className: 'project-folder__tags', attrs: { 'aria-label': 'Tags' } },
        project.tags.map((tag) => h('li', { text: tag })),
      );

      return h('article', { className: `project-folder project-folder--${project.id}`, attrs: { 'aria-labelledby': titleId } }, [
        h('div', { className: 'project-folder__tab', attrs: { 'aria-hidden': 'true' } }),
        h('div', { className: 'project-folder__topline' }, [
          h('span', { className: 'project-folder__number', text: String(index + 1).padStart(2, '0') }),
          h('span', { className: 'project-folder__status', text: copy.status[project.status] }),
        ]),
        h('p', { className: 'project-folder__type', text: projectCopy.type }),
        h('h3', { text: projectCopy.title, attrs: { id: titleId } }),
        h('p', { className: 'project-folder__description', text: projectCopy.description }),
        tagList,
        createAction(project, copy, onOpen),
      ]);
    }),
  );
}
