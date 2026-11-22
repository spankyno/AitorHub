// Analítica propia: script del Cloudflare Worker (ver la política de privacidad).
// Está aquí y no en un <script> en línea del HTML para poder aplicar una CSP sin 'unsafe-inline'.
// Si cambias el origen del Worker, actualiza también la CSP de vercel.json (script-src, connect-src, img-src).
const TRACKER = {
  src: 'https://aitors-hub-dashboard.asanchezgu.workers.dev/tracker.js',
  app: 'aitor-hub',
  // Clave pública de cliente: va visible en el navegador por diseño. No es un secreto.
  key: 'ak_e279ba09f6f740a2b0d605820a02b0a2',
};

/**
 * Carga el tracker tras el evento `load` y en un momento de inactividad, para no competir con el render.
 * Solo en producción: así las visitas de desarrollo no ensucian las estadísticas.
 */
export const loadAnalytics = (): void => {
  if (!import.meta.env.PROD) return;

  const inject = () => {
    const script = document.createElement('script');
    script.src = TRACKER.src;
    script.setAttribute('data-app', TRACKER.app);
    script.setAttribute('data-key', TRACKER.key);
    script.async = true;
    document.head.appendChild(script);
  };
  const schedule = () => {
    // Safari no implementa requestIdleCallback
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(inject);
    else setTimeout(inject, 1);
  };

  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
};
