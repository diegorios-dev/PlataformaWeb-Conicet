import axios from "axios";
import { API_URL } from "../config/api";
import { invalidateEstadisticasCache } from "./estadisticasService";
import { getCachedData } from "../utils/simpleCache";

const API_URL_SERVICE = API_URL;
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos


export const postNewZona = async (newZona) => {
  try {

    let zonaExists = null;
    try {
      zonaExists = await getZonaByLocality(newZona);
    } catch (error) {
      console.log("No se encontró la zona, se procederá a crearla.");
    }

    if (zonaExists != null) {
      console.log("La zona con esta localidad ya existe.");
      throw new Error("La zona con esta localidad ya existe.");
    } else {
      console.log("La zona con esta localidad no existe. Procediendo a crearla.");
    }
    
    const { data } = await axios.post(`${API_URL_SERVICE}/zona/register/`, newZona);
    
    // Invalidar cache cuando se crea una nueva zona
    invalidateEstadisticasCache();
    
    return data;
  } catch (error) {
    console.error("Error al crear la nueva zona:", error);
    throw error;
  }
};

export const getAllZonas = async () => {
  try {
    const { data } = await axios.get(`${API_URL_SERVICE}/zonas`);
    return data;
  } catch (error) {
    console.error("Error al obtener las zonas:", error);
    throw error;
  }
};

export const getZonaByLocality = async (zona) => {
  try {
    const consulta = API_URL + "/zona/locality/" + encodeURIComponent(zona.locality);
    console.log(" 2 Consulta a realizar: ", consulta);
    const { data } = await axios.get(`${API_URL_SERVICE}/zona/locality/${encodeURIComponent(zona.locality)}`);
    return data;
  } catch (error) {
    console.log("Error al obtener la zona por localidad:", error);

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
