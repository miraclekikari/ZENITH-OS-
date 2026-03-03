import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
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
    // LE BLOC 'DEFINE' EST SUPPRIMÉ. VITE GÈRE CELA AUTOMATIQUEMENT.
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
            ui: ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons'],
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      assetsDir: 'assets',
      sourcemap: true,
    },
    server: {
      port: 3000,
      host: true,
    },
  };
});
