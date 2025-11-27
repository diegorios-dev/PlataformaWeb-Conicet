// src/components/MarkerSite.tsx
import React, { useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import { getModernMarkerIcon } from "../constants/modernMarkerIcon";
import PopupSite from "./PopupSite";
import type { Coord, SiteData, SiteStatus } from "../types/interfaces";

// Importar estilos de marcadores modernos
import "../styles/modernMarkers.css";

interface Props {
  site: Coord;
  reports?: SiteData | null;
  status?: SiteStatus | null;
  selectedYear?: number | null;
}

export const MarkerSite: React.FC<Props> = ({ site, reports, status, selectedYear }) => {
  const totalAmount = reports?.totalAmount || 0;
  const lastReportAmount = reports?.lastReportAmount || 0;

  // Cargar estilos una sola vez
  useEffect(() => {
    // Los estilos ya se cargan con el import
  }, []);

  // No renderizar si no hay datos
  if (!reports || (totalAmount === 0 && lastReportAmount === 0)) {
    return null;
  }

  // Un sitio está saludable solo si status es true Y NO tiene instrumentos averiados
  const isHealthy = status?.status !== false && !status?.tiene_instrumentos_averiados;

  return (
    <Marker position={site.coordenadas} icon={getModernMarkerIcon(site.tipo, isHealthy)}>
      <Popup>
        <PopupSite site={site} reports={reports} status={status} selectedYear={selectedYear} />
      </Popup>
    </Marker>
  );
};
