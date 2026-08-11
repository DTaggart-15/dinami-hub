import { describe, expect, it, vi } from 'vitest';
import { createContactLinks } from '../src/components/contact-links.js';
import { contacts } from '../src/content/contacts.js';
import { siteCopy } from '../src/content/site.js';

describe('contact links', () => {
  it('uses safe links and copies the static Discord handle', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const links = createContactLinks({
      contacts,
      copy: siteCopy.ru,
      clipboard: { writeText },
    });

    expect(links.querySelector('[data-contact="telegram"]').getAttribute('href')).toBe(
      'https://t.me/DinaStam',
    );
    links.querySelector('[data-contact="discord"]').click();

    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('0xDinami'));
    expect(links.querySelector('[role="status"]').textContent).toBe(siteCopy.ru.actions.copied);
  });

  it('reveals a selectable fallback if clipboard permission is denied', async () => {
    const links = createContactLinks({
      contacts,
      copy: siteCopy.en,
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });

    links.querySelector('[data-contact="discord"]').click();

    await vi.waitFor(() => expect(links.querySelector('input').hidden).toBe(false));
    expect(links.querySelector('input').value).toBe('0xDinami');
    expect(links.querySelector('[role="status"]').textContent).toBe(siteCopy.en.dialog.manualCopy);
  });
});
