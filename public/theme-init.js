/* Tema: preferencia guardada (localStorage) o la del sistema. Se ejecuta antes del primer
   pintado para evitar destellos. Mantener sincronizado con theme.ts */
(function () {
  var t = null;
  try { t = localStorage.getItem('theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', t);
  var c = t === 'dark' ? '#0f172a' : '#f8fafc';
  var m = document.querySelectorAll('meta[name="theme-color"]');
  for (var i = 0; i < m.length; i++) m[i].setAttribute('content', c);
})();
