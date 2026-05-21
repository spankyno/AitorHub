<div align="center">
  <img width="1200" height="475" alt="AitorHub Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

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

AitorHub es un **hub de aplicaciones** que centraliza en un único punto todos los proyectos web de Aitor: herramientas de productividad, utilidades de archivos, visores de mapas, convertidores multimedia, juegos y mucho más.

Cada tarjeta enlaza directamente a la aplicación correspondiente, con búsqueda en tiempo real para localizar cualquier herramienta al instante. Cada visita queda registrada de forma anónima en una base de datos [Neon](https://neon.tech) (PostgreSQL serverless) para llevar un seguimiento de uso.

### Herramientas disponibles (entre otras)

| Categoría | Ejemplos |
|-----------|---------|
| 📊 Excel | Excel Merger, Lists Compare, Sheet Password Remover, Text Generaitor |
| 🗺️ Mapas | Visor GPX Simultáneo, Visor PK Carreteras, Georef Fotos |
| 📄 PDF | Extractor de información, +60 herramientas PDF, PDF a Excel |
| 🎙️ Multimedia | Grabadora de audio, Audio a Texto, Memories Maker, Screen Recorder |
| 🔧 Utilidades | OCR, Web Scraper, QR Generaitor, Metadata Remover/Editor, RenombrAitor |
| 🎮 Otros | Busca Municipios, CSS Parser, Emoji Picker, Examiaitor |

---

## Tecnologías

- **React 19** + **TypeScript** — interfaz de usuario
- **Vite 6** — bundler y dev server
- **Tailwind CSS** — estilos (cargado via CDN)
- **Lucide React** — iconografía
- **Vercel** — hosting y funciones serverless
- **Neon (PostgreSQL)** — registro de visitas

---

## Instalación local

**Requisitos previos:** Node.js 18+

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/AitorHub.git
cd AitorHub

# 2. Instala dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env.local
# Edita .env.local y añade tu DATABASE_URL de Neon

# 4. Arranca el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:3000`.

### Variables de entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | Cadena de conexión a Neon PostgreSQL | Sí (solo para la API) |

> **Importante:** `DATABASE_URL` solo se usa en la función serverless `/api/registrar-entrada.js`.  
> Nunca se expone al bundle del cliente.

### Script de base de datos

La tabla de visitas en Neon debe tener esta estructura:

```sql
CREATE TABLE visits (
  id         SERIAL PRIMARY KEY,
  ip_address TEXT,
  country    TEXT,
  city       TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Estructura del proyecto

```
AitorHub/
├── api/
│   └── registrar-entrada.js   # Serverless function (Vercel) — registro de visitas
├── components/
│   └── LinkCard.tsx            # Tarjeta de enlace
├── public/
│   ├── favicon.ico
│   └── img/
│       └── AitorCaricatura.jpg
├── App.tsx                     # Componente raíz
├── constants.ts                # Lista de enlaces/herramientas
├── index.tsx                   # Punto de entrada React
├── index.html                  # HTML base
├── types.ts                    # Tipos TypeScript
├── vite.config.ts              # Configuración Vite
├── .env.example                # Plantilla de variables de entorno
└── .gitignore
```

---

## Seguridad — mejoras recientes

Esta versión incorpora una revisión completa de seguridad con las siguientes correcciones:

### 🔴 Críticas

**Resolución de IP fiable**  
La IP del visitante se obtiene ahora desde los headers `x-real-ip` y `x-vercel-forwarded-for`, que son establecidos por la infraestructura de Vercel y no pueden ser falsificados por el cliente. Antes se usaba `x-forwarded-for`, que cualquier petición podía manipular libremente.

**Sin fuga de errores internos**  
Los errores de base de datos se loguean únicamente en el servidor. El cliente recibe siempre un mensaje genérico (`"Error interno del servidor"`), sin detalles de queries, esquemas ni stack traces.

**Rate limiting**  
El endpoint `/api/registrar-entrada` limita a **10 peticiones por IP por minuto**, rechazando con `429` las solicitudes que superen ese umbral. Esto impide el inflado artificial de la tabla de visitas y ataques de denegación de servicio básicos.

### 🟠 Importantes

**Validación de origen (CSRF)**  
La API comprueba el header `Origin` de cada petición y solo acepta las que provengan de dominios autorizados, devolviendo `403` al resto.

**Sin secretos en el bundle del cliente**  
`vite.config.ts` ya no inyecta ninguna variable de entorno en el JavaScript servido al navegador. `DATABASE_URL` y cualquier otro secreto solo son accesibles desde las funciones serverless.

**Eliminación de `GEMINI_API_KEY`**  
Se han eliminado todas las referencias a la API de Gemini, que no se utiliza en la aplicación y cuya presencia exponía una clave en el bundle compilado.

**Tipos TypeScript coherentes**  
El tipo `LinkCategory` en `types.ts` cubre ahora todas las categorías reales usadas en `constants.ts`, eliminando los errores de tipo silenciosos que existían anteriormente.

### 🟡 Otras mejoras

- Eliminados `dist/` y `node_modules/` del repositorio; añadidos al `.gitignore`.
- Eliminado el import de `BookImage` (lucide-react) que no se usaba en ningún enlace.
- `isExternal: true` aplicado de forma consistente a todas las tarjetas.
- Campo `<input type="search">` y `aria-label` en el buscador para mejor accesibilidad.
- Añadido `.env.example` como plantilla documentada de variables de entorno.

---

## Añadir una nueva herramienta

Edita `constants.ts` y añade un objeto al array `LINKS`:

```ts
{
  id: 'mi-herramienta',          // identificador único
  title: 'Mi Herramienta',
  url: 'https://mi-herramienta.vercel.app/',
  description: 'Descripción breve de lo que hace.',
  category: 'tool',              // ver tipos disponibles en types.ts
  icon: NombreIcono,             // importado de lucide-react
  isExternal: true,
},
```

---

## Licencia

Proyecto personal de **Aitor Sánchez Gutiérrez**. Todos los derechos reservados.
