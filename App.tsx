import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES_IN_USE, CATEGORY_LABELS, LINKS, SOCIAL_LINKS } from './constants';
import { LinkCard } from './components/LinkCard';
import { Footer } from './components/Footer';
import { CategoryFilter, type CategoryFilterValue } from './components/CategoryFilter';
import { ThemeToggle } from './components/ThemeToggle';
import heroWebp from './images/AitorCaricatura.webp';
import type { LinkCategory, LinkItem } from './types';

// lucide-react v1 no longer ships brand icons, so the X (Twitter) logo is inlined.
const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);


// Minúsculas y sin diacríticos: "informacion" encuentra "información", "ano" encuentra "año".
const normalize = (value: string): string =>
  value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

// Se calcula una sola vez al cargar el módulo, no en cada pulsación.
const SEARCH_INDEX: { link: LinkItem; text: string }[] = LINKS.map((link) => ({
  link,
  text: normalize(`${link.title}\n${link.description}`),
}));

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [category, setCategory] = useState<CategoryFilterValue>('all');

  // ?q= (la SearchAction de los datos estructurados). Se lee tras montar, no en el estado inicial,
  // para que el HTML prerenderizado (sin window) y la hidratación coincidan.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setSearchTerm(q);
  }, []);

  // Resultados de la búsqueda por texto; el filtro de categoría se aplica encima.
  const searchMatches = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term) return LINKS;
    return SEARCH_INDEX.filter(({ text }) => text.includes(term)).map(({ link }) => link);
  }, [searchTerm]);

  // Herramientas por categoría dentro de la búsqueda actual (contadores de los chips).
  const counts = useMemo(() => {
    const result: Partial<Record<LinkCategory, number>> = {};
    for (const link of searchMatches) result[link.category] = (result[link.category] ?? 0) + 1;
    return result;
  }, [searchMatches]);

  const filteredLinks = useMemo(
    () => (category === 'all' ? searchMatches : searchMatches.filter((link) => link.category === category)),
    [searchMatches, category]
  );

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
  };

  const statusMessage =
    !searchTerm && category === 'all'
      ? ''
      : filteredLinks.length === 0
        ? 'No se encontraron resultados'
        : `${filteredLinks.length} ${filteredLinks.length === 1 ? 'herramienta encontrada' : 'herramientas encontradas'}`;

  return (
    <div className="relative min-h-screen pb-12">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:font-medium focus:text-accent focus:shadow-lg"
      >
        Saltar al contenido
      </a>

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      {/* Decorative Background Elements */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="blob blob-a absolute left-1/4 top-[-2rem] -ml-8 h-[32rem] w-[32rem] animate-blob"></div>
        <div className="blob blob-b absolute right-1/4 top-[-2rem] -mr-8 h-[32rem] w-[32rem] animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <header className="flex flex-col items-center pt-12 pb-10 text-center">

          {/* Linked Profile Image */}
          <a
            href="https://aitorsanchez.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative mb-8 group block cursor-pointer"
            aria-label="Ir al blog de Aitor (se abre en una pestaña nueva)"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-purple-400 rounded-2xl opacity-70 blur transition duration-500 group-hover:opacity-100 rotate-3"></div>
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-4 border-surface shadow-xl bg-surface transform transition duration-500 group-hover:-rotate-2 group-hover:scale-[1.02]">
              <picture>
                <source srcSet={heroWebp} type="image/webp" />
                <img
                  src="/img/AitorCaricatura.jpg"
                  alt="Caricatura de Aitor"
                  width="224"
                  height="224"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>
            <div aria-hidden="true" className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
              <span className="inline-block bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                Ir al blog
              </span>
            </div>
          </a>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3 tracking-tight">
            Aitor&#39;s Hub
          </h1>

          <p className="max-w-2xl text-lg text-body mb-8 font-medium">
            Acceso directo a mis herramientas, utilidades y artículos del blog.
          </p>

          {/* Social Chip */}
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2 rounded-full bg-surface shadow-sm border border-edge text-body hover:text-accent-hover hover:border-brand-400 hover:shadow-md transition-[color,border-color,box-shadow] duration-300"
          >
            <XIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">@Kalbo___</span>
            <span className="sr-only"> en X (se abre en una pestaña nueva)</span>
          </a>
        </header>

        {/* Search / Filter Bar */}
        {/* Un solo landmark de búsqueda: campo de texto + filtros de categoría */}
        <div role="search" className="mb-8">
          <div className="mx-auto mb-4 max-w-md">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Search className="h-5 w-5 text-muted group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-3 border border-control rounded-xl leading-5 bg-surface/80 text-ink backdrop-blur-sm placeholder:text-muted transition-colors shadow-sm"
                placeholder="Buscar herramienta o enlace..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar herramientas"
                name="q"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
              />
            </div>
          </div>

          <CategoryFilter
            categories={CATEGORIES_IN_USE}
            counts={counts}
            total={searchMatches.length}
            value={category}
            onChange={setCategory}
          />
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {statusMessage}
        </p>

        {/* Grid Layout */}
        <main id="contenido" tabIndex={-1} className="focus:outline-none">
          <h2 className="sr-only">Herramientas</h2>
          {filteredLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <LinkCard key={link.id} item={link} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface/50 rounded-3xl border border-dashed border-control">
              <p className="text-muted text-lg">
                No se encontraron resultados
                {searchTerm && <> para &ldquo;{searchTerm}&rdquo;</>}
                {category !== 'all' && <> en {CATEGORY_LABELS[category]}</>}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-accent font-medium hover:text-accent-hover underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
