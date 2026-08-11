import { describe, expect, it } from 'vitest';
import { contacts } from '../src/content/contacts.js';
import { projects } from '../src/content/projects.js';
import { siteCopy } from '../src/content/site.js';

function keysOf(value) {
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      child && typeof child === 'object' ? keysOf(child) : true,
    ]),
  );
}

describe('content contract', () => {
  it('ships projects in the approved order with complete bilingual copy', () => {
    expect(projects.map((project) => project.id)).toEqual([
      'follower-forecast',
      'english-portfolio',
      'ai-content-os',
      'creative-lab',
    ]);

    for (const project of projects) {
      expect(project.copy.ru.title).toBeTruthy();
      expect(project.copy.en.title).toBeTruthy();
      expect(project.tags).toHaveLength(3);
    }

    expect(keysOf(siteCopy.ru)).toEqual(keysOf(siteCopy.en));
    expect(siteCopy.ru.hero.title).toBe('Превращаю идеи в работающие системы.');
    expect(siteCopy.en.hero.title).toBe('I turn ideas into working systems.');
  });

  it('contains only the approved public contacts', () => {
    expect(contacts.map((contact) => contact.value)).toEqual([
      'https://t.me/DinaStam',
      'mailto:didinamit.1@gmail.com',
      'https://x.com/0xDinami',
      '0xDinami',
    ]);
  });
});
