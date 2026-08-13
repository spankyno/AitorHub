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
  build: {
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor code dynamically
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            return 'vendor'; // everything else from node_modules
          }
        },
      },
    },
    // Enable minification optimizations
    minify: 'esbuild',
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
});
