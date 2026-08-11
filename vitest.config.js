import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    clearMocks: true,
    exclude: ['tests/e2e/**', '.worktrees/**', 'node_modules/**'],
  },
});
