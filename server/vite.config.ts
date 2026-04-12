import { defineConfig } from 'vite-plus';
import { sharedFmt, sharedLintRules } from '../vp-shared.ts';

export default defineConfig({
  fmt: {
    ...sharedFmt,
    ignorePatterns: ['node_modules/'],
  },
  lint: {
    ignorePatterns: ['node_modules/'],
    plugins: ['typescript'],
    rules: {
      ...sharedLintRules,
    },
  },
});
