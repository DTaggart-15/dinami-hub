import { describe, expect, it } from 'vitest';
import { h } from '../src/lib/dom.js';

describe('h', () => {
  it('treats supplied copy as text rather than markup', () => {
    const node = h('p', { text: '<img src=x onerror=alert(1)>' });

    expect(node.textContent).toBe('<img src=x onerror=alert(1)>');
    expect(node.querySelector('img')).toBeNull();
  });

  it('rejects inline event handler attributes', () => {
    expect(() => h('img', { attrs: { onerror: 'alert(1)' } })).toThrow(
      'Unsafe attribute',
    );
  });
});
