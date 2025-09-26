import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getReportes = async () => {
  const { data } = await axios.get(`${API_URL}/reportes`);
  return data;
};


export const getReportesById = async (id) => {
  const { data } = await axios.get(`${API_URL}/reportes/${id}`);
  return data;
};