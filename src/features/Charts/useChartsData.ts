import { useState, useEffect, useCallback } from 'react';
import { getTotalAcumuladoPorZona, getTopZonasPorRegistro } from '@features/zona/services';
import {
  getReportesPorInstrumento,
  getDistribucionPorTipo,
  getEvolucionMensual,
  getPrecipitacionCoordenadas,
  getPatronMensual,
  getAnalisisFrecuencia,
  getComparativaAnual,
  invalidateEstadisticasCache,
} from '@features/Charts/services';


// 80/20: concentrar toda la lógica de carga y estados aquí para aligerar showCharts.tsx

const ensureArray = (data: any) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') return [data];
  return [];
};

export function useChartsData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos
  const [precipitacionPorZona, setPrecipitacionPorZona] = useState<any[]>([]);
  const [reportesPorInstrumento, setReportesPorInstrumento] = useState<any[]>([]);
  const [topSitios, setTopSitios] = useState<any[]>([]);
  const [distribucionTipo, setDistribucionTipo] = useState<any[]>([]);
  const [evolucionMensual, setEvolucionMensual] = useState<any[]>([]);
  const [precipitacionCoordenadas, setPrecipitacionCoordenadas] = useState<any[]>([]);
  const [patronMensual, setPatronMensual] = useState<any[]>([]);
  const [analisisFrecuencia, setAnalisisFrecuencia] = useState<any[]>([]);
  const [comparativaAnual, setComparativaAnual] = useState<any[]>([]);
  const [estadisticasFrecuencia, setEstadisticasFrecuencia] = useState<any>(null);
  const [totalesComparativa, setTotalesComparativa] = useState<any>(null);
  const [configuracionComparativa, setConfiguracionComparativa] = useState<any>(null);

  // Periodos y filtros
  const [periodoPrecipitacion, setPeriodoPrecipitacion] = useState('todos');
  const [periodoTopZonas, setPeriodoTopZonas] = useState('anio');
  const [periodoDistribucion, setPeriodoDistribucion] = useState('todos');
  const [periodoEvolucion, setPeriodoEvolucion] = useState('anio');
  const [periodoCoordenadas, setPeriodoCoordenadas] = useState('todos');
  const [tipoEventoCoordenadas, setTipoEventoCoordenadas] = useState<string | undefined>();
  const [periodoPatronMensual, setPeriodoPatronMensual] = useState('anio');
  const [tipoEventoPatronMensual, setTipoEventoPatronMensual] = useState<string | undefined>();
  const [periodoAnalisisFrecuencia, setPeriodoAnalisisFrecuencia] = useState('anio');
  const [rangoAnalisisFrecuencia, setRangoAnalisisFrecuencia] = useState(10);
  const [selectedYearsComparativa, setSelectedYearsComparativa] = useState<number[]>([]);

  // Loading específicos
  const [loadingCoordenadas, setLoadingCoordenadas] = useState(false);
  const [loadingPatronMensual, setLoadingPatronMensual] = useState(false);
  const [loadingAnalisisFrecuencia, setLoadingAnalisisFrecuencia] = useState(false);
  const [loadingComparativa, setLoadingComparativa] = useState(false);

  const fetchPrecipitacion = useCallback(async () => {
    try {
      const zonasData = await getTotalAcumuladoPorZona(periodoPrecipitacion);
      const zonasArray = ensureArray(zonasData);
      const zonasFormateadas = zonasArray.map((zona: any) => ({
        zona: zona.locality || zona.nombre || 'Sin nombre',
        precipitacion: parseFloat((parseFloat(zona.total_acumulado) || 0).toFixed(2)),
      }));
      setPrecipitacionPorZona(zonasFormateadas);
    } catch {
      setPrecipitacionPorZona([]);
    }
  }, [periodoPrecipitacion]);

  const fetchTopZonas = useCallback(async () => {
    try {
      const topZonasData = await getTopZonasPorRegistro(periodoTopZonas, 8);
      setTopSitios(ensureArray(topZonasData));
    } catch {
      setTopSitios([]);
    }
  }, [periodoTopZonas]);

  const fetchDistribucion = useCallback(async () => {
    try {
      const distribucionData = await getDistribucionPorTipo(periodoDistribucion);
      setDistribucionTipo(ensureArray(distribucionData));
    } catch {
      setDistribucionTipo([]);
    }
  }, [periodoDistribucion]);

  const fetchEvolucion = useCallback(async () => {
    try {
      const evolucionData = await getEvolucionMensual(periodoEvolucion);
      setEvolucionMensual(ensureArray(evolucionData));
    } catch {
      setEvolucionMensual([]);
    }
  }, [periodoEvolucion]);

  const fetchCoordenadas = useCallback(async () => {
    try {
      setLoadingCoordenadas(true);
      const data = await getPrecipitacionCoordenadas(periodoCoordenadas, tipoEventoCoordenadas);
      setPrecipitacionCoordenadas(Array.isArray(data) ? data : []);
    } catch {
      setPrecipitacionCoordenadas([]);
    } finally {
      setLoadingCoordenadas(false);
    }
  }, [periodoCoordenadas, tipoEventoCoordenadas]);

  const fetchPatronMensual = useCallback(async () => {
    try {
      setLoadingPatronMensual(true);
      const data = await getPatronMensual(periodoPatronMensual, tipoEventoPatronMensual);
      setPatronMensual(Array.isArray(data) ? data : []);
    } catch {
      setPatronMensual([]);
    } finally {
      setLoadingPatronMensual(false);
    }
  }, [periodoPatronMensual, tipoEventoPatronMensual]);

  const fetchAnalisisFrecuencia = useCallback(async () => {
    try {
      setLoadingAnalisisFrecuencia(true);
      const [lluvia, nieve, caudal] = await Promise.all([
        getAnalisisFrecuencia(periodoAnalisisFrecuencia, 'Lluvia', rangoAnalisisFrecuencia),
        getAnalisisFrecuencia(periodoAnalisisFrecuencia, 'Nieve', rangoAnalisisFrecuencia),
        getAnalisisFrecuencia(periodoAnalisisFrecuencia, 'Caudal', rangoAnalisisFrecuencia),
      ]);

      const toArr = (r: any) => Array.isArray(r) ? r : (r?.data || []);
      const dataL = toArr(lluvia);
      const dataN = toArr(nieve);
      const dataC = toArr(caudal);
      const rangoMap = new Map();

      const process = (items: any[], key: 'lluvia'|'nieve'|'caudal') => {
        items.forEach(it => {
          const ex = rangoMap.get(it.rango) || {
            rango: it.rango,
            rango_inicio: it.rango_inferior || it.rango_inicio || 0,
            rango_fin: it.rango_firt || it.rango_fin || 0,
            frecuencia_lluvia: 0,
            frecuencia_nieve: 0,
            frecuencia_caudal: 0,
            porcentaje: it.porcentaje || 0,
          };
          ex[`frecuencia_${key}`] = it.frecuencia || 0;
          rangoMap.set(it.rango, ex);
        });
      };

      process(dataL, 'lluvia');
      process(dataN, 'nieve');
      process(dataC, 'caudal');

      setAnalisisFrecuencia(Array.from(rangoMap.values()).sort((a,b)=>a.rango_inicio-b.rango_inicio));
      setEstadisticasFrecuencia(lluvia?.estadisticas || null);
    } catch {
      setAnalisisFrecuencia([]);
      setEstadisticasFrecuencia(null);
    } finally {
      setLoadingAnalisisFrecuencia(false);
    }
  }, [periodoAnalisisFrecuencia, rangoAnalisisFrecuencia]);

  const fetchComparativaAnual = useCallback( async () => {
    try {
      setLoadingComparativa(true);
      const aniosParam = selectedYearsComparativa.length ? selectedYearsComparativa.sort((a,b)=>a-b).join(',') : undefined;
      const response = await getComparativaAnual(aniosParam);
      if (response && response.data) {
        setComparativaAnual(response.data);
        setTotalesComparativa(response.totales_por_anio || null);
        setConfiguracionComparativa(response.configuracion || null);
        if (!selectedYearsComparativa.length && response.configuracion?.anios_comparados) {
          setSelectedYearsComparativa(response.configuracion.anios_comparados);
        }
      } else {
        setComparativaAnual(ensureArray(response));
        setTotalesComparativa(null);
        setConfiguracionComparativa(null);
      }
    } catch {
      setComparativaAnual([]);
      setTotalesComparativa(null);
      setConfiguracionComparativa(null);
    } finally {
      setLoadingComparativa(false);
    }
  }, [selectedYearsComparativa]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const zonasData = await getTotalAcumuladoPorZona().catch(()=>[]);
      const reportesData = await getReportesPorInstrumento().catch(()=>[]);
      const distribucionData = await getDistribucionPorTipo().catch(()=>[]);
      const evolucionData = await getEvolucionMensual(periodoEvolucion).catch(()=>[]);
      setPrecipitacionPorZona(ensureArray(zonasData).map((z:any)=>({
        zona: z.locality || z.nombre || 'Sin nombre',
        precipitacion: parseFloat((parseFloat(z.total_acumulado) || 0).toFixed(2)),
      })));
      setReportesPorInstrumento(ensureArray(reportesData));
      setDistribucionTipo(ensureArray(distribucionData));
      setEvolucionMensual(ensureArray(evolucionData));
    } catch (err:any) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [periodoEvolucion]);

  // Efectos de carga
  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchPrecipitacion(); }, [fetchPrecipitacion]);
  useEffect(() => { fetchTopZonas(); }, [fetchTopZonas]);
  useEffect(() => { fetchDistribucion(); }, [fetchDistribucion]);
  useEffect(() => { fetchEvolucion(); }, [fetchEvolucion]);
  useEffect(() => { fetchCoordenadas(); }, [fetchCoordenadas]);
  useEffect(() => { fetchPatronMensual(); }, [fetchPatronMensual]);
  useEffect(() => { fetchAnalisisFrecuencia(); }, [fetchAnalisisFrecuencia]);
  useEffect(() => { fetchComparativaAnual(); }, [fetchComparativaAnual]);

  // Función para refrescar todo limpiando cache
  const refreshAll = useCallback(() => {
    invalidateEstadisticasCache();
    fetchData();
    fetchPrecipitacion();
    fetchTopZonas();
    fetchDistribucion();
    fetchEvolucion();
    fetchCoordenadas();
    fetchPatronMensual();
    fetchAnalisisFrecuencia();
    fetchComparativaAnual();
  }, [fetchData, fetchPrecipitacion, fetchTopZonas, fetchDistribucion, fetchEvolucion, 
      fetchCoordenadas, fetchPatronMensual, fetchAnalisisFrecuencia, fetchComparativaAnual]);

  return {
    // estados
    loading, error,
    precipitacionPorZona, reportesPorInstrumento, topSitios, distribucionTipo, evolucionMensual,
    precipitacionCoordenadas, patronMensual, analisisFrecuencia, comparativaAnual,
    estadisticasFrecuencia, totalesComparativa, configuracionComparativa,
    // periodos + setters
    periodoPrecipitacion, setPeriodoPrecipitacion,
    periodoTopZonas, setPeriodoTopZonas,
    periodoDistribucion, setPeriodoDistribucion,
    periodoEvolucion, setPeriodoEvolucion,
    periodoCoordenadas, setPeriodoCoordenadas,
    tipoEventoCoordenadas, setTipoEventoCoordenadas,
    periodoPatronMensual, setPeriodoPatronMensual,
    tipoEventoPatronMensual, setTipoEventoPatronMensual,
    periodoAnalisisFrecuencia, setPeriodoAnalisisFrecuencia,
    rangoAnalisisFrecuencia, setRangoAnalisisFrecuencia,
    selectedYearsComparativa, setSelectedYearsComparativa,
    // loading específicos
    loadingCoordenadas, loadingPatronMensual, loadingAnalisisFrecuencia, loadingComparativa,
    // acciones
    refreshAll,
  };
}

export default useChartsData;