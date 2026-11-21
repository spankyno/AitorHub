import React from 'react';
import { CATEGORY_LABELS } from '../constants';
import type { LinkCategory } from '../types';

export type CategoryFilterValue = LinkCategory | 'all';

interface CategoryFilterProps {
  /** Categorías a mostrar (solo las que tienen herramientas), en orden. */
  categories: readonly LinkCategory[];
  /** Herramientas por categoría dentro de la búsqueda actual. */
  counts: Partial<Record<LinkCategory, number>>;
  /** Herramientas que coinciden con la búsqueda actual (contador de «Todas»). */
  total: number;
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

interface ChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, count, active, onClick }) => {
  // Una categoría sin resultados en la búsqueda actual no se puede elegir (salvo que ya esté activa).
  const disabled = count === 0 && !active;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      disabled={disabled}
      className={[
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-edge bg-surface text-body hover:border-brand-400 hover:text-accent-hover',
        disabled ? 'cursor-not-allowed opacity-50 hover:border-edge hover:text-body' : '',
      ].join(' ')}
    >
      {label}
      <span aria-hidden="true" className={`tabular-nums ${active ? 'text-white' : 'text-muted'}`}>
        {count}
      </span>
      <span className="sr-only">
        ({count} {count === 1 ? 'herramienta' : 'herramientas'})
      </span>
    </button>
  );
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, counts, total, value, onChange }) => (
  <div role="group" aria-label="Filtrar por categoría" className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2">
    <Chip label="Todas" count={total} active={value === 'all'} onClick={() => onChange('all')} />
    {categories.map((category) => (
      <Chip
        key={category}
        label={CATEGORY_LABELS[category]}
        count={counts[category] ?? 0}
        active={value === category}
        onClick={() => onChange(category)}
      />
    ))}
  </div>
);
