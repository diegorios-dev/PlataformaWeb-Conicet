// src/utils/getCustomIcon.ts
import L from "leaflet";
import { iconReporteRegular, iconReporteRoto } from "../../../assets";

/**
 * Ícono tradicional con imágenes PNG
 * @deprecated Use getModernMarkerIcon para el diseño moderno con animaciones
 */
export const getCustomIcon = (_tipo: string, isHealthy: boolean) => {
  // Minimal icon: puedes reemplazar los paths por tus imágenes
  const iconUrl = isHealthy
    ? iconReporteRegular
    : iconReporteRoto;

  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};
