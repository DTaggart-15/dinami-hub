import { afterEach } from 'vitest';

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.lang = 'ru';
  localStorage.clear();
});
