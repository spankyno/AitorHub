// Entrada SSR: solo la usa el build (scripts/prerender.mjs). No forma parte del bundle del navegador.
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { LINKS } from './constants';

/** HTML de la app, para insertarlo dentro de <div id="root">. */
export const render = (): string =>
  renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

/** Datos estructurados ItemList generados desde el catálogo (fuente única: constants.ts). */
export const itemListJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: "Herramientas de Aitor's Hub",
  numberOfItems: LINKS.length,
  itemListElement: LINKS.map((link, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: link.title,
    url: link.url,
    description: link.description,
  })),
});
