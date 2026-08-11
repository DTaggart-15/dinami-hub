import { h } from '../lib/dom.js';

export function createTicker(items, label = 'AI tools') {
  const createSequence = (hidden) =>
    h(
      'div',
      {
        className: 'tool-ticker__sequence',
        attrs: hidden ? { 'aria-hidden': 'true' } : {},
      },
      items.map((item) =>
        h('span', { className: 'tool-ticker__item' }, [
          h('span', { className: 'tool-ticker__mark', text: '✦', attrs: { 'aria-hidden': 'true' } }),
          h('span', { text: item }),
        ]),
      ),
    );

  return h('div', { className: 'tool-ticker', attrs: { 'aria-label': label } }, [
    createSequence(false),
    createSequence(true),
  ]);
}
