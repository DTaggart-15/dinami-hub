import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

describe('document foundation', () => {
  it('renders a Russian-first semantic shell without inline execution', async () => {
    const html = await readFile(resolve('index.html'), 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    expect(document.documentElement.lang).toBe('ru');
    expect(document.querySelector('main')).not.toBeNull();
    expect(document.querySelector('h1')?.textContent).toContain('Дина');
    expect(document.querySelector('script[type="module"]')?.getAttribute('src')).toBe(
      '/src/main.js',
    );
    expect(document.querySelectorAll('[onload], [onclick], [onerror]')).toHaveLength(0);
    expect([...document.scripts].every((script) => script.src)).toBe(true);
  });
});
