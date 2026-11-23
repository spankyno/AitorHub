import type { LucideIcon } from 'lucide-react';

/** Categorías válidas. Es la fuente única: el tipo y la validación del catálogo salen de esta lista. */
export const LINK_CATEGORIES = [
  'blog',
  'tool',
  'utility',  
  'navigation',  
  'multimedia',
  'game',  
  'security',
  'office',  
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
