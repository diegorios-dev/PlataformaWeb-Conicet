import axios from "axios";
import { API_URL } from "../config/api";
import { getCachedData, cache } from "../utils/simpleCache";

const API_URL_SERVICE = API_URL;

// TTL por defecto: 5 minutos (pueden ser estadísticas más estables)
const DEFAULT_TTL = 5 * 60 * 1000;

// Precipitación total por zona
export const getPrecipitacionPorZona = async () => {
  return getCachedData(
    'estadisticas:precipitacion-zona',
    async () => {
      const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/precipitacion-por-zona`);
      return data;
    },
    DEFAULT_TTL
  );
};

// Reportes por instrumento
export const getReportesPorInstrumento = async () => {
  return getCachedData(
    'estadisticas:reportes-instrumento',
    async () => {
      const { data } = await axios.get(`${API_URL_SERVICE}/reportes/por-instrumento`);
      return data.data || data;
    },
    DEFAULT_TTL
  );
};

// Top zonas por cantidad de registros
export const getTopZonasPorRegistro = async (limit: number = 10) => {
  return getCachedData(
    `estadisticas:top-zonas:${limit}`,
    async () => {
      const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/top-zonas-por-registro?limit=${limit}`);
      return data;
    },
    DEFAULT_TTL
  );
};

// Distribución de instrumentos por tipo
export const getDistribucionInstrumentos = async () => {
  return getCachedData(
    'estadisticas:distribucion-instrumentos',
    async () => {
      const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/distribucion-instrumentos`);
      return data;
    },
    DEFAULT_TTL
  );
};

// Reportes por mes/año
export const getReportesPorPeriodo = async () => {
  return getCachedData(
    'estadisticas:reportes-periodo',
    async () => {
      const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/reportes-por-periodo`);
      return data;
    },
    DEFAULT_TTL
  );
};

// Evolución temporal por zona
export const getEvolucionPorZona = async (zonaId?: number) => {
  const cacheKey = zonaId ? `estadisticas:evolucion-zona:${zonaId}` : 'estadisticas:evolucion-zona:all';
  
  return getCachedData(
    cacheKey,
    async () => {
      const url = zonaId 
        ? `${API_URL_SERVICE}/estadisticas/evolucion-por-zona?zonaId=${zonaId}`
        : `${API_URL_SERVICE}/estadisticas/evolucion-por-zona`;
      const { data } = await axios.get(url);
      return data;
    },
    DEFAULT_TTL
  );
};

// Comparativa multi-sitio
export const getComparativaSitios = async (sitioIds: number[]) => {
  const cacheKey = `estadisticas:comparativa-sitios:${sitioIds.sort().join(',')}`;
  
  return getCachedData(
    cacheKey,
    async () => {
      const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/comparativa-sitios`, {
        params: { sitioIds: sitioIds.join(',') }
      });
      return data;
    },
    DEFAULT_TTL
  );
};

// Tendencia de caudal
export const getTendenciaCaudal = async () => {
  return getCachedData(
    'estadisticas:tendencia-caudal',
    async () => {
      const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/tendencia-caudal`);
      return data;
    },
    DEFAULT_TTL
  );
};

// Serie temporal por tipo de precipitación
export const getSeriePorTipo = async () => {
  return getCachedData(
    'estadisticas:serie-por-tipo',
    async () => {
      const { data } = await axios.get(`${API_URL_SERVICE}/estadisticas/serie-por-tipo`);
      return data;
    },
    DEFAULT_TTL
  );
};

// Distribución porcentual por tipo
export const getDistribucionPorTipo = async (periodo?: string) => {
  const cacheKey = `estadisticas:distribucion-tipo:${periodo || 'todos'}`;
  
  return getCachedData(
    cacheKey,
    async () => {
      const url = periodo && periodo !== 'todos' 
        ? `${API_URL_SERVICE}/eventos/distribucion-reportes?periodo=${periodo}`
        : `${API_URL_SERVICE}/eventos/distribucion-reportes`;
      const { data } = await axios.get(url);
      return data.data || data;
    },
    DEFAULT_TTL
  );
};

// Evolución mensual
export const getEvolucionMensual = async (periodo?: string, anio?: number) => {
  const cacheKey = `estadisticas:evolucion-mensual:${periodo || 'todos'}:${anio || 'all'}`;
  
  return getCachedData(
    cacheKey,
    async () => {
      let url = `${API_URL_SERVICE}/reportes/evolucion-mensual`;
      
      if (anio) {
        url += `?anio=${anio}`;
      } else if (periodo && periodo !== 'todos') {
        url += `?periodo=${periodo}`;
      }
      
      const { data } = await axios.get(url);
      return data.data || data;
    },
    DEFAULT_TTL
  );
};

// Precipitación vs coordenadas (scatter)
export const getPrecipitacionCoordenadas = async (periodo?: string, tipoEvento?: string) => {
  const cacheKey = `estadisticas:precipitacion-coords:${periodo || 'todos'}:${tipoEvento || 'todos'}`;
  
  return getCachedData(
    cacheKey,
    async () => {
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
    },
    DEFAULT_TTL
  );
};

// Patrón mensual (radar)
export const getPatronMensual = async (periodo?: string, tipoEvento?: string) => {
  const cacheKey = `estadisticas:patron-mensual:${periodo || 'todos'}:${tipoEvento || 'todos'}`;
  
  return getCachedData(
    cacheKey,
    async () => {
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
    },
    DEFAULT_TTL
  );
};

// Análisis de frecuencia (histograma)
export const getAnalisisFrecuencia = async (periodo?: string, tipoEvento?: string, rango?: number) => {
  const cacheKey = `estadisticas:analisis-frecuencia:${periodo || 'todos'}:${tipoEvento || 'todos'}:${rango || 10}`;
  
  return getCachedData(
    cacheKey,
    async () => {
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
    },
    DEFAULT_TTL
  );
};

// Comparativa año a año
export const getComparativaAnual = async (anios?: string, tipoEvento?: string, mesInicio?: number, mesFin?: number) => {
  const cacheKey = `estadisticas:comparativa-anual:${anios || 'all'}:${tipoEvento || 'todos'}:${mesInicio || 0}:${mesFin || 12}`;
  
  return getCachedData(
    cacheKey,
    async () => {
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
    },
    DEFAULT_TTL
  );
};

/**
 * Invalidar todo el cache de estadísticas y zonas
 * Usar cuando se cree, edite o elimine un reporte, zona o sitio
 */
export const invalidateEstadisticasCache = () => {
  cache.invalidatePattern('estadisticas:');
  cache.invalidatePattern('zonas:');
  console.log('🗑️ Cache de estadísticas y zonas invalidado');
};
