import { defineConfig } from 'vitest/config';

const config = defineConfig({
  test: {
    globals: true,
    dir: 'src',
    include: ['**/*.spec.ts'],
    isolate: true,
    coverage: {
      cleanOnRerun: true,
      enabled: false,
      exclude: ['**/fixtures/**', '**/injection/**', '**/mikroOrm/model/**', '**/main.ts', '**/migrations/**'],
      provider: 'istanbul',
      include: ['**/src/**'],
      reportsDirectory: 'coverage',
      thresholds: {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0,
      },
    },
  },
});

export default config;
