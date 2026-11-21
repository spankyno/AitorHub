// Comprueba que las URLs del catálogo responden. Uso: `npm run check-links`.
// Lo ejecuta el workflow mensual (.github/workflows/link-check.yml). Sale con código 1 si alguna está caída.
//
// Qué cuenta como fallo: error de red/DNS/timeout, 5xx y 4xx "reales" (404, 410…), tras reintentos.
// Avisos (no fallan): 401/403/429 (muchos hosts bloquean peticiones automáticas) y redirecciones a otro dominio.
// Limitación: una página "aparcada" que devuelva 200 no se detecta.
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const USER_AGENT = 'Mozilla/5.0 (compatible; AitorHubLinkCheck/1.0; +https://aitorhub.vercel.app)';
const BLOCKED_STATUSES = new Set([401, 403, 429]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (url, method, timeoutMs) => {
  const response = await fetch(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml,*/*;q=0.8' },
  });
  await response.body?.cancel().catch(() => {}); // solo importa el estado, no el cuerpo
  return response;
};

/**
 * @returns {Promise<{url: string, level: 'ok'|'warn'|'fail', status: number|null, note: string}>}
 */
export const checkUrl = async (url, { timeoutMs = 20_000, retries = 2, retryDelayMs = 1_500 } = {}) => {
  let result = { url, level: 'fail', status: null, note: 'sin respuesta' };

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(retryDelayMs * attempt);
    try {
      let response = await request(url, 'HEAD', timeoutMs);
      // Muchos servidores rechazan HEAD (o responden distinto): se confirma con GET.
      if (response.status >= 400) response = await request(url, 'GET', timeoutMs);

      const { status } = response;
      if (status >= 200 && status < 300) {
        const moved = new URL(response.url).host !== new URL(url).host;
        return moved
          ? { url, level: 'warn', status, note: `redirige a otro dominio: ${response.url}` }
          : { url, level: 'ok', status, note: '' };
      }
      if (BLOCKED_STATUSES.has(status)) {
        return { url, level: 'warn', status, note: 'el servidor rechaza peticiones automáticas; revisar a mano' };
      }
      result = { url, level: 'fail', status, note: `HTTP ${status}` };
      if (status < 500) return result; // 404, 410…: no tiene sentido reintentar
    } catch (error) {
      const reason = error?.cause?.code ?? error?.name ?? 'error de red';
      result = { url, level: 'fail', status: null, note: reason === 'TimeoutError' ? 'timeout' : String(reason) };
    }
  }
  return result;
};

const mapPool = async (items, limit, fn) => {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};

const main = async () => {
  const { createServer } = await import('vite');
  const server = await createServer({
    logLevel: 'silent',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
  });

  let targets;
  try {
    const { LINKS, FOOTER_LINKS } = await server.ssrLoadModule('/constants.ts');
    targets = [
      ...LINKS.map((link) => ({ name: link.title, url: link.url })),
      { name: 'Footer · Blog', url: FOOTER_LINKS.blog },
      { name: 'Footer · Contacto', url: FOOTER_LINKS.contacto },
    ].filter((t) => t.url.startsWith('https://'));
  } finally {
    await server.close();
  }
  targets = targets.filter((t, i) => targets.findIndex((o) => o.url === t.url) === i);

  const options = {
    retries: Number(process.env.LINKCHECK_RETRIES ?? 2),
    timeoutMs: Number(process.env.LINKCHECK_TIMEOUT_MS ?? 20_000),
  };
  console.log(`Comprobando ${targets.length} URLs…`);
  const results = await mapPool(targets, 6, async (target) => ({ ...target, ...(await checkUrl(target.url, options)) }));

  const fails = results.filter((r) => r.level === 'fail');
  const warns = results.filter((r) => r.level === 'warn');
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const summary = `${results.length - fails.length - warns.length} correctas · ${plural(warns.length, 'aviso', 'avisos')} · ${plural(fails.length, 'caída', 'caídas')}`;
  for (const r of warns) console.warn(`⚠  ${r.name} — ${r.url} — ${r.note}`);
  for (const r of fails) console.error(`✗  ${r.name} — ${r.url} — ${r.note}`);
  console.log(`\n${summary}`);

  const table = (rows) =>
    ['| Herramienta | URL | Detalle |', '|---|---|---|', ...rows.map((r) => `| ${r.name} | ${r.url} | ${r.note} |`)].join('\n');
  const report = [
    `## Comprobación de enlaces (${new Date().toISOString().slice(0, 10)})`,
    '',
    `${results.length} URLs: ${summary}.`,
    fails.length ? `\n### Caídas\n\n${table(fails)}` : '',
    warns.length ? `\n### Avisos (revisar a mano)\n\n${table(warns)}` : '',
    '',
  ].join('\n');

  if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, report);
  if (fails.length > 0) {
    await fs.writeFile('link-report.md', report);
    process.exit(1);
  }
};

// Solo se ejecuta al lanzarlo directamente (los tests importan checkUrl sin disparar la comprobación).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
