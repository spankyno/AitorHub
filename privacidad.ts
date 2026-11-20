// Única parte con JavaScript de /privacidad: el botón de modo claro/oscuro.
import { currentTheme, toggleTheme, watchTheme, type Theme } from './theme';

const wrapper = document.getElementById('theme-toggle-wrap');
const button = document.getElementById('theme-toggle');

if (wrapper && button) {
  const render = (theme: Theme) => {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.title = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  };
  render(currentTheme());
  button.addEventListener('click', () => render(toggleTheme()));
  watchTheme(render);
  wrapper.hidden = false; // sin JavaScript el botón no se muestra (no funcionaría)
}
