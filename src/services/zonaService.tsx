import axios from "axios";
const API_URL = "http://localhost:8000/api";


export const postNewZona = async (newZona) => {
  try {
    const { data } = await axios.post(`${API_URL}/zona`, newZona);
    return data;
  } catch (error) {
    console.error("Error al crear la nueva zona:", error);
    throw error;
  }
};

export const getAllZonas = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/zonas`);
    return data;
  } catch (error) {
    console.error("Error al obtener las zonas:", error);
    throw error;
  }
};

export const getZonaByLocality = async (locality) => {
  try {
    const { data } = await axios.get(`${API_URL}/zona/locality/${encodeURIComponent(locality)}`);
    return data;
  } catch (error) {
    console.error("Error al obtener la zona por localidad:", error);
    throw error;
  }
};