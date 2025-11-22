// src/components/MapHTML.tsx
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { MapPin, Lightbulb } from "lucide-react";
import { tileConfigs } from "../constants/tileConfigs";
import { YearSelector } from "./YearSelector";
import { BaseMapSelector } from "./BaseMapSelector";
import { MarkerSite } from "./MarkerSite";
import { useAvailableYears } from "../hooks/useAvailableYears";
import { useSiteStatus } from "../hooks/useSiteStatus";
import { useSiteReports } from "../hooks/useSiteReports";
import { LoadingMap, LoadingSpinner } from "@shared/ui/Loading/LoadingState";
import type { MapHTMLProps } from "../types/interfaces";

export default function MapHTML({ position, loading: externalLoading }: MapHTMLProps) {
  // ⚠️ IMPORTANTE: Todos los hooks deben declararse ANTES de cualquier return condicional
  const [baseMap, setBaseMap] = useState<'original' | 'vegetacion' | 'topografia'>('vegetacion');
  const { availableYears, selectedYear, setSelectedYear } = useAvailableYears();
  const siteStatus = useSiteStatus(position);

  // Llamada al hook (debe aceptar position y lista de ids)
  const ids = position.map((p) => p.idSitio);
  const { siteReports, loadingReports } = useSiteReports(position, ids, selectedYear);

  // Returns condicionales DESPUÉS de todos los hooks
  if (externalLoading) {
    return <LoadingMap message="Cargando sitios..." siteCount={0} />;
  }

  const isStatusReady = position.every((coord) => siteStatus.has(coord.idSitio));
  if (loadingReports || !isStatusReady) {
    return <LoadingSpinner message={`Cargando datos de ${position?.length || 0} reportes...`} size="lg" />;
  }

  if (!position || position.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-10 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl max-w-md shadow-xl">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No hay datos disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            No se encontraron sitios con datos para el instrumento seleccionado.
          </p>
          <div className="text-sm text-gray-500 bg-blue-50 rounded-lg p-4">
            <Lightbulb className="inline w-4 h-4 mr-1 text-yellow-400" />
            <strong>Sugerencia:</strong> Intenta seleccionar otro instrumento desde el menú lateral
          </div>
        </div>
      </div>
    );
  }

  const center: [number, number] = position[0].coordenadas;

  return (
    <div className="relative w-full h-full">
      <YearSelector availableYears={availableYears} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <BaseMapSelector baseMap={baseMap} setBaseMap={setBaseMap} />

      <MapContainer 
        key={JSON.stringify(center)}
        center={center} 
        zoom={6} 
        style={{ height: "100%", width: "100%" }}
        maxBounds={[
          [-90, -180],
          [90, 180]
        ]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        <TileLayer
          attribution={tileConfigs[baseMap].attribution}
          url={tileConfigs[baseMap].url}
          noWrap={true}
        />

        {position.map((site) => (
          <MarkerSite
            key={site.idSitio}
            site={site}
            reports={siteReports?.get(site.idSitio) ?? null}
            status={siteStatus?.get(site.idSitio) ?? null}
            selectedYear={selectedYear}
          />
        ))}
      </MapContainer>
    </div>
  );
}
