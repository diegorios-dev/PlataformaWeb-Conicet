// src/hooks/useSiteStatus.ts
import { useEffect, useState, useRef } from "react";
import { getStatusSite } from "@features/site/services";
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
        // Ejecutar en paralelo
        const promises = position.map(async (coord) => {
          if (!coord?.idSitio) return null;
          try {
            const status = await getStatusSite(coord.idSitio);
            return [coord.idSitio, status] as [number, SiteStatus];
          } catch (err) {
            // Fallback limpio en caso de error
            return [
              coord.idSitio,
              {
                status: true,
                tiene_instrumentos_averiados: false,
                instrumentos_averiados: [],
              },
            ] as [number, SiteStatus];
          }
        });

        const entries = (await Promise.all(promises)).filter(Boolean) as [
          number,
          SiteStatus
        ][];

        if (!mounted) return;

        setSiteStatus(new Map(entries));
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
