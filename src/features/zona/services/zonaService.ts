import axios from "axios";
import { API_URL } from "@config/api";
import { invalidateEstadisticasCache } from "@features/Charts/services";
import { getCachedData } from "@shared/utils/simpleCache";
import { validateZonaData } from "@shared/utils/validators";
import { devLog, getErrorMessage } from "@shared/utils/errorHandler";

const API_URL_SERVICE = API_URL;
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos


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
    
    const { data } = await axios.post(`${API_URL_SERVICE}/zona/register/`, payload);
    
    // Invalidar cache cuando se crea una nueva zona
    invalidateEstadisticasCache();
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllZonas = async () => {
  try {
    const { data } = await axios.get(`${API_URL_SERVICE}/zonas`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getZonaByLocality = async (zona: string) => {
  try {
    const consulta = API_URL + "/zona/locality/" + encodeURIComponent(zona);
    const { data } = await axios.get(`${API_URL_SERVICE}/zona/locality/${encodeURIComponent(zona)}`);
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
      let url = `${API_URL_SERVICE}/zonas/total-acumulado`;
      if (periodo && periodo !== 'todos') {
        url += `?periodo=${periodo}`;
      }
      const { data } = await axios.get(url);
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
      const { data } = await axios.get(
        `${API_URL_SERVICE}/zonas/top-registros?periodo=${periodo}&limit=${limit}`
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

    const response = await axios.put(`${API_URL_SERVICE}/zonas/${id}`, payload);
    invalidateEstadisticasCache();
    return response.data;
  } catch (error) {
    devLog.error(`Error actualizando zona ${id}`, error);
    throw new Error(getErrorMessage(error));
  }
};

export const deleteZona = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL_SERVICE}/zonas/${id}`);
    invalidateEstadisticasCache();
    return response.data;
  } catch (error) {
    throw error;
  }
};
