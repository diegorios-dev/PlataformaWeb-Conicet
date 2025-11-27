/**
 * Configuración centralizada de marcadores por categoría
 * Sistema diferenciado con colores específicos para cada tipo de evento
 */

export type MarkerCategory = 'pluviometro' | 'regla' | 'alerta' | 'default';

export interface MarkerCategoryConfig {
  name: string;
  color: string;
  rgb: string;
  description: string;
}

/**
 * Configuración de colores y metadatos por categoría
 */
export const MARKER_CATEGORIES: Record<MarkerCategory, MarkerCategoryConfig> = {
  pluviometro: {
    name: 'Pluviómetro',
    color: '#2F80ED',
    rgb: '47, 128, 237',
    description: 'Instrumento de medición de precipitación líquida'
  },
  regla: {
    name: 'Regla',
    color: '#F2994A',
    rgb: '242, 153, 74',
    description: 'Instrumento de medición de nivel o altura'
  },
  alerta: {
    name: 'Alerta',
    color: '#EB5757',
    rgb: '235, 87, 87',
    description: 'Instrumento con fallas o fuera de servicio'
  },
  default: {
    name: 'Por defecto',
    color: '#3B82F6',
    rgb: '59, 130, 246',
    description: 'Categoría genérica'
  }
};

/**
 * Obtiene la configuración de color para una categoría específica
 */
export function getCategoryConfig(category: MarkerCategory): MarkerCategoryConfig {
  return MARKER_CATEGORIES[category];
}

/**
 * Obtiene el RGB de una categoría para uso en CSS
 */
export function getCategoryRGB(category: MarkerCategory): string {
  return MARKER_CATEGORIES[category].rgb;
}

/**
 * Obtiene el color hexadecimal de una categoría
 */
export function getCategoryColor(category: MarkerCategory): string {
  return MARKER_CATEGORIES[category].color;
}
