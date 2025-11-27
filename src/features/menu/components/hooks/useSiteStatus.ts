// src/hooks/useSiteStatus.ts
import { useEffect, useState, useRef } from "react";
import { getAllSitios } from "@features/site/services";
import type { Coord, SiteStatus } from "../types/interfaces";

export function useSiteStatus(position: Coord[]) {
  const [siteStatus, setSiteStatus] = useState<Map<number, SiteStatus>>(new Map());
  const lastPositionsRef = useRef<string>("");

  useEffect(() => {
    if (!position || position.length === 0) {
      setSiteStatus(new Map());
      return;
    }

    // Simple key para evitar refetch si el array no cambió realmente (por referencia distinta)
    const key = position.map((p) => p.idSitio).join(",");
    if (key === lastPositionsRef.current) return;
    lastPositionsRef.current = key;

    let mounted = true;

    const fetchStatus = async () => {
      try {
        // ✅ OPTIMIZACIÓN: Llamar getAllSitios UNA SOLA VEZ en lugar de N veces
        const allSites = await getAllSitios();
        
        // Crear mapa de estados desde todos los sitios
        const statusMap = new Map<number, SiteStatus>();
        
        position.forEach((coord) => {
          if (!coord?.idSitio) return;
          
          const site = allSites.find((s: any) => s.id === coord.idSitio);
          
          if (site) {
            statusMap.set(coord.idSitio, {
              status: site.status,
              tiene_instrumentos_averiados: site.tiene_instrumentos_averiados,
              instrumentos_averiados: site.instrumentos_averiados || []
            });
          } else {
            // Fallback si no se encuentra
            statusMap.set(coord.idSitio, {
              status: true,
              tiene_instrumentos_averiados: false,
              instrumentos_averiados: []
            });
          }
        });

        if (!mounted) return;

        setSiteStatus(statusMap);
      } catch (e) {
        if (!mounted) return;
        setSiteStatus(new Map());
      }
    };

    fetchStatus();

    return () => {
      mounted = false;
    };
  }, [position]);

  return siteStatus;
}
