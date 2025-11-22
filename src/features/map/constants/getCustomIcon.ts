// src/utils/getCustomIcon.ts
import L from "leaflet";

export const getCustomIcon = (isHealthy: boolean) => {
  // Minimal icon: puedes reemplazar los paths por tus imágenes
  const iconUrl = isHealthy
    ? "/assets/iconReporteRegular.png"
    : "/assets/iconReporteInstrumentoRoto.png";

  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};
