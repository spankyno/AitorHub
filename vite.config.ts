import path from 'path';
import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// No environment variables are injected into the client bundle.

// En Vercel `cleanUrls` sirve /privacidad -> privacidad.html. Esto lo replica en dev y preview.
const cleanUrls = (): Plugin => {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    if (req.url && /^\/privacidad(\?|$)/.test(req.url)) {
      req.url = req.url.replace('/privacidad', '/privacidad.html');
    }
    next();
  };
  return {
    name: 'clean-urls',
    configureServer: (server) => void server.middlewares.use(rewrite),
    configurePreviewServer: (server) => void server.middlewares.use(rewrite),
  };
};

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), cleanUrls()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    // Dos páginas HTML: el hub (SPA) y la política de privacidad (estática).
    // Sin manualChunks ni ajustes de minificado: los valores por defecto de Vite bastan.
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        privacidad: path.resolve(__dirname, 'privacidad.html'),
      },
    },
  },
});
