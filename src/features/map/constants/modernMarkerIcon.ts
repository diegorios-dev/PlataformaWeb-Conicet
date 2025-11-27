// src/features/map/constants/modernMarkerIcon.ts
import L from "leaflet";

/**
 * Tipos de categorías de marcadores con sus respectivos colores
 */
export type MarkerCategory = 'pluviometro' | 'regla' | 'alerta' | 'default';

/**
 * Configuración de colores por categoría
 */
const CATEGORY_COLORS: Record<MarkerCategory, string> = {
  pluviometro: "47, 128, 237",  // Azul #2F80ED
  regla: "242, 153, 74",         // Naranja #F2994A
  alerta: "235, 87, 87",         // Rojo #EB5757
  default: "59, 130, 246",       // Azul tecnológico por defecto
};

/**
 * Determina la categoría del marcador basándose en el tipo y estado
 */
function getMarkerCategory(tipo: string, isHealthy: boolean): MarkerCategory {
  // Si no está saludable, es una alerta
  if (!isHealthy) {
    return 'alerta';
  }

  // Categorización por tipo de instrumento
  const tipoLower = tipo.toLowerCase().trim();
  
  // Pluviómetros - Precipitación líquida
  if (tipoLower.includes('pluviometro') || 
      tipoLower.includes('pluviometría') ||
      tipoLower.includes('lluvia') ||
      tipoLower === 'lluvia' ||
      tipoLower === 'mm' ||
      tipoLower.includes('precipitacion')) {
    return 'pluviometro';
  }
  
  // Reglas / Nivómetros / Nieve - Medición de altura/nivel
  if (tipoLower.includes('regla') || 
      tipoLower.includes('nivel') || 
      tipoLower.includes('nivometro') ||
      tipoLower.includes('nivometría') ||
      tipoLower.includes('nieve') ||
      tipoLower === 'nieve' ||
      tipoLower === 'cm' ||  // ✅ Centímetros (reglas de nieve)
      tipoLower.includes('altura')) {
    return 'regla';
  }
  
  // Caudalímetro
  if (tipoLower.includes('caudal') ||
      tipoLower.includes('flujo') ||
      tipoLower === 'm3/s' ||
      tipoLower === 'l/s') {
    return 'default';
  }
  
  // Default para otros tipos
  return 'default';
}

/**
 * Crea un ícono moderno con animación de pulso y halo
 * Diseño minimalista, limpio y profesional para sistemas de monitoreo
 * Diferenciado por categorías con colores específicos
 */
export const getModernMarkerIcon = (tipo: string, isHealthy: boolean) => {
  const category = getMarkerCategory(tipo, isHealthy);
  const color = CATEGORY_COLORS[category];

  const iconHtml = `
    <div class="modern-marker-container" data-category="${category}">
      <!-- Pulso animado (anillo expandiéndose con 15-25% opacidad) -->
      <div class="marker-pulse" style="--marker-color-rgb: ${color};"></div>
      
      <!-- Halo difuminado (glow con menor opacidad) -->
      <div class="marker-glow" style="--marker-color-rgb: ${color};"></div>
      
      <!-- Círculo principal -->
      <div class="marker-core" style="--marker-color-rgb: ${color};">
        <!-- Ícono interno -->
        <div class="marker-icon">
          ${getInnerIcon(tipo)}
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "modern-marker-wrapper",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

/**
 * Retorna el SVG del ícono interno según el tipo de instrumento
 */
function getInnerIcon(tipo: string): string {
  const iconColor = "white";
  const tipoLower = tipo.toLowerCase().trim();
  
  // Pluviómetros - Gota de agua (mm, lluvia)
  if (tipoLower.includes('pluviometro') || 
      tipoLower.includes('lluvia') ||
      tipoLower === 'mm') {
    return `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="${iconColor}" stroke="none">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    `;
  }
  
  // Reglas / Nivómetros - Icono de regla/medición (cm, regla, nivel)
  if (tipoLower.includes('regla') || 
      tipoLower.includes('nivel') || 
      tipoLower.includes('nivometro') ||
      tipoLower === 'cm') {
    return `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <line x1="8" y1="6" x2="12" y2="6"/>
        <line x1="8" y1="10" x2="12" y2="10"/>
        <line x1="8" y1="14" x2="12" y2="14"/>
        <line x1="8" y1="18" x2="12" y2="18"/>
      </svg>
    `;
  }
  
  // Nieve - Copo de nieve
  if (tipoLower.includes('nieve')) {
    return `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
        <line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/>
      </svg>
    `;
  }
  
  // Caudalímetro - Ondas (caudal, m3/s, l/s)
  if (tipoLower.includes('caudalimetro') || 
      tipoLower.includes('caudal') ||
      tipoLower === 'm3/s' ||
      tipoLower === 'l/s') {
    return `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <path d="M2 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"/>
        <path d="M14 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"/>
      </svg>
    `;
  }
  
  // Ícono genérico por defecto
  return `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="${iconColor}">
      <circle cx="12" cy="12" r="6"/>
    </svg>
  `;
}
