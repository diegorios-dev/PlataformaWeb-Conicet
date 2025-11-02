import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  MapPin,
  Calendar,
  Waves,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import BackButton from "../../BackButton";
import ChartCard from "./ChartCard";
import PrecipitacionPorZona from "./PrecipitacionPorZona";
import ReportesPorInstrumento from "./ReportesPorInstrumento";
import TopZonasPorRegistro from "./TopZonasPorRegistro";
import DistribucionPorTipo from "./DistribucionPorTipo";
import EvolucionMensual from "./EvolucionMensual";
import PrecipitacionCoordenadas from "./PrecipitacionCoordenadas";
import PatronMensual from "./PatronMensual";
import AnalisisFrecuencia from "./AnalisisFrecuencia";
import ComparativaAnual from "./ComparativaAnual";
import YearPicker from "./YearPicker";
// Importar servicios de la API
import { getTotalAcumuladoPorZona, getTopZonasPorRegistro } from "../../../services/zonaService";
import {
  getReportesPorInstrumento,
  getDistribucionPorTipo,
  getEvolucionMensual,
  getPrecipitacionCoordenadas,
  getPatronMensual,
  getAnalisisFrecuencia,
  getComparativaAnual,
} from "../../../services/estadisticasService";

const ShowCharts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para datos de la API
  const [precipitacionPorZona, setPrecipitacionPorZona] = useState<any[]>([]);
  const [reportesPorInstrumento, setReportesPorInstrumento] = useState<any[]>([]);
  const [topSitios, setTopSitios] = useState<any[]>([]);
  const [distribucionTipo, setDistribucionTipo] = useState<any[]>([]);
  const [evolucionMensual, setEvolucionMensual] = useState<any[]>([]);
  const [precipitacionCoordenadas, setPrecipitacionCoordenadas] = useState<any[]>([]);
  const [patronMensual, setPatronMensual] = useState<any[]>([]);
  const [analisisFrecuencia, setAnalisisFrecuencia] = useState<any[]>([]);
  const [comparativaAnual, setComparativaAnual] = useState<any[]>([]);

  // Estados para períodos de cada gráfico
  const [periodoPrecipitacion, setPeriodoPrecipitacion] = useState("todos");
  const [periodoTopZonas, setPeriodoTopZonas] = useState("anio");
  const [periodoDistribucion, setPeriodoDistribucion] = useState("todos");
  const [periodoEvolucion, setPeriodoEvolucion] = useState("anio");
  const [periodoCoordenadas, setPeriodoCoordenadas] = useState("todos");
  const [tipoEventoCoordenadas, setTipoEventoCoordenadas] = useState<string | undefined>();
  const [periodoPatronMensual, setPeriodoPatronMensual] = useState("anio");
  const [tipoEventoPatronMensual, setTipoEventoPatronMensual] = useState<string | undefined>();
  const [periodoAnalisisFrecuencia, setPeriodoAnalisisFrecuencia] = useState("anio");
  const [rangoAnalisisFrecuencia, setRangoAnalisisFrecuencia] = useState(10);
  const [selectedYearsComparativa, setSelectedYearsComparativa] = useState<number[]>([]);
  // const [tipoEventoComparativa, setTipoEventoComparativa] = useState<string | undefined>();
  // Loading específico para el gráfico de coordenadas (evita usar el loading global que desmonta children)
  const [loadingCoordenadas, setLoadingCoordenadas] = useState(false);
  const [loadingPatronMensual, setLoadingPatronMensual] = useState(false);
  const [loadingAnalisisFrecuencia, setLoadingAnalisisFrecuencia] = useState(false);
  const [loadingComparativa, setLoadingComparativa] = useState(false);
  // Estados para estadísticas adicionales
  const [estadisticasFrecuencia, setEstadisticasFrecuencia] = useState<any>(null);
  const [totalesComparativa, setTotalesComparativa] = useState<any>(null);
  const [configuracionComparativa, setConfiguracionComparativa] = useState<any>(null);

  // Cargar datos del backend
  useEffect(() => {
    fetchData();
  }, []);

  // Recargar cuando cambien los períodos
  useEffect(() => {
    fetchPrecipitacion();
  }, [periodoPrecipitacion]);

  useEffect(() => {
    fetchTopZonas();
  }, [periodoTopZonas]);

  useEffect(() => {
    fetchDistribucion();
  }, [periodoDistribucion]);

  useEffect(() => {
    fetchEvolucion();
  }, [periodoEvolucion]);

  useEffect(() => {
    fetchCoordenadas();
  }, [periodoCoordenadas, tipoEventoCoordenadas]);

  useEffect(() => {
    fetchPatronMensual();
  }, [periodoPatronMensual, tipoEventoPatronMensual]);

  useEffect(() => {
    fetchAnalisisFrecuencia();
  }, [periodoAnalisisFrecuencia, rangoAnalisisFrecuencia]);

  useEffect(() => {
    fetchComparativaAnual();
  }, [selectedYearsComparativa]);

  const fetchCoordenadas = async () => {
    try {
      // usar loading específico para evitar que ChartCard muestre el spinner global y desmonte el gráfico
      setLoadingCoordenadas(true);
      const data = await getPrecipitacionCoordenadas(periodoCoordenadas, tipoEventoCoordenadas);
      
      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ Los datos recibidos no son un array:', data);
        setPrecipitacionCoordenadas([]);
        return;
      }
      
      setPrecipitacionCoordenadas(data);
    } catch (err) {
      console.error('❌ Error al cargar datos de coordenadas:', err);
      // NO modificar el estado error global - solo loguear el error
      setPrecipitacionCoordenadas([]);
    } finally {
      setLoadingCoordenadas(false);
    }
  };

  const fetchPatronMensual = async () => {
    try {
      setLoadingPatronMensual(true);
      const data = await getPatronMensual(periodoPatronMensual, tipoEventoPatronMensual);
      
      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ Los datos recibidos no son un array:', data);
        setPatronMensual([]);
        return;
      }
      
      setPatronMensual(data);
    } catch (err) {
      console.error('❌ Error al cargar patrón mensual:', err);
      setPatronMensual([]);
    } finally {
      setLoadingPatronMensual(false);
    }
  };

  const fetchAnalisisFrecuencia = async () => {
    try {
      setLoadingAnalisisFrecuencia(true);
      
      // 🌊 Hacer 3 llamadas simultáneas: una por cada tipo de evento
      const [responseLluvia, responseNieve, responseCaudal] = await Promise.all([
        getAnalisisFrecuencia(periodoAnalisisFrecuencia, 'Lluvia', rangoAnalisisFrecuencia),
        getAnalisisFrecuencia(periodoAnalisisFrecuencia, 'Nieve', rangoAnalisisFrecuencia),
        getAnalisisFrecuencia(periodoAnalisisFrecuencia, 'Caudal', rangoAnalisisFrecuencia),
      ]);
      
      // Extraer los arrays de datos de cada respuesta
      const dataLluvia = Array.isArray(responseLluvia) ? responseLluvia : (responseLluvia?.data || []);
      const dataNieve = Array.isArray(responseNieve) ? responseNieve : (responseNieve?.data || []);
      const dataCaudal = Array.isArray(responseCaudal) ? responseCaudal : (responseCaudal?.data || []);
      
      // Combinar los 3 datasets en uno solo
      // Crear un mapa de rangos para combinar frecuencias
      const rangoMap = new Map();
      
      // Procesar datos de Lluvia
      dataLluvia.forEach((item: any) => {
        rangoMap.set(item.rango, {
          rango: item.rango,
          rango_inicio: item.rango_inferior || item.rango_inicio || 0,
          rango_fin: item.rango_firt || item.rango_fin || 0,
          frecuencia_lluvia: item.frecuencia || 0,
          frecuencia_nieve: 0,
          frecuencia_caudal: 0,
          porcentaje: item.porcentaje || 0,
        });
      });
      
      // Agregar datos de Nieve
      dataNieve.forEach((item: any) => {
        const existing = rangoMap.get(item.rango);
        if (existing) {
          existing.frecuencia_nieve = item.frecuencia || 0;
        } else {
          rangoMap.set(item.rango, {
            rango: item.rango,
            rango_inicio: item.rango_inferior || item.rango_inicio || 0,
            rango_fin: item.rango_firt || item.rango_fin || 0,
            frecuencia_lluvia: 0,
            frecuencia_nieve: item.frecuencia || 0,
            frecuencia_caudal: 0,
            porcentaje: item.porcentaje || 0,
          });
        }
      });
      
      // Agregar datos de Caudal
      dataCaudal.forEach((item: any) => {
        const existing = rangoMap.get(item.rango);
        if (existing) {
          existing.frecuencia_caudal = item.frecuencia || 0;
        } else {
          rangoMap.set(item.rango, {
            rango: item.rango,
            rango_inicio: item.rango_inferior || item.rango_inicio || 0,
            rango_fin: item.rango_firt || item.rango_fin || 0,
            frecuencia_lluvia: 0,
            frecuencia_nieve: 0,
            frecuencia_caudal: item.frecuencia || 0,
            porcentaje: item.porcentaje || 0,
          });
        }
      });
      
      // Convertir el mapa a array y ordenar por rango_inicio
      const combinedData = Array.from(rangoMap.values()).sort((a, b) => a.rango_inicio - b.rango_inicio);
      
      // 🌊 DEBUG: Ver datos finales combinados
      console.log('🌊 Gráfico de Olas - Datos combinados:', combinedData.length, 'rangos');
      if (combinedData.length > 0) {
        console.log('🌊 Ejemplo:', combinedData[0]);
      }
      
      setAnalisisFrecuencia(combinedData);
      
      // Usar estadísticas de la primera respuesta (Lluvia) como referencia
      const estadisticas = responseLluvia?.estadisticas || null;
      setEstadisticasFrecuencia(estadisticas);
      
    } catch (err) {
      console.error('❌ Error al cargar análisis de frecuencia:', err);
      setAnalisisFrecuencia([]);
      setEstadisticasFrecuencia(null);
    } finally {
      setLoadingAnalisisFrecuencia(false);
    }
  };

  const fetchComparativaAnual = async () => {
    try {
      setLoadingComparativa(true);
      
      // Si hay años seleccionados, usarlos; sino, usar los últimos 3 años por defecto
      const aniosParam = selectedYearsComparativa.length > 0 
        ? selectedYearsComparativa.sort((a, b) => a - b).join(',')
        : undefined;
      
      const response = await getComparativaAnual(aniosParam);
      
      if (response && response.data) {
        setComparativaAnual(response.data);
        setTotalesComparativa(response.totales_por_anio || null);
        setConfiguracionComparativa(response.configuracion || null);
        
        // Si no había años seleccionados, usar los que devolvió el backend
        if (selectedYearsComparativa.length === 0 && response.configuracion?.anios_comparados) {
          setSelectedYearsComparativa(response.configuracion.anios_comparados);
        }
      } else {
        setComparativaAnual([]);
        setTotalesComparativa(null);
        setConfiguracionComparativa(null);
      }
    } catch (err) {
      console.error('❌ Error al cargar comparativa anual:', err);
      setComparativaAnual([]);
      setTotalesComparativa(null);
      setConfiguracionComparativa(null);
    } finally {
      setLoadingComparativa(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Cargar solo el endpoint principal primero
      const zonasData = await getTotalAcumuladoPorZona().catch((err) => { 
        console.error('❌ Error en zonas/total-acumulado:', err.response?.status, err.message); 
        return []; 
      });


      // Helper para asegurar que sea un array
      const ensureArray = (data: any) => {
        if (Array.isArray(data)) return data;
        if (data && typeof data === 'object') return [data];
        return [];
      };

      // Transformar datos de zonas para el gráfico
      const zonasArray = ensureArray(zonasData);
      const zonasFormateadas = zonasArray.map((zona: any) => ({
        zona: zona.locality || zona.nombre || "Sin nombre",
        precipitacion: parseFloat((parseFloat(zona.total_acumulado) || 0).toFixed(2)),
      }));

      // Para top zonas, intentar el endpoint nuevo, si falla usar los datos de zonas principales
      let topFormateadas = [];
      try {
        const topZonasData = await getTopZonasPorRegistro("anio", 8);
        const topZonasArray = ensureArray(topZonasData);
        // Mantener la estructura original del backend
        topFormateadas = topZonasArray;
      } catch (err: any) {
        console.warn('⚠️ Endpoint /zonas/top-registros no disponible');
        topFormateadas = [];
      }

      // Cargar el resto de endpoints en paralelo (opcionales)
      const [
        reportesData,
        distribucionData,
        evolucionData,
        coordenadasData,
        patronData,
        frecuenciaLluviaData,
        frecuenciaNieveData,
        frecuenciaCaudalData,
        anualData,
      ] = await Promise.all([
        getReportesPorInstrumento().catch(() => []),
        getDistribucionPorTipo().catch(() => []),
        getEvolucionMensual(periodoEvolucion).catch(() => []),
        getPrecipitacionCoordenadas().catch(() => []),
        getPatronMensual(periodoPatronMensual, tipoEventoPatronMensual).catch(() => []),
        getAnalisisFrecuencia(periodoAnalisisFrecuencia, 'Lluvia', rangoAnalisisFrecuencia).catch(() => []),
        getAnalisisFrecuencia(periodoAnalisisFrecuencia, 'Nieve', rangoAnalisisFrecuencia).catch(() => []),
        getAnalisisFrecuencia(periodoAnalisisFrecuencia, 'Caudal', rangoAnalisisFrecuencia).catch(() => []),
        getComparativaAnual().catch(() => []),
      ]);

      // Actualizar estados con validación
      setPrecipitacionPorZona(zonasFormateadas);
      setReportesPorInstrumento(ensureArray(reportesData));
      setTopSitios(topFormateadas);
      setDistribucionTipo(ensureArray(distribucionData));
      setEvolucionMensual(ensureArray(evolucionData));
      setPrecipitacionCoordenadas(ensureArray(coordenadasData));
      setPatronMensual(ensureArray(patronData));
      
      // Combinar datos de frecuencia de los 3 tipos
      const dataLluvia = Array.isArray(frecuenciaLluviaData) ? frecuenciaLluviaData : (frecuenciaLluviaData?.data || []);
      const dataNieve = Array.isArray(frecuenciaNieveData) ? frecuenciaNieveData : (frecuenciaNieveData?.data || []);
      const dataCaudal = Array.isArray(frecuenciaCaudalData) ? frecuenciaCaudalData : (frecuenciaCaudalData?.data || []);
      
      const rangoMap = new Map();
      
      // Procesar Lluvia
      dataLluvia.forEach((item: any) => {
        rangoMap.set(item.rango, {
          rango: item.rango,
          rango_inicio: item.rango_inferior || item.rango_inicio || 0,
          rango_fin: item.rango_firt || item.rango_fin || 0,
          frecuencia_lluvia: item.frecuencia || 0,
          frecuencia_nieve: 0,
          frecuencia_caudal: 0,
          porcentaje: item.porcentaje || 0,
        });
      });
      
      // Procesar Nieve
      dataNieve.forEach((item: any) => {
        const existing = rangoMap.get(item.rango);
        if (existing) {
          existing.frecuencia_nieve = item.frecuencia || 0;
        } else {
          rangoMap.set(item.rango, {
            rango: item.rango,
            rango_inicio: item.rango_inferior || item.rango_inicio || 0,
            rango_fin: item.rango_firt || item.rango_fin || 0,
            frecuencia_lluvia: 0,
            frecuencia_nieve: item.frecuencia || 0,
            frecuencia_caudal: 0,
            porcentaje: item.porcentaje || 0,
          });
        }
      });
      
      // Procesar Caudal
      dataCaudal.forEach((item: any) => {
        const existing = rangoMap.get(item.rango);
        if (existing) {
          existing.frecuencia_caudal = item.frecuencia || 0;
        } else {
          rangoMap.set(item.rango, {
            rango: item.rango,
            rango_inicio: item.rango_inferior || item.rango_inicio || 0,
            rango_fin: item.rango_firt || item.rango_fin || 0,
            frecuencia_lluvia: 0,
            frecuencia_nieve: 0,
            frecuencia_caudal: item.frecuencia || 0,
            porcentaje: item.porcentaje || 0,
          });
        }
      });
      
      const combinedFrecuencia = Array.from(rangoMap.values()).sort((a, b) => a.rango_inicio - b.rango_inicio);
      setAnalisisFrecuencia(combinedFrecuencia);
      
      // Usar estadísticas de la primera respuesta
      const estadisticas = frecuenciaLluviaData?.estadisticas || null;
      setEstadisticasFrecuencia(estadisticas);
      
      // Procesar comparativa anual
      if (anualData && anualData.data) {
        setComparativaAnual(anualData.data);
        setTotalesComparativa(anualData.totales_por_anio || null);
        setConfiguracionComparativa(anualData.configuracion || null);
      } else {
        setComparativaAnual(ensureArray(anualData));
        setTotalesComparativa(null);
        setConfiguracionComparativa(null);
      }

    } catch (err: any) {
      console.error("❌ Error crítico al cargar datos:", err);
      setError(err.message || "Error al cargar datos del servidor");
    } finally {
      setLoading(false);
    }
  };

  // Funciones individuales para recargar gráficos específicos
  const ensureArray = (data: any) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') return [data];
    return [];
  };

  const fetchPrecipitacion = async () => {
    try {
      const zonasData = await getTotalAcumuladoPorZona(periodoPrecipitacion);
      const zonasArray = ensureArray(zonasData);
      const zonasFormateadas = zonasArray.map((zona: any) => ({
        zona: zona.locality || zona.nombre || "Sin nombre",
        precipitacion: parseFloat((parseFloat(zona.total_acumulado) || 0).toFixed(2)),
      }));
      setPrecipitacionPorZona(zonasFormateadas);
    } catch (err) {
      console.warn('⚠️ Error al recargar precipitación por zona');
      setPrecipitacionPorZona([]);
    }
  };

  const fetchTopZonas = async () => {
    try {
      const topZonasData = await getTopZonasPorRegistro(periodoTopZonas, 8);
      const topZonasArray = ensureArray(topZonasData);
      setTopSitios(topZonasArray);
    } catch (err) {
      console.warn('⚠️ Error al recargar top zonas');
      setTopSitios([]);
    }
  };

  const fetchDistribucion = async () => {
    try {
      const distribucionData = await getDistribucionPorTipo(periodoDistribucion);
      setDistribucionTipo(ensureArray(distribucionData));
    } catch (err) {
      console.warn('⚠️ Error al recargar distribución');
      setDistribucionTipo([]);
    }
  };

  const fetchEvolucion = async () => {
    try {
      const evolucionData = await getEvolucionMensual(periodoEvolucion);
      setEvolucionMensual(ensureArray(evolucionData));
    } catch (err) {
      console.warn('⚠️ Error al recargar evolución');
      setEvolucionMensual([]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <BackButton />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 mt-16">
        <div className="backdrop-blur-2xl bg-white/50 border border-white/60 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/40">
                <BarChart3 className="w-10 h-10 text-blue-700" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Estadísticas y Análisis
                </h1>
                <p className="text-slate-600 mt-1">
                  Visualización completa de datos de precipitación en tiempo real
                </p>
              </div>
            </div>
            
            {/* Botón de refresh */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de error global */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Error al cargar datos</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <p className="text-red-500 text-xs mt-2">
                Verifica que el backend esté corriendo en http://localhost:8000
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid de gráficos */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Fila 1: Gráficos de barras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Precipitación Total por Zona"
            subtitle="Acumulado por región"
            description="Muestra el total acumulado de precipitación (en mm) para cada localidad de la línea sur. Permite identificar rápidamente las zonas con mayor y menor precipitación."
            icon={<MapPin className="w-6 h-6 text-blue-700" />}
            isLoading={loading}
            showPeriodSelector={true}
            selectedPeriod={periodoPrecipitacion}
            onPeriodChange={setPeriodoPrecipitacion}
          >
            <PrecipitacionPorZona data={precipitacionPorZona} />
          </ChartCard>

          <ChartCard
            title="Reportes por Instrumento"
            subtitle="Cantidad de mediciones registradas"
            description="Cantidad de mediciones realizadas por cada tipo de instrumento meteorológico. Útil para identificar qué instrumentos tienen más actividad o necesitan mantenimiento."
            icon={<Activity className="w-6 h-6 text-violet-700" />}
            isLoading={loading}
          >
            <ReportesPorInstrumento data={reportesPorInstrumento} />
          </ChartCard>
        </div>

        {/* Fila 2: Top sitios y distribución tipo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Top Zonas por Registro"
            subtitle="Localidades con más mediciones"
            description="Ranking de las zonas con mayor cantidad de registros meteorológicos. Muestra qué localidades tienen instrumentos más activos o datos más frecuentes."
            icon={<TrendingUp className="w-6 h-6 text-emerald-700" />}
            isLoading={loading}
            showPeriodSelector={true}
            selectedPeriod={periodoTopZonas}
            onPeriodChange={setPeriodoTopZonas}
          >
            <TopZonasPorRegistro data={topSitios} />
          </ChartCard>

          <ChartCard
            title="Distribución por Tipo de Precipitación"
            subtitle="Porcentaje de cada tipo"
            description="Proporción entre diferentes tipos de precipitación: lluvia, nieve y caudal. Ayuda a entender el balance hídrico de la región."
            icon={<PieChartIcon className="w-6 h-6 text-amber-700" />}
            isLoading={loading}
            showPeriodSelector={true}
            selectedPeriod={periodoDistribucion}
            onPeriodChange={setPeriodoDistribucion}
          >
            <DistribucionPorTipo data={distribucionTipo} />
          </ChartCard>
        </div>

        {/* Fila 3: Evolución mensual (Composed Chart) */}
        <ChartCard
          title="Evolución Mensual por Tipo"
          subtitle="Comparativa de lluvia, nieve y caudal"
          description="Visualiza cómo varía cada tipo de precipitación a lo largo de los meses del año. Las barras muestran lluvia, la línea representa nieve, y el área sombreada indica el caudal medido."
          icon={<Calendar className="w-6 h-6 text-cyan-700" />}
          isLoading={loading}
          showPeriodSelector={true}
          selectedPeriod={periodoEvolucion}
          onPeriodChange={setPeriodoEvolucion}
        >
          <EvolucionMensual data={evolucionMensual} />
        </ChartCard>

        {/* Fila 4: Scatter y Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Precipitación vs Coordenadas"
            subtitle="Distribución geográfica"
            description="Relaciona la precipitación con la ubicación geográfica (latitud y longitud) de cada sitio. Los puntos rojos indican sitios con precipitación y los azules sitios con medición de caudal."
            icon={<MapPin className="w-6 h-6 text-pink-700" />}
            isLoading={loadingCoordenadas}
            showPeriodSelector={true}
            selectedPeriod={periodoCoordenadas}
            onPeriodChange={setPeriodoCoordenadas}
          >
            <div className="space-y-2">
              <div className="flex justify-end space-x-2">
                <select
                  className="px-3 py-1 text-sm border rounded-lg bg-white/50 border-gray-200"
                  value={tipoEventoCoordenadas || 'todos'}
                  onChange={(e) => setTipoEventoCoordenadas(e.target.value === 'todos' ? undefined : e.target.value)}
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="lluvia">Lluvia</option>
                  <option value="nieve">Nieve</option>
                  <option value="caudal">Caudal</option>
                </select>
              </div>
              <PrecipitacionCoordenadas 
                data={precipitacionCoordenadas} 
                periodo={periodoCoordenadas}
                tipoEvento={tipoEventoCoordenadas}
              />
            </div>
          </ChartCard>

          <ChartCard
            title="Patrón Mensual (Radar)"
            subtitle="Distribución circular anual"
            description="Visualización circular del patrón de eventos a lo largo de los 12 meses del año. Permite identificar estacionalidad, meses críticos y patrones climáticos anuales."
            icon={<Activity className="w-6 h-6 text-red-700" />}
            isLoading={loadingPatronMensual}
            showPeriodSelector={true}
            selectedPeriod={periodoPatronMensual}
            onPeriodChange={setPeriodoPatronMensual}
          >
            <div className="space-y-2">
              <div className="flex justify-end space-x-2">
                <select
                  className="px-3 py-1 text-sm border rounded-lg bg-white/50 border-gray-200"
                  value={tipoEventoPatronMensual || 'todos'}
                  onChange={(e) => setTipoEventoPatronMensual(e.target.value === 'todos' ? undefined : e.target.value)}
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="Lluvia">Lluvia</option>
                  <option value="Nieve">Nieve</option>
                  <option value="Caudal">Caudal</option>
                </select>
              </div>
              <PatronMensual data={patronMensual} />
            </div>
          </ChartCard>
        </div>

        {/* Fila 6: Análisis de frecuencia */}
        <ChartCard
          title="Comparativa de Precipitación por Zonas"
          subtitle="Áreas apiladas mostrando contribución de cada zona"
          description="Gráfico de áreas apiladas que muestra la distribución de Lluvia, Nieve y Caudal en diferentes rangos. Las tres capas representan los diferentes tipos de eventos meteorológicos."
          icon={<BarChart3 className="w-6 h-6 text-blue-700" />}
          isLoading={loadingAnalisisFrecuencia}
          showPeriodSelector={true}
          selectedPeriod={periodoAnalisisFrecuencia}
          onPeriodChange={setPeriodoAnalisisFrecuencia}
        >
          <div className="space-y-2">
            <div className="flex justify-end space-x-2">
              <select
                className="px-2 py-1 text-xs border rounded-lg bg-white/50 border-gray-200"
                value={rangoAnalisisFrecuencia}
                onChange={(e) => setRangoAnalisisFrecuencia(Number(e.target.value))}
              >
                <option value={5}>Rango: 5</option>
                <option value={10}>Rango: 10</option>
                <option value={20}>Rango: 20</option>
                <option value={50}>Rango: 50</option>
              </select>
            </div>
            <AnalisisFrecuencia 
              data={analisisFrecuencia} 
              estadisticas={estadisticasFrecuencia}
            />
          </div>
        </ChartCard>

        {/* Fila 7: Comparativa anual (Line Chart) */}
        <ChartCard
          title="Comparativa Año a Año"
          subtitle="Evolución de precipitación entre años"
          description="Compara la precipitación del mismo período en diferentes años. Líneas múltiples muestran tendencias anuales y cambios en los patrones climáticos."
          icon={<Waves className="w-6 h-6 text-teal-700" />}
          isLoading={loadingComparativa}
        >
          <div className="space-y-4">
            {/* Selector de años tipo candado */}
            <YearPicker
              availableYears={[]}
              selectedYears={selectedYearsComparativa}
              onYearsChange={setSelectedYearsComparativa}
              maxSelection={10}
            />
            
            {/* Gráfico */}
            <ComparativaAnual 
              data={comparativaAnual} 
              totales={totalesComparativa}
              configuracion={configuracionComparativa}
            />
          </div>
        </ChartCard>

      </div>

      {/* Footer con información */}
      <div className="max-w-7xl mx-auto mt-8 mb-6">
        <div className="backdrop-blur-2xl bg-white/50 border border-white/60 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-slate-800 font-semibold text-sm">
                  🌐 Conectado al Backend Laravel
                </p>
                <p className="text-slate-600 text-xs">
                  http://localhost:8000/api
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-600 text-sm">
                📊 Datos en tiempo real
              </p>
              <p className="text-slate-500 text-xs">
                Última actualización: {new Date().toLocaleString('es-ES')}
              </p>
            </div>
          </div>
          
          {/* Indicadores de datos cargados */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-blue-900 font-bold text-lg">{precipitacionPorZona.length}</p>
                <p className="text-blue-700 text-xs">Zonas</p>
              </div>
              <div className="bg-violet-50 rounded-lg p-2">
                <p className="text-violet-900 font-bold text-lg">{reportesPorInstrumento.length}</p>
                <p className="text-violet-700 text-xs">Instrumentos</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-2">
                <p className="text-emerald-900 font-bold text-lg">{topSitios.length}</p>
                <p className="text-emerald-700 text-xs">Top Sitios</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-2">
                <p className="text-amber-900 font-bold text-lg">{distribucionTipo.length}</p>
                <p className="text-amber-700 text-xs">Tipos</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-2">
                <p className="text-cyan-900 font-bold text-lg">{evolucionMensual.length}</p>
                <p className="text-cyan-700 text-xs">Meses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCharts;
