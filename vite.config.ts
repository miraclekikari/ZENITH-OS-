import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/ZENITH-OS-/',
    plugins: [react()],
    resolve: {
      alias: {
        // CORRECTION IMPORTANTE : On pointe maintenant vers './src'
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
