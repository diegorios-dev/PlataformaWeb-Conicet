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

export async function getHistograma(groupBy = "month", year = null, month = null) {
  let url = `http://localhost:8000/api/histograma?type=${groupBy}&precipitation=lluvia`;

  if (year) url += `&year=${year}`;
  if (month) url += `&month=${month}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al traer datos de lluvia");

  const json = await res.json();

  // Adaptar la data al formato que usa el gráfico
  return json.map((item) => {
    if (groupBy === "dia") {
      return { mes: item.date, lluvia: item.amount };
    } else if (groupBy === "mes") {
      const label = `${item.year}-${String(item.month).padStart(2, "0")}`;
      return { mes: label, lluvia: item.amount };
    } else if (groupBy === "año") {
      return { mes: item.year.toString(), lluvia: item.amount };
    }
  });
}