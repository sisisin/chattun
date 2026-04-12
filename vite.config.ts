import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    'front/**': 'pnpm --filter chattun-front exec vp check --fix',
    'server/**': 'pnpm --filter chattun-server exec vp check --fix',
    '.github/**': 'pinact run',
  },
});
