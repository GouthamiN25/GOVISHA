// vite.config.ts
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env vars like GEMINI_API_KEY from .env.local, .env, etc.
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.GEMINI_API_KEY;

  return {
    // IMPORTANT for GitHub Pages: repo name as base path
    base: '/GOVISHA/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Make the API key available in the bundle
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
