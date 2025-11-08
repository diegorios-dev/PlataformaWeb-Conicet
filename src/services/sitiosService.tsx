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

export const postNewSite = async (newSite) => {
  try {
    const { data } = await axios.post(`${API_URL}/site/register`, newSite);
    return data;
  } catch (error) {
    console.error("Error al crear sitio:", error);
    throw error;
  }
};

