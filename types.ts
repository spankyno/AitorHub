import type { LucideIcon } from 'lucide-react';

/** Categorías válidas. Es la fuente única: el tipo y la validación del catálogo salen de esta lista. */
export const LINK_CATEGORIES = [
  'blog',
  'tool',
  'utility',
  'media',
  'navigation',
  'connectivity',
  'multimedia',
  'emoji',
  'files',
  'game',
  'development',
  'security',
  'photography',
] as const;

export type LinkCategory = (typeof LINK_CATEGORIES)[number];

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: LinkCategory;
  icon: LucideIcon;
}
