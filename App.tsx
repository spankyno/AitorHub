import React, { useState, useMemo, useEffect } from 'react';
import { Search, Twitter } from 'lucide-react';
import { LINKS, SOCIAL_LINKS } from './constants';
import { LinkCard } from './components/LinkCard';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // ➡️ NUEVA IMPLEMENTACIÓN: Llamada a la API para registrar la visita ⬅️
  useEffect(() => {
    // Definimos la función asíncrona para hacer el fetch
    const logVisit = async () => {
      try {
        // Llamada a la serverless function de Vercel
        const response = await fetch('/api/log-visit', {
          method: 'POST', // Usamos POST para registrar un nuevo recurso
        });

        if (response.ok) {
          console.log('✅ Visita registrada con éxito.');
          // Puedes descomentar si quieres ver la respuesta de la API
          // const data = await response.json(); 
          // console.log('Datos de respuesta:', data);
        } else {
          console.error('❌ Error al registrar la visita:', response.status, response.statusText);
        }
      } catch (error) {
        // Captura errores de red (ej. si la API no está accesible)
        console.error('❌ Error de red al intentar registrar la visita:', error);
      }
    };

    // Ejecutamos la función de registro
    logVisit();

    // El array de dependencias vacío `[]` asegura que esto se ejecute
    // SÓLO una vez, justo después de que el componente se monte.
  }, []);
  // ⬅️ FIN DE LA NUEVA IMPLEMENTACIÓN ⬅️

  // Filter links based on search input
  const filteredLinks = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return LINKS.filter(link => 
      link.title.toLowerCase().includes(term) || 
      link.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen pb-12">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="flex flex-col items-center pt-12 pb-10 text-center">
          
          {/* Linked Profile Image */}
          <a 
            href="https://aitorblog.infinityfreeapp.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative mb-8 group block cursor-pointer"
            title="Visitar el Blog de Aitor"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-purple-400 rounded-2xl opacity-70 blur transition duration-500 group-hover:opacity-100 rotate-3"></div>
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white transform transition duration-500 group-hover:-rotate-2 group-hover:scale-[1.02]">
              <img 
                src="/img/AitorCaricatura.jpg" 
                alt="Aitor Caricatura - Ir al Blog" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist during development
                  e.currentTarget.src = "https://picsum.photos/400/400";
                }}
              />
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
              <span className="inline-block bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">Ir al blog</span>
            </div>
          </a>
          
          <h1 className="sr-only">Aitor's Hub - Aitor Sánchez Gutiérrez</h1>
          
          <p className="max-w-2xl text-lg text-slate-600 mb-8 font-medium">
            Acceso directo a mis herramientas, utilidades y artículos del blog.
          </p>

          {/* Social Chip */}
          <a 
            href={SOCIAL_LINKS.twitter} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 hover:text-blue-500 hover:border-blue-200 hover:shadow-md transition-all duration-300"
          >
            <Twitter className="w-5 h-5 mr-2" />
            <span className="font-medium">@Kalbo___</span>
          </a>
        </header>

        {/* Search / Filter Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm"
              placeholder="Buscar herramienta o enlace..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid Layout */}
        <main>
          {filteredLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <LinkCard key={link.id} item={link} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-500 text-lg">No se encontraron resultados para "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-brand-600 font-medium hover:text-brand-800 underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-20 py-8 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Aitor Sánchez Gutiérrez. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;