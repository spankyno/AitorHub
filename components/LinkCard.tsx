import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { LinkItem } from '../types';

interface LinkCardProps {
  item: LinkItem;
}

export const LinkCard: React.FC<LinkCardProps> = ({ item }) => {
  const Icon = item.icon;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      // El nombre accesible se calcula del contenido (título + descripción + aviso de pestaña
      // nueva), que coincide con el texto visible (WCAG 2.5.3). El CTA decorativo va aria-hidden.
      className="group relative flex flex-col p-6 bg-surface rounded-2xl shadow-sm border border-edge-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-brand-200 dark:hover:border-brand-400/50 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
      >
        <ExternalLink className="w-4 h-4 text-accent" />
      </div>

      <div className="flex items-start mb-4" aria-hidden="true">
        <div className="p-3 rounded-xl bg-brand-50 text-accent dark:bg-brand-500/15 group-hover:bg-brand-600 group-hover:text-white group-focus-visible:bg-brand-600 group-focus-visible:text-white transition-colors duration-300">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <h3
        className="text-lg font-bold text-ink mb-2 group-hover:text-accent-hover transition-colors"
      >
        {item.title}
      </h3>

      <p className="text-sm text-muted mb-4 flex-grow leading-relaxed">
        {item.description}
      </p>

      <div aria-hidden="true" className="flex items-center text-sm font-medium text-accent mt-auto">
        <span className="relative overflow-hidden">
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full group-focus-visible:-translate-y-full">
            Visitar página
          </span>
          <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
            Ir ahora
          </span>
        </span>
        <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
      </div>

      <span className="sr-only">
        (se abre en una pestaña nueva)
      </span>
    </a>
  );
};
