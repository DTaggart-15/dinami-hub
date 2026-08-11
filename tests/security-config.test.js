import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('deployment security boundary', () => {
  it('defines restrictive headers for every route', async () => {
    const config = JSON.parse(
      await readFile(resolve('vercel.json'), 'utf8'),
    );
    const globalHeaders = config.headers.find((entry) => entry.source === '/(.*)')?.headers;
    const headers = Object.fromEntries(
      (globalHeaders ?? []).map(({ key, value }) => [key.toLowerCase(), value]),
    );

    expect(headers['content-security-policy']).toContain("default-src 'none'");
    expect(headers['content-security-policy']).toContain("script-src 'self'");
    expect(headers['content-security-policy']).toContain("object-src 'none'");
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
  });
});
