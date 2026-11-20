import React from 'react';
import { FOOTER_LINKS } from '../constants';

const linkClass =
  'inline-block py-1 text-body hover:text-accent-hover underline-offset-4 hover:underline transition-colors';

const NewTab: React.FC = () => <span className="sr-only"> (se abre en una pestaña nueva)</span>;

export const Footer: React.FC = () => (
  <footer className="mt-20 pt-8 pb-4 border-t border-edge text-center text-sm text-muted">
    <nav aria-label="Enlaces del pie de página">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 mb-4">
        <li>
          <a href={FOOTER_LINKS.blog} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Blog<NewTab />
          </a>
        </li>
        <li>
          <a href={FOOTER_LINKS.contacto} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Contacto<NewTab />
          </a>
        </li>
        <li>
          <a href={FOOTER_LINKS.privacidad} className={linkClass}>
            Privacidad
          </a>
        </li>
      </ul>
    </nav>
    <p>Autor: Aitor Sánchez Gutiérrez. © 2026 - Todos los derechos reservados.</p>
  </footer>
);
