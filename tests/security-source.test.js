import { describe, expect, it } from 'vitest';
import { scanText } from '../scripts/check-security.mjs';

describe('security source scanner', () => {
  it('detects secret-shaped values without exposing them', () => {
    const token = ['ghp', 'A'.repeat(36)].join('_');
    const findings = scanText('src/example.js', `const credential = '${token}';`);

    expect(findings).toContain('secret.github-token');
    expect(JSON.stringify(findings)).not.toContain(token);
  });

  it('detects dangerous source APIs only in executable files', () => {
    const dangerousProperty = ['inner', 'HTML'].join('');
    const sourceFindings = scanText('src/example.js', `node.${dangerousProperty} = value;`);
    const documentationFindings = scanText('docs/example.md', `node.${dangerousProperty} = value;`);

    expect(sourceFindings).toContain('source.html-insertion');
    expect(documentationFindings).not.toContain('source.html-insertion');
  });

  it('accepts clean source and rejects sensitive filenames', () => {
    expect(scanText('src/example.js', 'node.textContent = value;')).toEqual([]);
    expect(scanText('.env', '')).toContain('filename.environment');
    expect(scanText('keys/private.pem', '')).toContain('filename.private-key');
  });
});
