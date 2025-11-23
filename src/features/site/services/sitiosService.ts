import axios from "axios";
import { API_URL } from "@config/api";
import { invalidateEstadisticasCache } from "@features/Charts/services";

const API_URL_SERVICE = API_URL;

export const getSitio = async (tipo: string) => {
  const { data } = await axios.get(`${API_URL_SERVICE}/reporte/${tipo}`);
  return data;
};

export const getAllSitios = async () => {
  try {
    const { data } = await axios.get(`${API_URL_SERVICE}/sitios`);
    return data;
  } catch (error) {
    console.error("Error al obtener sitios:", error);
    throw error;
  }
};

export const getReportsForSite = async (siteId: number, year?: number) => {
  const url = year 
    ? `${API_URL_SERVICE}/reportes/regular/site/${siteId}/${year}`
    : `${API_URL_SERVICE}/reportes/regular/site/${siteId}`;
  const { data } = await axios.get(url);
  return data;
};

/**
 * Obtiene los reportes para múltiples sitios en una sola llamada.
 * Requiere un endpoint backend: GET /reportes/regular/sites?ids=1,2,3&year=2024
 * Si el endpoint no existe aún, hace fallback a múltiples llamadas individuales en paralelo.
 * Shape esperado de respuesta primaria (ideal):
 *   [ { siteId: number, reports: Array<any> } ]
 * Alternativamente podría venir como objeto: { [siteId:number]: Array<any> }
 */
interface BatchSiteReports { siteId: number; reports: any[] }

export const getReportsForSites = async (siteIds: number[], year?: number): Promise<BatchSiteReports[]> => {
  if (!siteIds || siteIds.length === 0) return [];

  const params = new URLSearchParams();
  params.append('ids', siteIds.join(','));
  if (year) params.append('year', String(year));

  try {
    const { data } = await axios.get(`${API_URL_SERVICE}/reportes/regular/sites?${params.toString()}`);
    // Normalizamos a array de { siteId, reports }
    if (Array.isArray(data)) {
      return data.map(item => ({ siteId: item.siteId || item.site_id || item.id, reports: item.reports || item.data || [] }));
    } else if (data && typeof data === 'object') {
      return Object.entries(data).map(([key, value]: [string, any]) => ({ siteId: Number(key), reports: Array.isArray(value) ? value : (value?.reports || []) }));
    }
    return [];
  } catch (error: any) {
    console.warn('Endpoint batch no disponible, fallback a llamadas individuales:', error?.message || error);
    // Fallback: llamadas individuales en paralelo
    const results = await Promise.all(
      siteIds.map(async (id) => {
        try {
          const reports = await getReportsForSite(id, year);
          return { siteId: id, reports: reports || [] };
        } catch (e) {
          console.error('Error obteniendo sitio', id, e);
          return { siteId: id, reports: [] };
        }
      })
    );
    return results;
  }
};

export const getAvailableYears = async () => {
  const { data } = await axios.get(`${API_URL_SERVICE}/reportes/available-years`);
  return data;
};

export const getStatusSite = async (siteId: number) => {
  try {
    // Obtener todos los sitios y filtrar por el ID requerido
    const allSites = await getAllSitios();
    const site = allSites.find((s: any) => s.id === siteId);
    
    if (site) {
      return {
        status: site.status,
        tiene_instrumentos_averiados: site.tiene_instrumentos_averiados,
        instrumentos_averiados: site.instrumentos_averiados || []
      };
    }
    
    // Si no se encuentra el sitio, retornar estado sano por defecto
    return {
      status: true,
      tiene_instrumentos_averiados: false,
      instrumentos_averiados: []
    };
  } catch (error) {
    console.error(`Error al obtener status del sitio ${siteId}:`, error);
    throw error;
  }
};

export const postNewSite = async (newSite: Record<string, any>) => {
  try {
    const { data } = await axios.post(`${API_URL_SERVICE}/site/register`, newSite);
    
    // Invalidar cache cuando se crea un nuevo sitio
    invalidateEstadisticasCache();
    
    return data;
  } catch (error) {
    console.error("Error al crear sitio:", error);
    throw error;
  }
};

export const updateSite = async (id: number, data: Record<string, any>) => {
  try {
    const { response } = await axios.put(`${API_URL_SERVICE}/site/${id}`, data);
    invalidateEstadisticasCache();
    return response;
  } catch (error) {
    console.error("Error al editar sitio:", error);
    throw error;
  }
};

export const deleteSite = async (id: number) => {
  try {
    const { response } = await axios.delete(`${API_URL_SERVICE}/site/${id}`);
    invalidateEstadisticasCache();
    return response;
  } catch (error) {
    console.error("Error al eliminar sitio:", error);
    throw error;
  }
};