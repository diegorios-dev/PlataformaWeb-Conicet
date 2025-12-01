// services/reportes.ts (CORRECCIÓN)

import axios from "axios";
import { API_URL } from "@config/api";
import { invalidateEstadisticasCache } from "@features/Charts/services";
import { devLog } from "@shared/utils/errorHandler";

const API_URL_SERVICE = API_URL;

export const getReportes = async (order: 'asc' | 'desc' = 'asc') => {
  const { data } = await axios.get(`${API_URL_SERVICE}/reportes`, {
    params: { order }
  });
  return data;
};

export const updateReporte = async (id: number, data: any) => {
  try {   
    const response = await axios.put(`${API_URL_SERVICE}/reportes/${id}`, data);
    
    // Invalidar cache de estadísticas cuando se actualiza un reporte
    invalidateEstadisticasCache();
    
    return response.data;
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
    const response = await axios.post(`${API_URL_SERVICE}/reportes/rotura`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Invalidar cache de estadísticas cuando se crea un reporte
    invalidateEstadisticasCache();
    
    return response.data;
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
    const response = await axios.delete(`${API_URL_SERVICE}/reportes/rotura/${id}/resolve`);
    
    // Invalidar cache de estadísticas cuando se resuelve un reporte
    invalidateEstadisticasCache();
    
    return response.data;
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
    
    const url = `${API_URL_SERVICE}/histograma-temporal?${params.toString()}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Error al obtener histograma: ${res.status}`);
    }

    const json = await res.json();
    
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
    
    const url = `${API_URL_SERVICE}/histograma-temporal?${params.toString()}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Error al obtener histograma de nieve: ${res.status}`);
    }

    const json = await res.json();
    
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
    
    const url = `${API_URL_SERVICE}/histograma-temporal?${params.toString()}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Error al obtener histograma de caudal: ${res.status}`);
    }

    const json = await res.json();
    
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
