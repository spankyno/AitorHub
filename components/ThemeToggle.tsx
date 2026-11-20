import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { currentTheme, toggleTheme, watchTheme, type Theme } from '../theme';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => watchTheme(setTheme), []);

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
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Modo oscuro</span>
    </button>
  );
};
