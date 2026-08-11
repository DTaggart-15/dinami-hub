import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyLanguage,
  persistLanguage,
  readLanguage,
  STORAGE_KEY,
} from '../src/lib/language.js';

describe('language runtime', () => {
  beforeEach(() => {
    const heading = document.createElement('h1');
    heading.dataset.i18n = 'hero.title';
    heading.textContent = 'Русский';
    document.body.replaceChildren(heading);
  });

  it('defaults invalid or unavailable storage to Russian', () => {
    localStorage.setItem(STORAGE_KEY, 'de');
    expect(readLanguage(localStorage)).toBe('ru');
    expect(readLanguage({ getItem: () => { throw new Error('blocked'); } })).toBe('ru');
  });

  it('persists a supported language', () => {
    expect(persistLanguage(localStorage, 'en')).toBe('en');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
  });

  it('updates text and document language without HTML insertion', () => {
    const payload = '<img src=x onerror=alert(1)>';
    applyLanguage(document, 'en', { hero: { title: payload } });

    expect(document.documentElement.lang).toBe('en');
    expect(document.querySelector('h1').textContent).toBe(payload);
    expect(document.querySelector('img')).toBeNull();
  });
});
