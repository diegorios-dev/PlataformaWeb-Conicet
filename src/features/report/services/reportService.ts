// services/reportes.ts (CORRECCIÓN)

import { httpGet, httpPost, httpPut, httpDelete } from "@shared/services";
import { invalidateEstadisticasCache } from "@features/Charts/services";
import { devLog } from "@shared/utils/errorHandler";

export interface PaginatedReports {
  current_page: number;
  data: any[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ReportsParams {
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export const getReportes = async (params: ReportsParams = {}) => {
  const { order = 'asc', page = 1, per_page = 15 } = params;
  
  const data = await httpGet<PaginatedReports>(`/reports`, {
    params: { order, page, per_page }
  });
  return data;
};

export const updateReporte = async (id: number, data: any) => {
  try {   
    const response = await httpPut(`/reports/${id}`, data);
    
    // Invalidar cache de estadísticas cuando se actualiza un reporte
    invalidateEstadisticasCache();
    
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Crea un nuevo reporte de rotura
 * @param data FormData con los campos del reporte de rotura
 */
export const createReporteRotura = async (data: FormData) => {
  try {
    const response = await httpPost(`/breakage-reports`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Invalidar cache de estadísticas cuando se crea un reporte
    invalidateEstadisticasCache();
    
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Resuelve/elimina un reporte de rotura
 * @param id ID del reporte de rotura
 */
export const resolveReporteRotura = async (id: number) => {
  try {
    const response = await httpDelete(`/breakage-reports/${id}`);
    
    // Invalidar cache de estadísticas cuando se resuelve un reporte
    invalidateEstadisticasCache();
    
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Obtiene el histograma temporal (agregado por día/mes/año)
 * 
 * Backend espera:
 * - periodo: 'dia' | 'mes' | 'año'
 * - tipo_evento: 'Lluvia' | 'Nieve' | 'Caudal' (opcional)
 * - year: número (obligatorio para mes y dia)
 * - month: número (obligatorio solo para dia)
 * 
 * Devuelve: { success, data: [{ label, value }], metadata }
 */
export async function getHistograma(
  groupBy: string = "mes", 
  year: number | null = null, 
  month: number | null = null
) {
  try {
    // Mapeo de nombres frontend → backend
    const periodoMap: Record<string, string> = {
      'dia': 'dia',
      'mes': 'mes',
      'año': 'año',
      'year': 'año'
    };
    
    const periodo = periodoMap[groupBy] || 'mes';
    
    // Construir query params
    const params = new URLSearchParams();
    params.append('periodo', periodo);
    params.append('tipo_evento', 'Lluvia');
    
    if (year) {
      params.append('year', year.toString());
    }
    
    if (month && periodo === 'dia') {
      params.append('month', month.toString());
    }
    
    const url = `/reports/stats/histogram-temporal?${params.toString()}`;
    const json = await httpGet(url);
    
    // Validar que tenga la estructura esperada
    if (!json.success || !json.data) {
      devLog.warn('Respuesta sin datos válidos', json);
      return [];
    }
    
    // Validar que data sea un array
    if (!Array.isArray(json.data)) {
      devLog.warn('json.data no es un array', json.data);
      return [];
    }
    
    return json.data;
  } catch (error) {
    devLog.error('Error en getHistograma', error);
    throw error;
  }
}

/**
 * Obtiene el histograma de nieve
 */
export async function getHistogramaNieve(
  groupBy: string = "mes", 
  year: number | null = null, 
  month: number | null = null
) {
  try {
    const periodoMap: Record<string, string> = {
      'dia': 'dia',
      'mes': 'mes',
      'año': 'año',
      'year': 'año'
    };
    
    const periodo = periodoMap[groupBy] || 'mes';
    
    const params = new URLSearchParams();
    params.append('periodo', periodo);
    params.append('tipo_evento', 'Nieve');
    
    if (year) params.append('year', year.toString());
    if (month && periodo === 'dia') params.append('month', month.toString());
    
    const url = `/reports/stats/histogram-temporal?${params.toString()}`;
    const json = await httpGet(url);
    
    if (!json.success || !json.data) {
      devLog.warn('Respuesta sin datos válidos para nieve', json);
      return [];
    }
    
    if (!Array.isArray(json.data)) {
      devLog.warn('json.data no es un array', json.data);
      return [];
    }
    
    return json.data;
  } catch (error) {
    devLog.error('Error en getHistogramaNieve', error);
    throw error;
  }
}

/**
 * Obtiene el histograma de caudal
 */
export async function getHistogramaCaudalimetro(
  groupBy: string = "mes", 
  year: number | null = null, 
  month: number | null = null
){
  try {
    const periodoMap: Record<string, string> = {
      'dia': 'dia',
      'mes': 'mes',
      'año': 'año',
      'year': 'año'
    };
    
    const periodo = periodoMap[groupBy] || 'mes';
    
    const params = new URLSearchParams();
    params.append('periodo', periodo);
    params.append('tipo_evento', 'Caudal');
    
    if (year) params.append('year', year.toString());
    if (month && periodo === 'dia') params.append('month', month.toString());
    
    const url = `/reports/stats/histogram-temporal?${params.toString()}`;
    const json = await httpGet(url);
    
    if (!json.success || !json.data) {
      devLog.warn('Respuesta sin datos válidos para caudal', json);
      return [];
    }
    
    if (!Array.isArray(json.data)) {
      devLog.warn('json.data no es un array', json.data);
      return [];
    }
    
    return json.data;
  } catch (error) {
    devLog.error('Error en getHistogramaCaudalimetro', error);
    throw error;
  }
}
