import { httpGet, httpPost, httpPut, httpDelete } from "@shared/services";
import { invalidateEstadisticasCache } from "@features/Charts/services";
import { getCachedData, cache } from "@shared/utils/simpleCache";
import { validateZonaData } from "@shared/utils/validators";
import { devLog, getErrorMessage } from "@shared/utils/errorHandler";

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
const MAESTROS_TTL = 10 * 60 * 1000; // 10 minutos (datos más estables)


export const postNewZona = async (newZona: { locality: string }) => {
  try {
    // Validar datos antes de enviar
    const validationError = validateZonaData(newZona);
    if (validationError) {
      throw new Error(validationError);
    }

    // Verificar si ya existe
    let zonaExists = null;
    try {
      zonaExists = await getZonaByLocality(newZona.locality.trim());
    } catch (error) {
      // Si no existe, continuamos
    }

    if (zonaExists != null) {
      throw new Error("La zona con esta localidad ya existe");
    }
    
    const payload = {
      locality: newZona.locality.trim()
    };
    
    const data = await httpPost(`/v1/zones`, payload);
    
    // Invalidar cache cuando se crea una nueva zona
    cache.invalidate('maestros:zonas');
    invalidateEstadisticasCache();
    
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene todas las zonas del sistema (con cache)
 * Cache: 10 minutos (datos relativamente estables)
 */
export const getAllZonas = async () => {
  return getCachedData(
    'maestros:zonas',
    async () => {
      try {
        const data = await httpGet(`/v1/zones`);
        return data;
      } catch (error) {
        throw error;
      }
    },
    MAESTROS_TTL
  );
};

export const getZonaByLocality = async (zona: string) => {
  try {
    const data = await httpGet(`/v1/zones/locality/${encodeURIComponent(zona)}`);
    return data;
  } catch (error) {
    throw error;
  }
};

// **NUEVO ENDPOINT PRINCIPAL** - Precipitación total acumulada por zona
export const getTotalAcumuladoPorZona = async (periodo?: string) => {
  const cacheKey = `zonas:total-acumulado:${periodo || 'todos'}`;
  
  return getCachedData(
    cacheKey,
    async () => {
      let url = `/v1/zones/stats/accumulated`;
      if (periodo && periodo !== 'todos') {
        url += `?periodo=${periodo}`;
      }
      const data = await httpGet(url);
      return data.data || data;
    },
    DEFAULT_TTL
  );
};

// Top zonas por cantidad de registros
export const getTopZonasPorRegistro = async (periodo = "anio", limit = 8) => {
  const cacheKey = `zonas:top-registros:${periodo}:${limit}`;
  
  return getCachedData(
    cacheKey,
    async () => {
      const data = await httpGet(
        `/v1/zones/stats/top-records?periodo=${periodo}&limit=${limit}`
      );
      return data.data || data;
    },
    DEFAULT_TTL
  );
};

export const updateZona = async (id: string | number, zonaData: { locality: string }) => {
  try {
    // Validar datos antes de actualizar
    const validationError = validateZonaData(zonaData);
    if (validationError) {
      throw new Error(validationError);
    }

    const payload = {
      locality: zonaData.locality.trim()
    };

    const data = await httpPut(`/v1/zones/${id}`, payload);
    
    cache.invalidate('maestros:zonas');
    invalidateEstadisticasCache();
    
    return data;
  } catch (error) {
    devLog.error(`Error actualizando zona ${id}`, error);
    throw new Error(getErrorMessage(error));
  }
};

export const deleteZona = async (id: string) => {
  try {
    const data = await httpDelete(`/v1/zones/${id}`);
    
    cache.invalidate('maestros:zonas');
    invalidateEstadisticasCache();
    
    return data;
  } catch (error) {
    throw error;
  }
};
