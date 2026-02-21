import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    plugins: [react()],
    resolve: {
      alias: {
        // CORRECTION IMPORTANTE : On pointe maintenant vers './src'
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Définir les types pour import.meta.env
      'import.meta.env': {
        VITE_GEMINI_API_KEY: JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
      },
    },
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
