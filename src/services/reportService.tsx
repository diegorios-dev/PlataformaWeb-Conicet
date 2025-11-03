import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getReportes = async () => {
  const { data } = await axios.get(`${API_URL}/reportes`);
  return data;
};

export const updateReporte = async (id: number, data: any) => {
  try {   
    const response = await axios.put(`${API_URL}/reportes/${id}`, data);
    
    return response.data;
  } catch (error: any) {
    console.error("Error en updateReporte:", error);
    console.error("Respuesta del error:", error.response?.data);
    throw error;
  }
};

export const getHistogramaLluvia = async (periodo, year, month) => {
  const params = new URLSearchParams();
  
  params.append('periodo', periodo);
  params.append('tipo_evento', 'Lluvia');
  
  if (year) params.append('year', year);
  if (month) params.append('month', month);

  const response = await fetch(`${API_URL}/histograma-temporal?${params}`);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message || 'Error al obtener histograma');
  }

  // El backend ya devuelve en formato correcto: [{label, value}]
  return json.data || [];
};

/**
 * Obtiene histograma de Nieve agrupado por día/mes/año
 * @param {string} periodo - 'dia', 'mes', 'año'
 * @param {number} year - Año (requerido para 'mes' y 'dia')
 * @param {number} month - Mes (requerido solo para 'dia')
 * @returns {Promise<Array>} Array con formato [{label, value}]
 */
export const getHistogramaNieve = async (periodo, year, month) => {
  const params = new URLSearchParams();
  
  params.append('periodo', periodo);
  params.append('tipo_evento', 'Nieve');
  
  if (year) params.append('year', year);
  if (month) params.append('month', month);

  const response = await fetch(`${API_URL}/histograma-temporal?${params}`);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message || 'Error al obtener histograma');
  }

  return json.data || [];
};

/**
 * Obtiene histograma de Caudal agrupado por día/mes/año
 * @param {string} periodo - 'dia', 'mes', 'año'
 * @param {number} year - Año (requerido para 'mes' y 'dia')
 * @param {number} month - Mes (requerido solo para 'dia')
 * @returns {Promise<Array>} Array con formato [{label, value}]
 */
export const getHistogramaCaudal = async (periodo, year, month) => {
  const params = new URLSearchParams();
  
  params.append('periodo', periodo);
  params.append('tipo_evento', 'Caudal');
  
  if (year) params.append('year', year);
  if (month) params.append('month', month);

  const response = await fetch(`${API_URL}/histograma-temporal?${params}`);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message || 'Error al obtener histograma');
  }

  return json.data || [];
};