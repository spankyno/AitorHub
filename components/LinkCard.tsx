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
      className="group relative flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-brand-200 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ExternalLink className="w-4 h-4 text-brand-400" />
      </div>

      <div className="flex items-start mb-4">
        <div className="p-3 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-brand-700 transition-colors">
        {item.title}
      </h3>
      
      <p className="text-sm text-slate-500 mb-4 flex-grow leading-relaxed">
        {item.description}
      </p>

      <div className="flex items-center text-sm font-medium text-brand-600 mt-auto">
        <span className="relative overflow-hidden">
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
            Visitar página
          </span>
          <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            Ir ahora
          </span>
        </span>
        <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </a>
  );
};