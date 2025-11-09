import { useState } from "react";
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
import IconNavMenu from "../../IconNavMenu";
import { LoadingSpinner } from "../../ui/LoadingState";
import { API_URL } from "../../../config/api";

// Importar servicios de la API
import useChartsData from "./useChartsData";

const ShowCharts = () => {
  const {
    loading, error,
    precipitacionPorZona, reportesPorInstrumento, topSitios, distribucionTipo, evolucionMensual,
    precipitacionCoordenadas, patronMensual, analisisFrecuencia, comparativaAnual,
    estadisticasFrecuencia, totalesComparativa, configuracionComparativa,
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
    loadingCoordenadas, loadingPatronMensual, loadingAnalisisFrecuencia, loadingComparativa,
    refreshAll,
  } = useChartsData();

  // showCharts ahora usa el hook y solo renderiza

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">

      <IconNavMenu />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 mt-16">
        <BackButton />
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
              onClick={refreshAll}
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
                Verifica que el backend esté corriendo en {API_URL}
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
                  {API_URL}
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
