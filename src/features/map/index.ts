/**
 * Sistema de Marcadores Modernos - Exportaciones Centralizadas
 * 
 * Importar todo desde aquí para mayor comodidad:
 * import { getModernMarkerIcon, MARKER_CATEGORIES } from '@/features/map';
 */

// Función principal del generador de íconos
export { getModernMarkerIcon } from './constants/modernMarkerIcon';
export type { MarkerCategory } from './constants/modernMarkerIcon';

// Configuración de categorías
export { 
  MARKER_CATEGORIES,
  getCategoryConfig,
  getCategoryRGB,
  getCategoryColor
} from './constants/markerConfig';
export type { MarkerCategoryConfig } from './constants/markerConfig';

// Componente principal
export { MarkerSite } from './components/MarkerSite';

/**
 * Nota: Los estilos se cargan automáticamente cuando importas MarkerSite
 * Si necesitas importarlos manualmente:
 * import '@/features/map/styles/modernMarkers.css';
 */
