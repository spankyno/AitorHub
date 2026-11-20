import path from 'path';
import { existsSync, readFileSync } from 'node:fs';
import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// No environment variables are injected into the client bundle.

// Replica en local lo que hace Vercel en producción:
//  - cleanUrls: /privacidad -> privacidad.html (dev y preview)
//  - rutas inexistentes -> 404.html con estado 404 (solo preview; el servidor de dev hace fallback a index.html)
const vercelLikeRouting = (): Plugin => {
  const cleanUrls: Connect.NextHandleFunction = (req, _res, next) => {
    if (req.url && /^\/privacidad(\?|$)/.test(req.url)) {
      req.url = req.url.replace('/privacidad', '/privacidad.html');
    }
    next();
  };

  return {
    name: 'vercel-like-routing',
    configureServer: (server) => void server.middlewares.use(cleanUrls),
    configurePreviewServer: (server) => {
      const outDir = path.resolve(server.config.root, server.config.build.outDir);
      const notFoundPage = path.join(outDir, '404.html');
      server.middlewares.use(cleanUrls);
      server.middlewares.use((req, res, next) => {
        let pathname: string;
        try {
          pathname = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/');
        } catch {
          return next();
        }
        const file = path.join(outDir, pathname);
        if (pathname === '/' || !file.startsWith(outDir) || existsSync(file) || !existsSync(notFoundPage)) {
          return next();
        }
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(notFoundPage));
      });
    },
  };
};

export default defineConfig({
  server: {
    port: 3000, // escucha solo en localhost (antes host: '0.0.0.0' abría el servidor a toda la red local)
  },
  plugins: [react(), vercelLikeRouting()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    // Páginas HTML: el hub (SPA), la política de privacidad y la página 404 (estáticas).
    // Sin manualChunks ni ajustes de minificado: los valores por defecto de Vite bastan.
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        privacidad: path.resolve(__dirname, 'privacidad.html'),
        notFound: path.resolve(__dirname, '404.html'),
      },
    },
  },
});
