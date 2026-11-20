import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { currentTheme, toggleTheme, watchTheme, type Theme } from '../theme';

export const ThemeToggle: React.FC = () => {
  // El HTML prerenderizado no conoce el tema del visitante: el estado real se lee tras montar.
  // Los iconos cambian solo con CSS (según data-theme, que fija un script de <head>),
  // así que se ven bien desde el primer pintado.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(currentTheme());
    return watchTheme(setTheme);
  }, []);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(toggleTheme())}
      // Etiqueta fija + aria-pressed: el lector anuncia "Modo oscuro, pulsado / no pulsado".
      aria-pressed={isDark}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-edge bg-surface text-body shadow-sm transition-colors hover:text-accent-hover"
    >
      <Moon className="block h-5 w-5 dark:hidden" />
      <Sun className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Modo oscuro</span>
    </button>
  );
};
