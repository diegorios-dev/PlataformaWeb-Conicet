import { httpGet, httpPost, httpPut, httpDelete } from "@shared/services";
import { invalidateEstadisticasCache } from "@features/Charts/services";
import { getCachedData, cache } from "@shared/utils/simpleCache";
import { devLog, getErrorMessage } from "@shared/utils/errorHandler";
import { 
  validateLatitude, 
  validateLongitude, 
  validatePositiveId,
  validateText 
} from "@shared/utils/validators";
import type { 
  SiteReportSummary, 
  SiteReportsSummaryResponse 
} from "./types/siteReportsSummary.types";
import type { Site, SiteFormData } from "../types/site.types";
export type { Site, SiteFormData } from "../types/site.types";

// ==================== CONSTANTES ====================

const MAESTROS_TTL = 10 * 60 * 1000; // 10 minutos (datos relativamente estables)

// ==================== INTERFACES ====================

export interface SiteResponse {
  message?: string;
  data?: Site;
}

interface BatchSiteReports { 
  siteId: number; 
  reports: any[] 
}

// ==================== CRUD DE SITIOS ====================

/**
 * Obtiene todos los sitios del sistema (con cache)
 * Cache: 10 minutos (datos relativamente estables)
 */
export const getAllSites = async (): Promise<Site[]> => {
  return getCachedData(
    'maestros:sites',
    async () => {
      try {
        const data = await httpGet<Site[]>(`/v1/sites`);
        
        if (!Array.isArray(data)) {
          devLog.warn('Datos de sitios inválidos', data);
          return [];
        }
        
        return data;
      } catch (error) {
        devLog.error('Error obteniendo sitios', error);
        throw new Error(getErrorMessage(error));
      }
    },
    MAESTROS_TTL
  );
};

/**
 * Obtiene un sitio por su ID
 * Nota: El backend no tiene endpoint GET /sitios/{id}, por lo que obtenemos todos y filtramos
 */
