import { useEffect, useState } from "react";
import { getAllZonas } from "@services/zonaService";
import { getAllSitios } from "@services/sitiosService";

export function useSitiosYzonas(reportSiteId?: number) {
  
  const [sitios, setSitios] = useState([]);
  const [zonas, setZonas] = useState([]);

  const [sitioSeleccionado, setSitioSeleccionado] = useState<any>(null);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<any>(null);

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
      const data = await getAllSitios();
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
