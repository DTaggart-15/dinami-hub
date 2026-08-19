import { describe, expect, it } from 'vitest';
import { createTicker } from '../src/components/ticker.js';
import { siteCopy } from '../src/content/site.js';

describe('AI tools ticker', () => {
  it('renders two matching sequences with one hidden from assistive technology', () => {
    const ticker = createTicker(['ChatGPT', 'Codex']);
    const sequences = ticker.querySelectorAll('.tool-ticker__sequence');

    expect(sequences).toHaveLength(2);
    expect(sequences[1].getAttribute('aria-hidden')).toBe('true');
    expect(sequences[0].textContent).toBe(sequences[1].textContent);
  });

  it('renders the official Grok and Seedream product names', () => {
    const ticker = createTicker(siteCopy.en.tools.items);
    const visibleText = ticker.querySelector('.tool-ticker__sequence:not([aria-hidden])').textContent;

    expect(visibleText).toContain('Grok');
    expect(visibleText).toContain('Seedream');
    expect(visibleText).not.toContain('Groq');
    expect(visibleText).not.toContain('SeaDream');
  });
});
