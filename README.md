

<h1 align="center">Aitor's Hub</h1>

<p align="center">
  Portal central de acceso a todas las herramientas, utilidades y proyectos web de <strong>Aitor Sánchez Gutiérrez</strong>.
</p>

<p align="center">
  <a href="https://aitorhub.vercel.app" target="_blank">🌐 Ver en producción</a> ·
  <a href="https://aitorsanchez.pages.dev" target="_blank">📝 Blog personal</a> ·
  <a href="https://x.com/Kalbo___" target="_blank">🐦 @Kalbo___</a>
</p>

---

## ¿Qué es AitorHub?

AitorHub es un **hub de aplicaciones** rápido y optimizado que centraliza en un único punto todos los proyectos y utilidades desarrollados por Aitor: herramientas de productividad para Excel, procesadores y utilidades de PDF, visores de mapas, utilidades de audio y texto, juegos interactivos y más.

La plataforma cuenta con un motor de búsqueda instantáneo en tiempo real que permite filtrar las herramientas cómodamente y una analítica de uso propia (Cloudflare Worker), sin servicios de analítica de terceros.

### Selección de herramientas destacadas
 
| Herramienta | Descripción | Categoría |
| :--- | :--- | :--- |
| **Excel Merger** | Fusión rápida de múltiples archivos y listas Excel en un único documento. | 📊 Productividad / Excel |
| **Visor GPX** | Visualizador interactivo de rutas a partir de archivos `.gpx`. | 🗺️ Navegación / Mapas |
| **Password GenerAitor** | Generador de contraseñas de alta seguridad enfocado 100% en privacidad (local). | 🔒 Seguridad |
| **Extrae Texto de Imagen (OCR)** | Herramienta para digitalizar y transcribir texto a partir de capturas o fotos. | 🔧 Utilidades |
| **Audio a Texto** | Transcripción inteligente y automatizada de grabaciones de voz. | 🎙️ Multimedia |
| **Juego buscar municipios** | Mapa interactivo educativo para ubicar municipios sobre la geografía. | 🎮 Ocio |
| **Compara Access Database** | Comparación de bases de datos de MS Access. | 🔧 Herramientas |

---

## Stack Tecnológico

La aplicación ha sido optimizada para conseguir el máximo rendimiento en producción (**90+ en Lighthouse Performance**):

