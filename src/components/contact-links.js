import { h } from '../lib/dom.js';
import { safePublicUrl } from '../lib/urls.js';

const DISPLAY_VALUES = Object.freeze({
  telegram: '@DinaStam',
  email: 'didinamit.1@gmail.com',
  x: '@0xDinami',
  discord: '0xDinami',
});

export function createContactLinks({ contacts, copy, clipboard }) {
  const status = h('p', {
    className: 'contact-links__status visually-hidden',
    attrs: { role: 'status', 'aria-live': 'polite' },
  });
  const fallback = h('input', {
    className: 'contact-links__fallback',
    attrs: {
      type: 'text',
      value: '0xDinami',
      readonly: '',
      hidden: '',
      'aria-label': 'Discord handle',
    },
  });

  const items = contacts.map((contact) => {
    let control;

    if (contact.kind === 'link') {
      const href = safePublicUrl(contact.value);
      const isWebLink = href.startsWith('https:');
      control = h('a', {
        className: 'contact-link',
        attrs: {
          href,
          ...(isWebLink ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
          'data-contact': contact.id,
        },
        children: [],
      });
    } else {
      control = h('button', {
        className: 'contact-link',
        attrs: { type: 'button', 'data-contact': contact.id },
      });
      control.addEventListener('click', async () => {
        try {
          if (typeof clipboard?.writeText !== 'function') throw new Error('Clipboard unavailable');
          await clipboard.writeText(contact.value);
          status.textContent = copy.actions.copied;
        } catch {
          fallback.hidden = false;
          fallback.focus();
          fallback.select();
          status.textContent = copy.dialog.manualCopy;
        }
      });
    }

    control.append(
      h('span', { className: 'contact-link__label', text: contact.label }),
      h('span', { className: 'contact-link__value', text: DISPLAY_VALUES[contact.id] }),
      h('span', {
        className: 'contact-link__arrow',
        text: contact.kind === 'link' ? '↗' : copy.actions.copy,
        attrs: { 'aria-hidden': 'true' },
      }),
    );

    return control;
  });

  return h('div', { className: 'contact-links' }, [
    h('div', { className: 'contact-links__grid' }, items),
    fallback,
    status,
  ]);
}
