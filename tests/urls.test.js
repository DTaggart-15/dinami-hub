import { describe, expect, it } from 'vitest';
import { safePublicUrl } from '../src/lib/urls.js';

describe('safePublicUrl', () => {
  it.each(['javascript:alert(1)', 'data:text/html,bad', 'ftp://example.com']) (
    'rejects %s',
    (value) => {
      expect(() => safePublicUrl(value)).toThrow('Unsupported public URL');
    },
  );

  it.each(['https://example.com/', 'mailto:hello@example.com'])('allows %s', (value) => {
    expect(safePublicUrl(value)).toBe(value);
  });
});
