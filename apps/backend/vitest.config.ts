import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@arsnova/shared-types': path.resolve(__dirname, '../../libs/shared-types/src/index.ts'),
      '@arsnova/api': path.resolve(__dirname, './src/routers/index.ts'),
    },
  },
});