export const getSiteById = async (siteId: number): Promise<Site> => {
  try {
    const allSites = await getAllSites();
    const site = allSites.find(s => s.id === siteId);
    
    if (!site) {
      throw new Error(`Sitio con ID ${siteId} no encontrado`);
    }
    
    return site;
  } catch (error) {
    devLog.error(`Error obteniendo sitio ${siteId}`, error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Crea un nuevo sitio
 */
export const createSite = async (siteData: Site): Promise<SiteResponse> => {
  try {
    const data = await httpPost<any>(`/v1/sites`, siteData);
    
    cache.invalidate('maestros:sites');
    invalidateEstadisticasCache();
    
    return {
      message: data?.message || "Sitio creado exitosamente",
      data,
    };
  } catch (error) {
    devLog.error('Error creando sitio', error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Crea un nuevo sitio (alias para compatibilidad)
 */
export const postNewSite = async (newSite: SiteFormData) => {
  try {
    const data = await httpPost(`/v1/sites`, newSite);
    
    cache.invalidate('maestros:sites');
    invalidateEstadisticasCache();
    
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualiza un sitio existente
 */
export const updateSite = async (
  siteId: number,
  siteData: Partial<Site>
): Promise<SiteResponse> => {
  try {
    const data = await httpPut<any>(`/v1/sites/${siteId}`, siteData);
    
    cache.invalidate('maestros:sites');
    invalidateEstadisticasCache();
    
    return {
      message: data?.message || "Sitio actualizado exitosamente",
      data,
    };
  } catch (error) {
    devLog.error(`Error actualizando sitio ${siteId}`, error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Elimina un sitio
 */
export const deleteSite = async (siteId: number): Promise<SiteResponse> => {
  try {
    const data = await httpDelete<any>(`/v1/sites/${siteId}`);
    
    cache.invalidate('maestros:sites');
    invalidateEstadisticasCache();
    
    return {
      message: data?.message || "Sitio eliminado exitosamente",
      data,
    };
  } catch (error) {
    devLog.error(`Error eliminando sitio ${siteId}`, error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Obtiene resúmenes agregados de reportes para múltiples sitios.
 * Este endpoint es OPTIMIZADO - el backend calcula las sumas en SQL.
 * 
 * @param siteIds - Array de IDs de sitios
 * @param year - Año opcional para filtrar reportes
 * @returns Array de resúmenes con totales calculados
 * 
 * @example
 * const summaries = await getSiteReportsSummary([1, 2, 3], 2024);
 * // Returns: [
 * //   { siteId: 1, totalAmount: 150.5, reportCount: 25, lastReport: {...} },
 * //   { siteId: 2, totalAmount: 89.3, reportCount: 18, lastReport: {...} }
 * // ]
 */
export const getSiteReportsSummary = async (
  siteIds: number[],
  year?: number
): Promise<SiteReportSummary[]> => {
  if (!siteIds || siteIds.length === 0) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      siteIds: siteIds.join(','),
      ...(year && { year: year.toString() })
    });

    const response = await httpGet<SiteReportsSummaryResponse>(
      `/v1/sites/reports-summary?${params.toString()}`
    );

    // Normalize response structure
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }

    // Handle direct array response
    if (Array.isArray(response)) {
      return response;
    }

    devLog.warn('Invalid response format from reports-summary endpoint', response);
    return [];
  } catch (error) {
    devLog.error('Error fetching site reports summary', error);
    throw new Error(getErrorMessage(error));
  }
};

// ==================== REPORTES Y CONSULTAS ====================

/**
 * Obtiene sitios por tipo
 */
export const getSites = async (tipo: string | number | null | undefined) => {
  const safeTipo = tipo == null ? "" : String(tipo);
  const data = await httpGet(`/reports/regular/type/${safeTipo}`);
  return data;
};

/**
 * Obtiene los reportes para un sitio específico
 */
export const getReportsForSite = async (siteId: number, year?: number) => {
  const url = year 
    ? `/reports/regular/site/${siteId}/${year}`
    : `/reports/regular/site/${siteId}`;
  const data = await httpGet(url);
  return data;
};

/**
 * Obtiene los reportes para múltiples sitios en una sola llamada.
 * Requiere un endpoint backend: GET /reportes/regular/sites?ids=1,2,3&year=2024
 * Si el endpoint no existe aún, hace fallback a múltiples llamadas individuales en paralelo.
 */
export const getReportsForSites = async (siteIds: number[], year?: number): Promise<BatchSiteReports[]> => {
  if (!siteIds || siteIds.length === 0) return [];

  const params = new URLSearchParams();
  params.append('ids', siteIds.join(','));
  if (year) params.append('year', String(year));

  try {
    const data = await httpGet(`/v1/reports/regular/sites/batch?${params.toString()}`);
    // Normalizamos a array de { siteId, reports }
    if (Array.isArray(data)) {
      return data.map(item => ({ 
        siteId: item.siteId || item.site_id || item.id, 
        reports: item.reports || item.data || [] 
      }));
    } else if (data && typeof data === 'object') {
      return Object.entries(data).map(([key, value]: [string, any]) => ({ 
        siteId: Number(key), 
        reports: Array.isArray(value) ? value : (value?.reports || []) 
      }));
    }
    return [];
  } catch (error: unknown) {
    // Fallback: llamadas individuales en paralelo
    const results = await Promise.all(
      siteIds.map(async (id) => {
        try {
          const reports = await getReportsForSite(id, year);
          return { siteId: id, reports: reports || [] };
        } catch (e) {
          return { siteId: id, reports: [] };
        }
      })
    );
    return results;
  }
};

/**
 * Obtiene los años disponibles con reportes
 */
export const getAvailableYears = async () => {
  const data = await httpGet(`/reports/metadata/years`);
  return data;
};

/**
 * Obtiene el estado de un sitio (instrumentos averiados, etc.)
 */
export const getStatusSite = async (siteId: number) => {
  try {
    const allSites = await getAllSites();
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
    throw error;
  }
};

// ==================== VALIDACIÓN ====================

/**
 * Valida los datos de un sitio
 */
export const validateSiteData = (siteData: Partial<Site>): string | null => {
  // Validar nombre usando la función de validators
  const nombreError = validateText(siteData.nombre || '', 3, 100, 'El nombre del sitio');
  if (nombreError) return nombreError;
  
  // Validar latitud
  const latError = validateLatitude(siteData.latitude);
  if (latError) return latError;
  
  // Validar longitud
  const lngError = validateLongitude(siteData.longitude);
  if (lngError) return lngError;
  
  // Validar zona
  const zonaError = validatePositiveId(siteData.zona_id, 'La zona');
  if (zonaError) return zonaError;
  
  // Validar evento
  const eventoError = validatePositiveId(siteData.event_id, 'El evento');
  if (eventoError) return eventoError;
  
  // Validar cota si existe (es opcional)
  if (siteData.cota !== undefined && siteData.cota !== null && siteData.cota !== '') {
    const cota = Number(siteData.cota);
    if (isNaN(cota)) {
      return 'La cota debe ser un número válido';
    }
    if (cota < -500 || cota > 10000) {
      return 'La cota debe estar entre -500 y 10000 metros';
    }
  }
  
  return null;
};
