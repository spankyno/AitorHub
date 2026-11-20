// Gestión del tema claro/oscuro. Lo comparten el hub (React) y privacidad.ts.
// El valor inicial lo fija un script en <head> (index.html / privacidad.html) antes del primer
// pintado; mantener sincronizadas las constantes de ese script con las de este archivo.

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const THEME_COLOR: Record<Theme, string> = { light: '#f8fafc', dark: '#0f172a' };

const systemQuery = (): MediaQueryList => window.matchMedia('(prefers-color-scheme: dark)');

export const systemTheme = (): Theme => (systemQuery().matches ? 'dark' : 'light');

/** Preferencia guardada por el usuario, o null (sin elección o almacenamiento bloqueado). */
export const getStoredTheme = (): Theme | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

const storeTheme = (theme: Theme): void => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Almacenamiento bloqueado: la elección solo dura mientras la página está abierta.
  }
};

export const currentTheme = (): Theme => {
  const value = document.documentElement.dataset.theme;
  return value === 'dark' || value === 'light' ? value : getStoredTheme() ?? systemTheme();
};

/** Aplica el tema al documento y al color de la barra del navegador (sin guardarlo). */
export const applyTheme = (theme: Theme): void => {
  document.documentElement.dataset.theme = theme;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.content = THEME_COLOR[theme];
    });
};

/** Alterna claro/oscuro y recuerda la elección del usuario. */
export const toggleTheme = (): Theme => {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  storeTheme(next);
  return next;
};

/**
 * Mantiene el tema al día cuando cambia sin pasar por este botón:
 *  - el sistema cambia de modo y el usuario no ha elegido nada;
 *  - otra pestaña guarda una preferencia distinta.
 * Devuelve la función para cancelar la suscripción.
 */
export const watchTheme = (onChange: (theme: Theme) => void): (() => void) => {
  const query = systemQuery();
  const sync = () => {
    const theme = getStoredTheme() ?? systemTheme();
    applyTheme(theme);
    onChange(theme);
  };
  const onSystemChange = () => {
    if (getStoredTheme() === null) sync();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) sync();
  };
  query.addEventListener('change', onSystemChange);
  window.addEventListener('storage', onStorage);
  return () => {
    query.removeEventListener('change', onSystemChange);
    window.removeEventListener('storage', onStorage);
  };
};
