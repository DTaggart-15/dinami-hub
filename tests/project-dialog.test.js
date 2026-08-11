import { describe, expect, it } from 'vitest';
import { createProjectDialog } from '../src/components/project-dialog.js';
import { siteCopy } from '../src/content/site.js';

describe('project dialog', () => {
  it('renders empty state and restores focus when closed', () => {
    const trigger = document.body.appendChild(document.createElement('button'));
    trigger.focus();
    const dialog = createProjectDialog({
      getLanguage: () => 'ru',
      getCopy: () => siteCopy.ru,
    });
    document.body.append(dialog.element);

    dialog.open(
      { copy: { ru: { title: 'Lab', detail: 'Детали' } }, tags: [], media: [] },
      trigger,
    );
    expect(dialog.element.hasAttribute('open')).toBe(true);
    expect(dialog.element.textContent).toContain(siteCopy.ru.dialog.empty);

    dialog.close();
    expect(document.activeElement).toBe(trigger);
  });

  it('ignores media outside the local allowlist', () => {
    const dialog = createProjectDialog({
      getLanguage: () => 'en',
      getCopy: () => siteCopy.en,
    });
    document.body.append(dialog.element);

    dialog.open({
      copy: { en: { title: 'Unsafe', detail: 'No remote media' } },
      tags: [],
      media: [{ type: 'image', src: 'https://example.com/tracker.png', alt: { en: 'bad' } }],
    });

    expect(dialog.element.querySelector('img')).toBeNull();
  });
});
