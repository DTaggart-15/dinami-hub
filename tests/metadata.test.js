import { describe, expect, it } from 'vitest';
import { updateMetadata } from '../src/lib/metadata.js';

function appendMeta(attribute, name) {
  const meta = document.createElement('meta');
  meta.setAttribute(attribute, name);
  document.head.append(meta);
}

describe('localized metadata', () => {
  it('synchronizes document and social metadata', () => {
    appendMeta('name', 'description');
    appendMeta('property', 'og:title');
    appendMeta('property', 'og:description');
    appendMeta('name', 'twitter:title');
    appendMeta('name', 'twitter:description');

    updateMetadata(document, { title: 'Dina Mi', description: 'AI products' });

    expect(document.title).toBe('Dina Mi');
    expect(document.querySelector('meta[name="description"]').content).toBe('AI products');
    expect(document.querySelector('meta[property="og:title"]').content).toBe('Dina Mi');
    expect(document.querySelector('meta[name="twitter:description"]').content).toBe('AI products');
  });
});
