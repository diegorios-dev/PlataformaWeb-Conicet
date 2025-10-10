import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getSitio = async (tipo: string) => {
  const { data } = await axios.get(`${API_URL}/reporte/${tipo}`);
  return data;
};

export const getReportsForSite = async (siteId: number, year?: number) => {
  const url = year 
    ? `${API_URL}/reportes/regular/site/${siteId}/${year}`
    : `${API_URL}/reportes/regular/site/${siteId}`;
  const { data } = await axios.get(url);
  return data;
}