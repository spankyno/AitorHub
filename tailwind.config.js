/** @type {import('tailwindcss').Config} */

// Colores semánticos: sus valores (RGB) viven en index.css y cambian solos
// con prefers-color-scheme. `<alpha-value>` permite usar bg-surface/80, etc.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: [
    './index.html',
    './privacidad.html',
    './404.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  // El variante dark: se activa con <html data-theme="dark"> (botón manual o preferencia del
  // sistema, resuelto por el script de <head>). Sin JavaScript (sin data-theme) sigue al sistema.
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not([data-theme] *) }',
      '&:is([data-theme="dark"] *)',
    ],
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        page: token('page'),
        surface: token('surface'),
        ink: token('ink'),
        body: token('body'),
        muted: token('muted'),
        edge: token('edge'),
        'edge-soft': token('edge-soft'),
        control: token('control'),
        accent: token('accent'),
        'accent-hover': token('accent-hover'),
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%':  { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
