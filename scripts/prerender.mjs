// Postproceso del build: prerenderiza el hub y genera el sitemap.
//   vite build                                         -> dist/ (cliente)
//   vite build --ssr entry-server.tsx --outDir .ssr    -> .ssr/ (render en Node)
//   node scripts/prerender.mjs                         -> dist/index.html con las tarjetas + dist/sitemap.xml
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const SITE = 'https://aitorhub.vercel.app';
const root = process.cwd();
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, '.ssr');

// Páginas del sitemap y archivos fuente cuyo cambio modifica su contenido.
const PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0', sources: ['constants.ts', 'App.tsx', 'components', 'images', 'index.html'] },
  { path: '/privacidad', changefreq: 'yearly', priority: '0.3', sources: ['privacidad.html'] },
];

/** Fecha (AAAA-MM-DD) del último commit que tocó esos archivos; si no hay git, la del build. */
const lastmod = (sources) => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    /* sin git: se usa la fecha del build */
  }
  return new Date().toISOString().slice(0, 10);
};

// ---- 1. Prerender del hub ----
const entry = ['entry-server.js', 'entry-server.mjs'].map((f) => path.join(ssrDir, f)).find(existsSync);
if (!entry) throw new Error('No se encontró el bundle SSR en .ssr/. Ejecuta antes `vite build --ssr entry-server.tsx --outDir .ssr`.');
const { render, itemListJsonLd } = await import(pathToFileURL(entry).href);

const htmlPath = path.join(dist, 'index.html');
let html = await fs.readFile(htmlPath, 'utf8');

const EMPTY_ROOT = '<div id="root"></div>';
if (!html.includes(EMPTY_ROOT)) throw new Error('index.html no contiene <div id="root"></div>');
const app = render();
const jsonLd = JSON.stringify(itemListJsonLd()).replace(/</g, '\\u003c'); // evita cerrar el <script> por accidente
html = html
  .replace(EMPTY_ROOT, `<div id="root">${app}</div>`)
  .replace('</head>', `    <script type="application/ld+json">${jsonLd}</script>\n  </head>`);
await fs.writeFile(htmlPath, html);

// ---- 2. Sitemap con lastmod real ----
const urls = PAGES.map(
  (p) => `  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${lastmod(p.sources)}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap);

await fs.rm(ssrDir, { recursive: true, force: true });
const cards = (app.match(/group relative flex flex-col p-6/g) ?? []).length;
console.log(`prerender: index.html con ${(app.length / 1024).toFixed(1)} KB de HTML de la app (${cards} tarjetas), JSON-LD ItemList y sitemap.xml`);
