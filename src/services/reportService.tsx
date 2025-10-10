import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getReportes = async () => {
  const { data } = await axios.get(`${API_URL}/reportes`);
  return data;
};

export const updateReporte = async (id: number, data: any) => {
  const response = await axios.put(`${API_URL}/reportes/${id}`, data);
  return response.data;
};