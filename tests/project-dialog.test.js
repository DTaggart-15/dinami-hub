import { describe, expect, it } from 'vitest';
import { createProjectDialog } from '../src/components/project-dialog.js';
import { projects } from '../src/content/projects.js';
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

  it('opens Creative Lab with the approved bilingual three-image gallery', () => {
    let language = 'ru';
    const dialog = createProjectDialog({
      getLanguage: () => language,
      getCopy: () => siteCopy[language],
    });
    document.body.append(dialog.element);

    const creativeLab = projects.find((project) => project.id === 'creative-lab');
    dialog.open(creativeLab);

    expect([...dialog.element.querySelectorAll('img')].map((image) => image.getAttribute('src'))).toEqual([
      '/media/creative-lab/floral-suit-portrait.webp',
      '/media/creative-lab/floral-shadow-portrait.webp',
      '/media/creative-lab/mirror-horror-scene.webp',
    ]);
    expect([...dialog.element.querySelectorAll('img')].map((image) => image.alt)).toEqual([
      'Девушка в полосатом костюме среди белых и сиреневых цветов',
      'Девушка в полосатом костюме в свете с тенями цветов',
      'Девушка красится у зеркала, в отражении видна фигура в маске',
    ]);

    language = 'en';
    dialog.refresh();
    expect([...dialog.element.querySelectorAll('img')].map((image) => image.alt)).toEqual([
      'Woman in a pinstripe suit among white and lilac flowers',
      'Woman in a pinstripe suit framed by floral shadows',
      'Woman applying makeup at a mirror with a masked figure in the reflection',
    ]);
  });
});
