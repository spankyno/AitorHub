import { 
  Zap, 
  FileSpreadsheet, 
  Map as MapIcon, 
  MapPin, 
  Mic, 
  FileText, 
  Globe, 
  FileAudio, 
  Radar, 
  ScanText, 
  Image as ImageIcon,
  Airplay,  
  MapPinCheckInside,
  BookImage,
  MonitorCog,
  Locate,
  LocateFixed,
  Clapperboard,
  SmilePlus,
  Eraser,
  SquareScissors,
  QrCode,
  Images
} from 'lucide-react';
import { LinkItem } from './types';

// To add a new link, simply add an object to this array.
// Icons are imported from lucide-react.
export const LINKS: LinkItem[] = [
  {
    id: 'home',
    title: "HOME (Aitor's blog)",
    url: "https://aitorblog.infinityfreeapp.com/",
    description: "La página principal de mi blog personal con artículos y novedades.",
    category: 'blog',
    icon: Zap,
    isExternal: true
  },
  {
    id: 'excel',
    title: "Excel Merger",
    url: "https://kalboexcelmerger.netlify.app/",
    description: "Herramienta para fusionar múltiples listas de Excel en un único archivo.",
    category: 'tool',
    icon: FileSpreadsheet
  },
  {
    id: 'compare',
    title: "Excel Lists Compare",
    url: "https://excel-lists-compare.vercel.app",
    description: "Herramienta para fusionar múltiples listas de Excel en un único archivo, usando columna maestra",
    category: 'tool',
    icon: FileSpreadsheet
  }, 
  {
    id: 'excelsheet',
    title: "Excel's Sheets Password Remover",
    url: "https://excel-sheet-password-remover.vercel.app/",
    description: "Elimina las contraseñas de bloqueo de las hojas Excel",
    category: 'tool',
    icon: FileSpreadsheet
  },
  {
    id: 'exceltext',
    title: "Excel Text Generaitor",
    url: "https://excel-text-generaitor.vercel.app/",
    description: "Genera cadenas de texto iterativas y personalizadas",
    category: 'tool',
    icon: FileSpreadsheet
  },
  {
    id: 'folder',
    title: "MyFolder2Xlsx",
    url: "https://myfolder2xlsx.netlify.app",
    description: "Obtiene información del contenido de una carpeta",
    category: 'tool',
    icon: FileSpreadsheet
  },  
  {
    id: 'gpx',
    title: "Visor GPX Simultáneo",
    url: "https://visorvariosgpx.netlify.app/",
    description: "Visualiza múltiples rutas GPX al mismo tiempo en un mapa interactivo.",
    category: 'tool',
    icon: MapIcon
  },
  {
    id: 'pk',
    title: "Visor PK Carreteras",
    url: "https://visorpkaitor.netlify.app/",
    description: "Localiza puntos kilométricos exactos en carreteras.",
    category: 'tool',
    icon: MapPin
  },
  {
    id: 'audio-rec',
    title: "Grabadora Audio PC",
    url: "https://grabadoraaudiopc.netlify.app/",
    description: "Graba audio directamente desde tu navegador sin instalar nada.",
    category: 'media',
    icon: Mic
  },
  {
    id: 'pdf',
    title: "Extrae Información PDF",
    url: "https://pdfscrappingaitor.netlify.app/",
    description: "Analiza y extrae datos específicos de documentos PDF (PDF Scrapping).",
    category: 'utility',
    icon: FileText
  },
  {
    id: 'ip',
    title: "Buscador de IP",
    url: "https://buscaip.netlify.app/",
    description: "Geolocalización y detalles sobre direcciones IP.",
    category: 'utility',
    icon: Globe
  },
  {
    id: 'audio-text',
    title: "Convierte Audio a Texto",
    url: "https://audioa-texto.vercel.app/",
    description: "Transcribe grabaciones de voz a texto editable automáticamente.",
    category: 'media',
    icon: FileAudio
  },
  {
    id: 'rastrea',
    title: "Rastreaitor",
    url: "https://rastreaitor.vercel.app/",
    description: "Sistema de rastreo de dispositivos sencillo y eficaz.",
    category: 'utility',
    icon: Radar
  },
  {
    id: 'ocr',
    title: "Extrae Texto de Imagen",
    url: "https://extrae-textode-imagen.vercel.app/",
    description: "Tecnología OCR para sacar texto de fotos o capturas de pantalla.",
    category: 'utility',
    icon: ScanText
  },
  {
    id: 'img',
    title: "Imaginaitor",
    url: "https://imaginaitor.vercel.app/",
    description: "Conversor y optimizador de formatos de imágenes rápido.",
    category: 'media',
    icon: ImageIcon
  },
 {
    id: 'logip',
    title: "Libro de visitas",
    url: "https://prukal2.infinityfreeapp.com/",
    description: "Loguea tu dirección IP, junto con un comentario y datos del S.O. visitante",
    category: 'connectivity',
    icon: Airplay
  },
 {
    id: 'georef1',
    title: "Georef v.1",
    url: "https://aitorsg.infinityfreeapp.com/",
    description: "Posiciona fotos en un mapa v.1",
    category: 'navigation',
    icon: MapPin
  },
 {
    id: 'georef2',
    title: "Georef v.2",
    url: "https://aitorsangu.infinityfreeapp.com/",
    description: "Posiciona fotos en un mapa v.2",
    category: 'navigation',
    icon: MapPinCheckInside
  },
 {
    id: 'galeria',
    title: "Galería de fotos",
    url: "https://aitorfotos.infinityfreeapp.com/",
    description: "Galería de fotos, con permisos por usuarios y grupos",
    category: 'files',
    icon: BookImage
  },
 {
    id: 'sysevent',
    title: "Eventos del Sistema Operativo",
    url: "https://syseventanalyzer.infinityfreeapp.com/",
    description: "Obten informes de tiempo de uso a través de los eventos del sistema",
    category: 'connectivity',
    icon: MonitorCog
  },
  {
    id: 'gpxviewer',
    title: "Visor de rutas de archivos .gpx",
    url: "https://visorgpx.infinityfreeapp.com/",
    description: "Visualiza rutas de archivos .gpx",
    category: 'navigation',
    icon: Locate
  },
  {
    id: 'gpxhistorial',
    title: "Visor de archivos .gpx almacenados en historial",
    url: "https://gpxhistory.netlify.app/",
    description: "Visualiza archivos .gpx almacenados en historial",
    category: 'navigation',
    icon: LocateFixed
  },
  {
    id: 'memories',
    title: "Memories maker",
    url: "https://memories-montage-maker.vercel.app/",
    description: "Crea vídeos con fotos y música",
    category: 'Multimedia',
    icon: Clapperboard
  },
  {
    id: 'emoji',
    title: "Emoji picker",
    url: "https://kalboemojipicker.netlify.app/",
    description: "Explora, visualiza, copia diferentes emojis",
    category: 'Emoji',
    icon: SmilePlus
  },
  {
    id: 'videotrim',
    title: "Video Trim",
    url: "https://video-trim-zeta.vercel.app/",
    description: "Procesamiento de recorte de vídeo con inclusión de audio",
    category: 'Tools',
    icon: SquareScissors
  },
  {
    id: 'qrcode',
    title: "QR Generaitor",
    url: "https://qrgeneraitor.netlify.app",
    description: "Genera códigos QR",
    category: 'Connectivity',
    icon: QrCode
  },
  {
    id: 'test',
    title: "Examiaitor",
    url: "https://examinaitor.vercel.app/",
    description: "Genera exámenes tipo test, a partir de un tema o un pdf",
    category: 'utility',
    icon: FileText
  },  
{
    id: 'metadata',
    title: "Metadata Remover",
    url: "https://mdremover.netlify.app/",
    description: "Elimina metadatos y EXIF de archivos",
    category: 'files',
    icon: Eraser
},
{
    id: 'metadeditor',
    title: "Metadata Editaitor",
    url: "https://metadataeditaitor.vercel.app/",
    description: "Edición de metadatos y EXIF de imágenes",
    category: 'Photography',
    icon: Images
}
];
export const SOCIAL_LINKS = {
  twitter: "https://x.com/Kalbo___"
};