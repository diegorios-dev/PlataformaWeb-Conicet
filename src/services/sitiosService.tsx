import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getSitio = async (tipo: string) => {
  const { data } = await axios.get(`${API_URL}/reporte/${tipo}`);
  return data;
};

export const getAllSitios = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/sitios`);
    return data;
  } catch (error) {
    console.error("Error al obtener sitios:", error);
    throw error;
  }
};

export const getReportsForSite = async (siteId: number, year?: number) => {
  const url = year 
    ? `${API_URL}/reportes/regular/site/${siteId}/${year}`
    : `${API_URL}/reportes/regular/site/${siteId}`;
  const { data } = await axios.get(url);
  return data;
};

export const getAvailableYears = async () => {
  const { data } = await axios.get(`${API_URL}/reportes/available-years`);
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

export const postNewSite = async (newSite) => {
  try {
    const { data } = await axios.post(`${API_URL}/site/register`, newSite);
    return data;
  } catch (error) {
    console.error("Error al crear sitio:", error);
    throw error;
  }
};

