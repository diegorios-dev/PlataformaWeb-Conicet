import { httpGet } from "@shared/services";
import { getCachedData, cache } from "@shared/utils/simpleCache";
import { devLog, getErrorMessage } from "@shared/utils/errorHandler";

// TTL por defecto: 5 minutos (pueden ser estadísticas más estables)
const DEFAULT_TTL = 5 * 60 * 1000;

// Precipitación total por zona
export const getPrecipitacionPorZona = async () => {
  return getCachedData(
    'estadisticas:precipitacion-zona',
    async () => {
      try {
        const data = await httpGet(`/estadisticas/precipitacion-por-zona`);
        
        if (!data || !Array.isArray(data)) {
          devLog.warn('Datos de precipitación por zona inválidos', data);
          return [];
        }
        
        return data;
      } catch (error) {
        devLog.error('Error obteniendo precipitación por zona', error);
        throw new Error(getErrorMessage(error));
      }
    },
    DEFAULT_TTL
  );
};

// Reportes por instrumento
export const getReportesPorInstrumento = async () => {
  return getCachedData(
    'estadisticas:reportes-instrumento',
    async () => {
      try {
        const data = await httpGet(`/v1/reports/stats/by-instrument`);
        const result = data.data || data;
        
        if (!Array.isArray(result)) {
          devLog.warn('Datos de reportes por instrumento inválidos', result);
          return [];
        }
        
        return result;
      } catch (error) {
        devLog.error('Error obteniendo reportes por instrumento', error);
        throw new Error(getErrorMessage(error));
      }
    },
    DEFAULT_TTL
  );
};

// Top zonas por cantidad de registros
export const getTopZonasPorRegistro = async (limit: number = 10) => {
  return getCachedData(
    `estadisticas:top-zonas:${limit}`,
    async () => {
      const data = await httpGet(`/estadisticas/top-zonas-por-registro?limit=${limit}`);
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
      const data = await httpGet(`/estadisticas/distribucion-instrumentos`);
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
      const data = await httpGet(`/estadisticas/reportes-por-periodo`);
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
        ? `/estadisticas/evolucion-por-zona?zonaId=${zonaId}`
        : `/estadisticas/evolucion-por-zona`;
      const data = await httpGet(url);
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
      const data = await httpGet(`/estadisticas/comparativa-sitios`, {
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
      const data = await httpGet(`/estadisticas/tendencia-caudal`);
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
      const data = await httpGet(`/estadisticas/serie-por-tipo`);
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
        ? `/v1/events/stats/distribution?periodo=${periodo}`
        : `/v1/events/stats/distribution`;
      const data = await httpGet(url);
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
      let url = `/v1/reports/stats/monthly-evolution`;
      
      if (anio) {
        url += `?anio=${anio}`;
      } else if (periodo && periodo !== 'todos') {
        url += `?periodo=${periodo}`;
      }
      
      const data = await httpGet(url);
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
      let url = `/v1/sites/stats/precipitation-coordinates`;
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

      try {
        const response = await httpGet(url);
        
        // Validar la estructura de la respuesta
        if (response && Array.isArray(response.data)) {
          return response.data;
        } else if (Array.isArray(response)) {
          return response;
        } else {
          devLog.warn('Datos de precipitación por coordenadas inválidos', response);
          return [];
        }
      } catch (error) {
        devLog.error('Error obteniendo precipitación por coordenadas', error);
        throw new Error(getErrorMessage(error));
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
      let url = `/v1/reports/stats/monthly-pattern`;
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

      const data = await httpGet(url);
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
      let url = `/v1/reports/stats/histogram`;
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

      const data = await httpGet(url);
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
      let url = `/v1/reports/stats/annual-comparison`;
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

      const data = await httpGet(url);
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
};
