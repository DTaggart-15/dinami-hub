import { describe, expect, it, vi } from 'vitest';
import { createProjectGrid } from '../src/components/project-grid.js';
import { projects } from '../src/content/projects.js';
import { siteCopy } from '../src/content/site.js';

describe('project folder grid', () => {
  it('uses links for live work and buttons for internal work', () => {
    const onOpen = vi.fn();
    const grid = createProjectGrid({
      projects,
      language: 'ru',
      copy: siteCopy.ru,
      onOpen,
    });
    const controls = [...grid.querySelectorAll('.project-folder__action')];

    expect(controls.map((control) => control.tagName)).toEqual(['A', 'A', 'BUTTON', 'BUTTON']);
    expect(controls[0].rel).toContain('noopener');
    expect(controls[0].rel).toContain('noreferrer');

    controls[2].click();
    expect(onOpen).toHaveBeenCalledWith(projects[2], controls[2]);
  });
});
