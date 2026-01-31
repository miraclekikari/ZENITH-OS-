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
        // Cela permet à Vite de trouver tes fichiers à la racine
        '@': path.resolve(__dirname, './'),
      },
    },
  };
});
