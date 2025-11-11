// services/reportes.ts (CORRECCIÓN)

import axios from "axios";
import { API_URL } from "../config/api";
import { invalidateEstadisticasCache } from "./estadisticasService";

const API_URL_SERVICE = API_URL;

export const getReportes = async () => {
  const { data } = await axios.get(`${API_URL_SERVICE}/reportes`);
  return data;
};

export const updateReporte = async (id: number, data: any) => {
  try {   
    const response = await axios.put(`${API_URL_SERVICE}/reportes/${id}`, data);
    
    // Invalidar cache de estadísticas cuando se actualiza un reporte
    invalidateEstadisticasCache();
    
    return response.data;
  } catch (error: any) {
    console.error("Error en updateReporte:", error);
    console.error("Respuesta del error:", error.response?.data);
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
  } catch (error: any) {
    console.error("Error en createReporteRotura:", error);
    console.error("Respuesta del error:", error.response?.data);
    throw error;
  }
};

/**
 * Resuelve un reporte de rotura marcándolo como reparado
 * @param id ID del reporte de rotura
 * @param data FormData con la información de resolución
 */
export const resolveReporteRotura = async (id: number, data: FormData) => {
  try {
    const response = await axios.delete(`${API_URL_SERVICE}/reportes/rotura/${id}/resolve`, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data, // En DELETE, el body se envía como 'data'
    });
    
    // Invalidar cache de estadísticas cuando se resuelve un reporte
    invalidateEstadisticasCache();
    
    return response.data;
  } catch (error: any) {
    console.error("Error en resolveReporteRotura:", error);
    console.error("Respuesta del error:", error.response?.data);
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
  // Mapeo de nombres frontend → backend
  const periodoMap: Record<string, string> = {
    'dia': 'dia',
    'mes': 'mes',
    'año': 'año',
    'year': 'año' // alias
  };
  
  const periodo = periodoMap[groupBy] || 'mes';
  
  // Construir query params
  const params = new URLSearchParams();
  params.append('periodo', periodo);
  params.append('tipo_evento', 'Lluvia'); // Puedes hacer esto configurable
  
  if (year) {
    params.append('year', year.toString());
  }
  
  if (month && periodo === 'dia') {
    params.append('month', month.toString());
  }
  
  const url = `${API_URL_SERVICE}/histograma-temporal?${params.toString()}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al traer datos de lluvia");
  }

  const json = await res.json();
  
  // El backend devuelve { success, data: [{ label, value }], metadata }
  if (!json.success || !json.data) {
    console.warn('Respuesta inesperada del backend:', json);
    return [];
  }
  
  // Ya viene en el formato correcto [{ label, value }]
  return json.data;
}

/**
 * Obtiene el histograma de nieve
 */
export async function getHistogramaNieve(
  groupBy: string = "mes", 
  year: number | null = null, 
  month: number | null = null
) {
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
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al traer datos de nieve");
  }

  const json = await res.json();
  
  if (!json.success || !json.data) {
    console.warn('Respuesta inesperada del backend:', json);
    return [];
  }
  
  return json.data;
}

/**
 * Obtiene el histograma de caudal
 */
export async function getHistogramaCaudalimetro(
  groupBy: string = "mes", 
  year: number | null = null, 
  month: number | null = null
){
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
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al traer datos de caudalímetro");
  }

  const json = await res.json();
  
  if (!json.success || !json.data) {
    console.warn('Respuesta inesperada del backend:', json);
    return [];
  }
  
  return json.data;
}
