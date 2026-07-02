import { useEffect, useState } from "react";
import { getAllZonas } from "@/features/zone/services";
import { getAllSites } from "@features/site/services";
import type { Site } from "@features/site/services";
import type { Zona } from "@features/zone/types";

export function useSitiosYzonas(reportSiteId?: number) {
  
  const [sitios, setSitios] = useState<Site[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);

  const [sitioSeleccionado, setSitioSeleccionado] = useState<Site | null>(null);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    loadSitios();
    loadZonas();
  }, []);

  useEffect(() => {
    if (sitios.length > 0 && reportSiteId) {
      const sitio = sitios.find(s => s.id === reportSiteId);
      if (sitio) {
        setSitioSeleccionado(sitio);
        setZonaSeleccionada(sitio.zona || null);
      }
    }
  }, [sitios, reportSiteId]);

  const loadSitios = async () => {
    try {
      const data = await getAllSites();
      setSitios(data);
    } catch {
      setError("Error al cargar los sitios");
    }
  };

  const loadZonas = async () => {
    try {
      const data = await getAllZonas();
      setZonas(data);
    } catch {
      setError("Error al cargar las zonas");
    }
  };

  const seleccionarSitio = (id: number) => {
    const sitio = sitios.find(s => s.id === id);
    if (!sitio) return;
    setSitioSeleccionado(sitio);
    setZonaSeleccionada(sitio.zona || null);
  };

  return {
    sitios,
    zonas,
    sitioSeleccionado,
    zonaSeleccionada,
    error,
    seleccionarSitio,
  };
}
