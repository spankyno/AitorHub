// Valida el catálogo (constants.ts) antes de compilar. Uso: `npm run validate` (también lo ejecuta `npm run build`).
// Carga el TypeScript con el propio Vite (sin compilar nada ni añadir dependencias).
import { createServer } from 'vite';

const server = await createServer({
  logLevel: 'silent',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, watch: null },
});

const errors = [];
const warnings = [];
let total = 0;

const ALLOWED_KEYS = new Set(['id', 'title', 'url', 'description', 'category', 'icon']);
const ID_PATTERN = /^[a-z0-9][a-z0-9_-]*$/;

/** Devuelve un mensaje de error o null. Exige https y forma canónica (p. ej. barra final en URLs de origen). */
const checkUrl = (raw, { allowRelative = false } = {}) => {
  if (typeof raw !== 'string' || !raw.trim()) return 'URL vacía';
  if (allowRelative && raw.startsWith('/') && !raw.startsWith('//')) return null;
  let u;
  try {
    u = new URL(raw);
  } catch {
    return `«${raw}» no es una URL válida`;
  }
  if (u.protocol !== 'https:') return `usa https:// («${raw}»)`;
  if (u.username || u.password) return 'la URL no debe llevar usuario ni contraseña';
  if (u.href !== raw) return `URL no canónica: escríbela como «${u.href}»`;
  return null;
};

try {
  const { LINKS, SOCIAL_LINKS, FOOTER_LINKS } = await server.ssrLoadModule('/constants.ts');
  const { LINK_CATEGORIES } = await server.ssrLoadModule('/types.ts');

  if (!Array.isArray(LINKS) || LINKS.length === 0) {
    errors.push('LINKS debe ser una lista con al menos una herramienta');
  } else {
    total = LINKS.length;
    const seen = { id: new Map(), url: new Map(), title: new Map(), description: new Map() };

    LINKS.forEach((link, i) => {
      const at = `LINKS[${i}]${link && typeof link.id === 'string' && link.id ? ` (id: ${link.id})` : ''}`;
      const fail = (msg) => errors.push(`${at}: ${msg}`);

      if (!link || typeof link !== 'object') return fail('no es un objeto');

      for (const key of Object.keys(link)) {
        if (!ALLOWED_KEYS.has(key)) fail(`campo desconocido «${key}» (permitidos: ${[...ALLOWED_KEYS].join(', ')})`);
      }
      for (const key of ['id', 'title', 'url', 'description']) {
        const value = link[key];
        if (typeof value !== 'string' || !value.trim()) fail(`«${key}» vacío o no es texto`);
        else if (value !== value.trim()) fail(`«${key}» tiene espacios al principio o al final`);
      }
      if (typeof link.id === 'string' && link.id && !ID_PATTERN.test(link.id)) {
        fail(`id «${link.id}» no válido: solo minúsculas, números, «-» y «_»`);
      }
      if (!LINK_CATEGORIES.includes(link.category)) {
        fail(`categoría «${link.category}» no válida (usa una de: ${LINK_CATEGORIES.join(', ')})`);
      }
      if (!link.icon || !['function', 'object'].includes(typeof link.icon)) {
        fail('falta el icono (impórtalo desde lucide-react)');
      }
      const urlProblem = checkUrl(link.url);
      if (urlProblem) fail(`url: ${urlProblem}`);

      // Duplicados: id, url y título son errores; una descripción repetida solo avisa.
      const track = (kind, value, list) => {
        if (typeof value !== 'string' || !value.trim()) return;
        const key = value.trim().toLowerCase();
        const first = seen[kind].get(key);
        if (first !== undefined) list.push(`${at}: ${kind} repetido, ya lo usa LINKS[${first}]`);
        else seen[kind].set(key, i);
      };
      track('id', link.id, errors);
      track('url', link.url, errors);
      track('title', link.title, errors);
      track('description', link.description, warnings);
    });
  }

  for (const [name, group, allowRelative] of [
    ['SOCIAL_LINKS', SOCIAL_LINKS, false],
    ['FOOTER_LINKS', FOOTER_LINKS, true],
  ]) {
    for (const [key, value] of Object.entries(group ?? {})) {
      const problem = checkUrl(value, { allowRelative });
      if (problem) errors.push(`${name}.${key}: ${problem}`);
    }
  }
} catch (error) {
  errors.push(`No se pudo cargar el catálogo: ${error instanceof Error ? error.message : error}`);
} finally {
  await server.close();
}

for (const w of warnings) console.warn(`⚠  ${w}`);
if (errors.length > 0) {
  console.error(`\n✗ Catálogo no válido (${errors.length} ${errors.length === 1 ? 'error' : 'errores'}):`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error('\nCorrígelo en constants.ts / types.ts y vuelve a ejecutar `npm run validate`.');
  process.exit(1);
}
console.log(`✓ Catálogo válido: ${total} herramientas${warnings.length ? ` (${warnings.length} aviso${warnings.length === 1 ? '' : 's'})` : ''}`);
