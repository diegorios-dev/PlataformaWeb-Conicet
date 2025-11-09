import axios from "axios";
import { API_URL } from "../config/api";

const API_URL_SERVICE = API_URL;

// Precipitación total por zona
export const getPrecipitacionPorZona = async () => {
  const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/precipitacion-por-zona`);
  return data;
};

// Reportes por instrumento
export const getReportesPorInstrumento = async () => {
  const { data } = await axios.get(`${API_URL_SERVICE}/reportes/por-instrumento`);
  return data.data || data;
};

// Top zonas por cantidad de registros
export const getTopZonasPorRegistro = async (limit: number = 10) => {
  const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/top-zonas-por-registro?limit=${limit}`);
  return data;
};

// Distribución de instrumentos por tipo
export const getDistribucionInstrumentos = async () => {
  const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/distribucion-instrumentos`);
  return data;
};

// Reportes por mes/año
export const getReportesPorPeriodo = async () => {
  const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/reportes-por-periodo`);
  return data;
};

// Evolución temporal por zona
export const getEvolucionPorZona = async (zonaId?: number) => {
  const url = zonaId 
    ? `${API_URL_SERVICE}/estadisticas/evolucion-por-zona?zonaId=${zonaId}`
    : `${API_URL_SERVICE}/estadisticas/evolucion-por-zona`;
  const { data } = await axios.get(url);
  return data;
};

// Comparativa multi-sitio
export const getComparativaSitios = async (sitioIds: number[]) => {
  const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/comparativa-sitios`, {
    params: { sitioIds: sitioIds.join(',') }
  });
  return data;
};

// Tendencia de caudal
export const getTendenciaCaudal = async () => {
  const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/tendencia-caudal`);
  return data;
};

// Serie temporal por tipo de precipitación
export const getSeriePorTipo = async () => {
  const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/serie-por-tipo`);
  return data;
};

// Distribución porcentual por tipo
export const getDistribucionPorTipo = async (periodo?: string) => {
  const url = periodo && periodo !== 'todos' 
    ? `${API_URL_SERVICE}/eventos/distribucion-reportes?periodo=${periodo}`
    : `${API_URL_SERVICE}/eventos/distribucion-reportes`;
  const { data } = await axios.get(url);
  return data.data || data;
};

// Evolución mensual
export const getEvolucionMensual = async (periodo?: string, anio?: number) => {
  let url = `${API_URL_SERVICE}/reportes/evolucion-mensual`;
  
  if (anio) {
    url += `?anio=${anio}`;
  } else if (periodo && periodo !== 'todos') {
    url += `?periodo=${periodo}`;
  }
  
  const { data } = await axios.get(url);
  return data.data || data;
};

// Precipitación vs coordenadas (scatter)
export const getPrecipitacionCoordenadas = async (periodo?: string, tipoEvento?: string) => {
  let url = `${API_URL_SERVICE}/sitios/precipitacion-coordenadas`;
  const params = new URLSearchParams();
  
  if (periodo && periodo !== 'todos') {
    params.append('periodo', periodo);
  }
  if (tipoEvento && tipoEvento !== 'todos') {
    params.append('tipo_evento', tipoEvento);
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  console.log('🌐 Llamando a API URL:', url);
  try {
    const response = await axios.get(url);
    console.log('✅ Respuesta completa de la API:', response);
    
    // Validar la estructura de la respuesta
    if (response.data && Array.isArray(response.data.data)) {
      console.log('✅ Datos válidos encontrados:', response.data.data);
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      console.log('✅ Array directo encontrado:', response.data);
      return response.data;
    } else {
      console.warn('⚠️ Formato de respuesta inesperado:', response.data);
      return [];
    }
  } catch (error) {
    console.error('❌ Error en llamada a API:', error);
    throw error;
  }
};

// Patrón mensual (radar)
export const getPatronMensual = async (periodo?: string, tipoEvento?: string) => {
  let url = `${API_URL_SERVICE}/reportes/patron-mensual`;
  const params = new URLSearchParams();
  
  if (periodo && periodo !== 'todos') {
    params.append('periodo', periodo);
  }
  if (tipoEvento && tipoEvento !== 'todos') {
    params.append('tipo_evento', tipoEvento);
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const { data } = await axios.get(url);
  return data.data || data;
};

// Análisis de frecuencia (histograma)
export const getAnalisisFrecuencia = async (periodo?: string, tipoEvento?: string, rango?: number) => {
  let url = `${API_URL_SERVICE}/histograma`;
  const params = new URLSearchParams();
  
  if (periodo && periodo !== 'todos') {
    params.append('periodo', periodo);
  }
  if (tipoEvento && tipoEvento !== 'todos') {
    params.append('tipo_evento', tipoEvento);
  }
  if (rango) {
    params.append('rango', rango.toString());
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const { data } = await axios.get(url);
  return data.data || data;
};

// Comparativa año a año
export const getComparativaAnual = async (anios?: string, tipoEvento?: string, mesInicio?: number, mesFin?: number) => {
  let url = `${API_URL_SERVICE}/reportes/comparativa-anual`;
  const params = new URLSearchParams();
  
  if (anios) {
    params.append('anios', anios);
  }
  if (tipoEvento && tipoEvento !== 'todos') {
    params.append('tipo_evento', tipoEvento);
  }
  if (mesInicio) {
    params.append('mes_inicio', mesInicio.toString());
  }
  if (mesFin) {
    params.append('mes_fin', mesFin.toString());
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const { data } = await axios.get(url);
  return data;
};
