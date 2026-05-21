import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No environment variables are injected into the client bundle.
// Any secrets (e.g. DATABASE_URL) must only be used in /api/* serverless functions.
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
