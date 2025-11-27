// src/components/MapHTML.tsx
import { useState, useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { tileConfigs } from "../constants/tileConfigs";
import { YearPicker } from "@shared/ui/molecules/YearPicker";
import { BaseMapSelector } from "./BaseMapSelector";
import { MarkerSite } from "./MarkerSite";
import { useAvailableYears } from "@/features/menu/components/hooks/useAvailableYears";
import { useSiteStatus } from "@/features/menu/components/hooks/useSiteStatus";
import { useSiteReports } from "@/features/menu/components/hooks/useSiteReports";
import { LoadingSpinner, EmptyMapState } from "@shared/ui/Loading/LoadingState";
import type { MapHTMLProps } from "../types/interfaces";

export default function MapHTML({ position, loading: externalLoading }: MapHTMLProps) {
  
  const [baseMap, setBaseMap] = useState<'original' | 'vegetacion' | 'topografia'>('vegetacion');
  const { availableYears, selectedYear, setSelectedYear } = useAvailableYears();
  
  // Hook para obtener el estado de los sitios
  const siteStatus = useSiteStatus(position);

  // ✅ OPTIMIZACIÓN: Memoizar el array de IDs para evitar recrearlo en cada render
  const ids = useMemo(() => position.map((p) => p.idSitio), [position]);
  const { siteReports, loadingReports } = useSiteReports(position, ids, selectedYear);

  // Estado de carga inicial
  if (externalLoading) {
    return (
      <LoadingSpinner 
        message="Cargando sitios..." 
        submessage={`Inicializando mapa...`}
        size="lg" 
      />
    );
  }

  // Estado vacío cuando no hay datos
  if (!position || position.length === 0) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <EmptyMapState />
      </div>
    );
  }

  // Cargando datos de reportes y estados
  const isStatusReady = position.every((coord) => siteStatus.has(coord.idSitio));
  if (loadingReports || !isStatusReady) {
    return (
      <LoadingSpinner 
        message="Cargando datos del mapa" 
        submessage={`Procesando ${position?.length || 0} sitios...`}
        size="lg" 
      />
    );
  }

  const center: [number, number] = position[0].coordenadas;

  return (
    <div className="relative w-full h-full">
      <YearPicker 
        availableYears={availableYears} 
        selectedYear={selectedYear} 
        onYearChange={setSelectedYear}
        className="absolute top-5 right-5 z-[1000]"
      />
      <BaseMapSelector 
        baseMap={baseMap} 
        setBaseMap={(value) => setBaseMap(value as 'original' | 'vegetacion' | 'topografia')} 
      />

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

        {position.map((site, index) => (
          <MarkerSite
            key={`${site.idSitio}-${site.tipo}-${index}`}
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
