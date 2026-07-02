// src/components/MapHTML.tsx
import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { tileConfigs } from "../constants/tileConfigs";
import { YearPicker } from "@shared/ui/molecules/YearPicker";
import { BaseMapSelector } from "./BaseMapSelector";
import { MarkerSite } from "./MarkerSite";
import { useAvailableYears } from "@/features/menu/components/hooks/useAvailableYears";
import { useSiteStatus } from "@/features/menu/components/hooks/useSiteStatus";
import { useSiteReports } from "@/features/menu/components/hooks/useSiteReports";
import { EmptyMapState , LoadingMapConicet } from "@shared/ui/Loading/LoadingState";
import { devLog } from "@shared/utils/errorHandler";
import { isValidCoordinate } from "@shared/utils/coordinateValidation";
import type { MapHTMLProps } from "../types/interfaces";


export default function MapHTML({ position, loading: externalLoading, userRole }: MapHTMLProps) {
  
  const [baseMap, setBaseMap] = useState<'original' | 'vegetacion' | 'topografia'>('vegetacion');
  const { availableYears, selectedYear, setSelectedYear } = useAvailableYears();
  
  // Hook para obtener el estado de los sitios
  const siteStatus = useSiteStatus(position);

  //  OPTIMIZACIÓN: Memoizar el array de IDs para evitar recrearlo en cada render
  const ids = useMemo(() => position.map((p) => p.idSitio), [position]);
  const { siteReports, loadingReports } = useSiteReports(position, ids, selectedYear);

  // Filtrar solo posiciones con coordenadas válidas
  const validPositions = useMemo(() => 
    position.filter(p => isValidCoordinate(p.coordenadas)),
    [position]
  );

  devLog.info('Site reports loaded', siteReports);

  // Estado de carga inicial
  if (externalLoading) {
    return (
      <LoadingMapConicet 
        message="CONICET"
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
      <LoadingMapConicet 
        message="CONICET" 
        size="lg"
      />
    );
  }

  // Usar primera posición válida o coordenada por defecto
  const center: [number, number] = validPositions.length > 0 
    ? validPositions[0].coordenadas 
    : [-38.95, -68.06]; // Neuquén, Argentina

  // Componente para invalidar el tamaño del mapa cuando cambia el contenedor
  function MapResizeHandler() {
    const map = useMap();
    
    useEffect(() => {
      // Invalidar tamaño cuando el componente se monta
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 100);

      // Agregar listener para resize de ventana
      const handleResize = () => {
        map.invalidateSize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }, [map]);

    return null;
  }

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
        positionClasses="top-40 right-4"
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
        <MapResizeHandler />
        <TileLayer
          attribution={tileConfigs[baseMap].attribution}
          url={tileConfigs[baseMap].url}
          noWrap={true}
        />

        {validPositions.map((site, index) => (
          <MarkerSite
            key={`${site.idSitio}-${site.tipo}-${index}`}
            site={site}
            reports={siteReports?.get(site.idSitio) ?? null}
            status={siteStatus?.get(site.idSitio) ?? null}
            selectedYear={selectedYear}
            userRole={userRole}
          />
        ))}
      </MapContainer>
    </div>
  );
}
