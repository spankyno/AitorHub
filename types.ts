import { LucideIcon } from 'lucide-react';

export type LinkCategory =
  | 'blog'
  | 'tool'
  | 'utility'
  | 'media'
  | 'navigation'
  | 'connectivity'
  | 'multimedia'
  | 'emoji'
  | 'files'
  | 'game'
  | 'development'
  | 'photography';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: LinkCategory;
  icon: LucideIcon;
  isExternal?: boolean;
}
