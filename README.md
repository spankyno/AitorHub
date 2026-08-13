

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

La plataforma cuenta con un motor de búsqueda instantáneo en tiempo real que permite filtrar las herramientas cómodamente y un registro seguro y anónimo de visitas basado en serverless para estadísticas de uso.

### Selección de herramientas destacadas

| Herramienta | Descripción | Categoría |
| :--- | :--- | :--- |
| **Excel Merger** | Fusión rápida de múltiples archivos y listas Excel en un único documento. | 📊 Productividad / Excel |
| **Visor GPX** | Visualizador interactivo de rutas a partir de archivos `.gpx`. | 🗺️ Navegación / Mapas |
| **Password GenerAitor** | Generador de contraseñas de alta seguridad enfocado 100% en privacidad (local). | 🔒 Seguridad |
| **Extrae Texto de Imagen (OCR)** | Herramienta para digitalizar y transcribir texto a partir de capturas o fotos. | 🔧 Utilidades |
| **Audio a Texto** | Transcripción inteligente y automatizada de grabaciones de voz. | 🎙️ Multimedia |
| **Juego buscar municipios** | Mapa interactivo educativo para ubicar municipios sobre la geografía. | 🎮 Ocio |

---

## Stack Tecnológico

La aplicación ha sido optimizada para conseguir el máximo rendimiento en producción (**90+ en Lighthouse Performance**):

- **React 19** & **TypeScript** — Construcción de una interfaz reactiva, segura y tipada de forma estricta.
- **Vite 6** — Empaquetador ultra-rápido configurado con optimizaciones avanzadas de *Code Splitting* (separación de React-DOM, Lucide Icons y lógica propia para maximizar la caché del navegador).
- **Tailwind CSS 3** + **PostCSS** + **Autoprefixer** — Estilos CSS compilados y purgados nativamente en el build en lugar de usar librerías en caliente (CDN), eliminando el bloqueo del hilo principal.
- **Formato WebP moderno** — Optimización de recursos gráficos reduciendo el tamaño en más de un 60%.
- **Vercel** — Alojamiento de la interfaz y ejecución de funciones serverless seguras y escalables.
- **Neon (PostgreSQL)** — Base de datos relacional serverless para almacenamiento seguro de las estadísticas de visitas.

---

## Instalación y Desarrollo Local

**Requisitos previos:** Node.js 18+

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/AitorHub.git
cd AitorHub

# 2. Instala dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env.local
# Añade tu DATABASE_URL de tu instancia de Neon en el archivo .env.local

# 4. Arranca el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:3000`.

### Variables de entorno

| Variable | Descripción | Requerida |
| :--- | :--- | :--- |
| `DATABASE_URL` | Cadena de conexión a Neon PostgreSQL | Sí (solo para la API de registro) |

> **Nota de seguridad:** La variable `DATABASE_URL` solo se inyecta y utiliza en el entorno de ejecución backend de la función serverless de Vercel en `/api/registrar-entrada.js`. Está completamente aislada y fuera del alcance del bundle JavaScript del navegador del cliente.

---

## Estructura de Directorios

```
AitorHub/
├── api/
│   └── registrar-entrada.js   # Serverless function (Vercel) para registrar visitas
├── components/
│   └── LinkCard.tsx            # Componente de tarjeta de herramienta
├── public/
│   ├── favicon.ico            # Favicon ligero y optimizado
│   └── img/
│       ├── AitorCaricatura.jpg   # Formato clásico de fallback
│       └── AitorCaricatura.webp  # Formato optimizado para LCP rápido
├── App.tsx                     # Componente y diseño principal
├── constants.ts                # Catálogo de enlaces e información de herramientas
├── index.tsx                   # Punto de entrada de React
├── index.html                  # Plantilla HTML base
├── index.css                   # Punto de importación de estilos Tailwind CSS
├── postcss.config.js           # Configuración de PostCSS
├── tailwind.config.js          # Configuración personalizada de Tailwind
├── tsconfig.json               # Configuración de TypeScript
└── vite.config.ts              # Configuración y optimizaciones de build de Vite
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
  isExternal: true,
}
```

---

## Licencia

Proyecto personal de **Aitor Sánchez Gutiérrez**. Todos los derechos reservados.