- **React 19** & **TypeScript** (`strict`) — Interfaz reactiva y tipada de forma estricta; `npm run typecheck` se ejecuta también antes de cada `build`.
- **Vite 6** — Empaquetador y servidor de desarrollo. Sin configuración de chunks a medida: los valores por defecto bastan.
- **Página 404 propia** — `404.html` se sirve automáticamente en Vercel para cualquier ruta inexistente (con estado 404). Es estática, `noindex`, respeta el tema guardado y trae un buscador que funciona sin JavaScript. `npm run preview` la emula en local.
- **Prerenderizado (SSG)** — `npm run build` genera `dist/index.html` con las 65 tarjetas ya dentro del HTML y el JSON-LD `ItemList` incluido (buscadores y previsualizadores no necesitan ejecutar JavaScript); en el navegador React solo *hidrata*. Funciona sin `react-router` ni librerías extra: `entry-server.tsx` + un build SSR de Vite + `scripts/prerender.mjs`. El catálogo (`constants.ts`) es la fuente única del HTML, del JSON-LD y del sitemap.
- **Tailwind CSS 3** + **PostCSS** + **Autoprefixer** — Estilos CSS compilados y purgados nativamente en el build en lugar de usar librerías en caliente (CDN), eliminando el bloqueo del hilo principal.
- **Inter autoalojada** (`@fontsource-variable/inter`) — Sin peticiones a Google Fonts: la fuente se sirve desde el propio dominio (el navegador solo descarga el subset que necesita, ~48 KB para español).
- **Modo claro/oscuro con botón manual** — Por defecto sigue `prefers-color-scheme` del sistema; el botón (arriba a la derecha, también en `/privacidad`) guarda la elección en `localStorage` (clave `theme`, solo `light` o `dark`). Un script en `<head>` aplica el tema antes del primer pintado, así que no hay destello; si el almacenamiento está bloqueado funciona durante la sesión, y sin JavaScript se sigue al sistema. Se sincroniza entre pestañas y la barra del navegador (`theme-color`) cambia con el tema. Los colores son tokens semánticos (`bg-page`, `bg-surface`, `text-ink`, `text-body`, `text-muted`, `border-edge`, `text-accent`…) definidos en `index.css`; para cambiar la paleta basta con editar esas variables.
- **Accesibilidad (WCAG 2.2 AA)** — Contraste ≥ 4.5:1 en ambos modos, foco visible, enlace «Saltar al contenido», nombres accesibles en las tarjetas, aviso de «se abre en una pestaña nueva», anuncio del número de resultados de búsqueda y respeto de `prefers-reduced-motion`. Verificado con axe-core (0 violaciones).
- **Rendimiento** — Las 65 tarjetas se renderizan de una vez (sin carga diferida artificial); los halos de fondo son degradados radiales animados solo con `transform` (sin `blur` ni `mix-blend-mode`); favicon SVG optimizado con SVGO (101 KB → 17 KB); build con los valores por defecto de Vite.
- **Caché** — Los archivos de `/assets/` llevan hash en el nombre y se sirven con `Cache-Control: immutable` (1 año); `/img/` y el favicon, con 1 día + `stale-while-revalidate`. Ver `vercel.json`.
- **Formato WebP moderno** — Optimización de recursos gráficos reduciendo el tamaño en más de un 60%.
- **Vercel** — Alojamiento estático (`vercel.json` define URLs limpias y cabeceras de seguridad).
- **Cloudflare Workers** — Analítica propia: un único script (`tracker.js`) cargado de forma diferida. Ver [Analítica y privacidad](#analítica-y-privacidad).

---

## Instalación y Desarrollo Local

**Requisitos previos:** Node.js 22 (ver `.nvmrc`)

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/AitorHub.git
cd AitorHub

# 2. Instala dependencias
npm install

# 3. Arranca el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:3000`.

No hay variables de entorno ni backend propio: el proyecto es 100 % estático.

Búsqueda: ignora mayúsculas y tildes ("informacion" encuentra "información").

Scripts: `npm run dev` · `npm run validate` · `npm run typecheck` · `npm run build` · `npm run preview`.

**Versión de Node:** 22 (`engines` en `package.json` y `.nvmrc`; `nvm use` la selecciona). Vercel lee `engines` y usa Node 22.x.

`npm run build` encadena: validación del catálogo → comprobación de tipos → build del cliente (`dist/`) → build SSR (`.ssr/`, temporal) → `scripts/prerender.mjs` (inyecta el HTML y el JSON-LD en `dist/index.html` y genera `dist/sitemap.xml`). En `npm run dev` no hay prerenderizado: la app se monta desde cero, como siempre.

---

## Estructura de Directorios

```
AitorHub/
├── components/
│   ├── Footer.tsx              # Pie de página (Blog, Contacto, Privacidad, copyright)
│   ├── ThemeToggle.tsx         # Botón de modo claro/oscuro
│   └── LinkCard.tsx            # Componente de tarjeta de herramienta
├── public/
│   ├── favicon.ico / favicon.svg   # Favicons (el SVG está optimizado con SVGO)
│   ├── apple-touch-icon.png        # Icono para iOS (180×180)
│   ├── icon-192.png, icon-512.png, icon-maskable-512.png  # Iconos del manifest
│   ├── manifest.webmanifest        # Manifest de la web app
│   ├── robots.txt                  # Reglas para rastreadores
│   └── img/
│       ├── AitorCaricatura.jpg     # Fallback y datos estructurados (URL estable)
│       └── og-banner.jpg           # Imagen para compartir en redes (1200×630)
├── App.tsx                     # Componente y diseño principal
├── constants.ts                # Catálogo de enlaces e información de herramientas
├── types.ts                    # Tipos de TypeScript (LinkItem, LinkCategory)
├── index.tsx                   # Punto de entrada del navegador (hidrata o monta)
├── entry-server.tsx            # Entrada SSR, solo para el build (render + JSON-LD)
├── scripts/
│   ├── validate-catalog.mjs    # Validación del catálogo (npm run validate)
│   └── prerender.mjs           # Postproceso del build: prerender + sitemap.xml
├── index.html                  # Plantilla HTML base (carga el tracker del Worker)
├── 404.html                    # Página de error 404 (estática, noindex, con buscador que lleva a /?q=)
├── .nvmrc                      # Versión de Node (22)
├── privacidad.html             # Política de privacidad (HTML estático) → /privacidad
├── privacidad.ts               # Solo el botón de tema de /privacidad
├── theme.ts                    # Lógica de tema compartida (hub + privacidad)
├── images/                     # Imágenes importadas desde el código (Vite les añade hash)
├── vite-env.d.ts               # Tipos de Vite (imports de imágenes)
├── index.css                   # Punto de importación de estilos Tailwind CSS
├── package.json                # Dependencias y scripts
├── postcss.config.js           # Configuración de PostCSS
├── tailwind.config.js          # Configuración personalizada de Tailwind
├── tsconfig.json               # Configuración de TypeScript
├── vercel.json                 # cleanUrls + cabeceras de seguridad
└── vite.config.ts              # Build de Vite (2 páginas: hub y privacidad)
```

---

## Añadir una nueva herramienta

Edita `constants.ts` e introduce una nueva entrada en la constante `LINKS`:

```ts
{
  id: 'identificador-unico',
  title: 'Título de la Herramienta',
  url: 'https://mi-aplicacion.vercel.app/',
  description: 'Descripción concisa de la utilidad.',
  category: 'tool', // Categorías válidas definidas en types.ts
  icon: NombreIcono, // Importado desde lucide-react
}
```

Recuerda importar el icono en la cabecera de `constants.ts` (`import { NombreIcono } from 'lucide-react'`). Las marcas (Twitter/X, GitHub, etc.) ya no existen en `lucide-react` v1, así que para esos casos usa un SVG propio.

Usa siempre la barra final en las URLs de origen (`https://sitio.app/`).

**Validación del catálogo:** `npm run validate` (y el primer paso de `npm run build`) falla con un mensaje preciso si una entrada tiene: `id` repetido o con formato inválido, URL repetida, no `https` o no canónica (p. ej. sin la barra final), título vacío o repetido, categoría fuera de `LINK_CATEGORIES` (`types.ts`), campos desconocidos (como el antiguo `isExternal`) o sin icono. Una descripción repetida solo genera un aviso. No hay que tocar nada más: el HTML de la tarjeta, el JSON-LD y el sitemap se regeneran en el siguiente `npm run build`.

**`lastmod` del sitemap:** `scripts/prerender.mjs` lo toma de la fecha del último commit de git que modificó los archivos de cada página (`constants.ts`, `App.tsx`, `components/`, `images/` e `index.html` para el hub; `privacidad.html` para la política). Sin git disponible usa la fecha del build. Nota: Vercel clona el repositorio con historial limitado, así que para archivos sin cambios recientes la fecha puede ser la del commit más antiguo disponible. Para forzar una fecha exacta, edita el array `PAGES` del script.

---

## Analítica y privacidad

La única analítica es el script propio alojado en Cloudflare Workers (`tracker.js`, cargado en `index.html`). No hay Google Analytics, cookies de terceros ni base de datos propia en el repositorio.

**Preferencia de tema:** el botón guarda `light`/`dark` en `localStorage` del propio navegador. No es un dato personal ni se envía a ningún sitio, pero conviene que la política lo mencione (apartado 9, "Cookies y tecnologías similares").

**Imágenes:** las que se importan desde el código van en `images/` (hash en el nombre, caché de 1 año). Las que necesitan una URL estable (`og-banner.jpg`, la imagen de los datos estructurados) van en `public/img/`.

La política de privacidad vive en `privacidad.html` (se sirve en `/privacidad`). **Si cambias qué datos recoge el Worker, su retención o sus encargados, actualiza ese archivo y su fecha de "Última actualización".**

---

## Licencia

Proyecto personal de **Aitor Sánchez Gutiérrez**. Todos los derechos reservados.
