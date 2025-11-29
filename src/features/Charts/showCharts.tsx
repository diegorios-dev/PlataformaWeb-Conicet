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
  Globe,
  Clock,
  FileDown,
  Filter,
  Droplet,
  Snowflake,
  GitCompare,
} from "lucide-react";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";
import { DashboardLayout } from '@shared/ui/layouts/DashboardLayout';
import { Card } from "@shared/ui/molecules/Card";
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
import { API_URL } from "@config/api";

// Importar servicios de la API
import useChartsData from "./useChartsData";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState } from "react";

const ShowCharts = () => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
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

  const exportToPDF = async () => {
    try {
      setIsExportingPDF(true);
      
      // Crear un nuevo PDF en formato A4 horizontal para mejor aprovechamiento
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Función para dibujar el fondo decorativo de cada página
      const drawPageBackground = () => {
        const pageWidth = 297;
        const pageHeight = 210;
        
        // Fondo gradiente suave (simulado con rectángulos de diferentes opacidades)
        pdf.setFillColor(248, 250, 252); // slate-50
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Círculos decorativos en las esquinas
        pdf.setFillColor(219, 234, 254); // blue-100 con opacidad
        pdf.circle(10, 10, 30, 'F');
        pdf.setFillColor(224, 231, 255); // indigo-100
        pdf.circle(pageWidth - 10, 10, 25, 'F');
        pdf.setFillColor(232, 245, 233); // green-50
        pdf.circle(10, pageHeight - 10, 25, 'F');
        pdf.setFillColor(254, 243, 199); // amber-100
        pdf.circle(pageWidth - 10, pageHeight - 10, 30, 'F');
        
        // Líneas decorativas sutiles
        pdf.setDrawColor(191, 219, 254); // blue-200
        pdf.setLineWidth(0.5);
        pdf.line(0, 30, 60, 30);
        pdf.line(pageWidth - 60, pageHeight - 30, pageWidth, pageHeight - 30);
        
        // Borde decorativo
        pdf.setDrawColor(148, 163, 184); // slate-400
        pdf.setLineWidth(0.8);
        pdf.roundedRect(3, 3, pageWidth - 6, pageHeight - 6, 2, 2, 'S');
      };

      // Obtener todos los elementos de los gráficos - seleccionar solo los contenedores principales de gráficos
      const chartsContainer = document.querySelector('.max-w-7xl.mx-auto.space-y-6');
      if (!chartsContainer) {
        throw new Error('No se encontró el contenedor de gráficos');
      }

      // Obtener solo los Card directos (evitar duplicados)
      // Los gráficos están en divs con grid o como hijos directos del contenedor
      const allElements = Array.from(chartsContainer.children) as HTMLElement[];
      const Cards: HTMLElement[] = [];
      
      allElements.forEach(element => {
        if (element.classList.contains('grid')) {
          // Es un grid, obtener sus hijos
          const gridChildren = Array.from(element.children) as HTMLElement[];
          Cards.push(...gridChildren);
        } else {
          // Es un gráfico individual
          Cards.push(element);
        }
      });
      
      // Configuración para 4 gráficos por página (2x2)
      const pageWidth = 297; // A4 landscape width in mm
      const pageHeight = 210; // A4 landscape height in mm
      const margin = 8;
      const chartWidth = (pageWidth - (3 * margin)) / 2; // 2 gráficos por fila
      const chartHeight = (pageHeight - (3 * margin)) / 2; // 2 filas por página
      
      // Dibujar fondo de la primera página
      drawPageBackground();
      
      // Función helper para agregar información del período
      const getPeriodText = (periodo: string) => {
        const periods: Record<string, string> = {
          'day': 'Último día',
          'week': 'Última semana',
          'month': 'Último mes',
          'year': 'Último año',
          'all': 'Todos',
          'anio': 'Año actual',
          'año': 'Año actual',
          'todos': 'Todos'
        };
        return periods[periodo] || periodo;
      };

      // Mapeo de configuraciones para cada gráfico
      const chartConfigs = [
        { index: 0, config: getPeriodText(periodoPrecipitacion) },
        { index: 1, config: 'Todo el período' },
        { index: 2, config: getPeriodText(periodoTopZonas) },
        { index: 3, config: getPeriodText(periodoDistribucion) },
        { index: 4, config: getPeriodText(periodoEvolucion) }, // Evolución Mensual
        { index: 5, config: `${getPeriodText(periodoCoordenadas)} - ${tipoEventoCoordenadas || 'Todos'}` },
        { index: 6, config: `${getPeriodText(periodoPatronMensual)} - ${tipoEventoPatronMensual || 'Todos'}` },
        { index: 7, config: `${getPeriodText(periodoAnalisisFrecuencia)} - Rango: ${rangoAnalisisFrecuencia}` }, // Comparativa Zonas
        { index: 8, config: `Años: ${selectedYearsComparativa.join(', ') || 'Ninguno'}` }, // Comparativa Año a Año
      ];

      let chartIndex = 0;
      let currentPage = 0;

      // Función helper para agregar un gráfico normal (2x2 grid)
      const addNormalChart = async (card: HTMLElement, index: number) => {
        const chartElement = card.querySelector('.recharts-wrapper') as HTMLElement;
        if (!chartElement) return false;

        // Calcular posición en la grilla 2x2
        const row = Math.floor(chartIndex % 4 / 2);
        const col = chartIndex % 2;

        // Agregar nueva página si es necesario
        if (chartIndex > 0 && chartIndex % 4 === 0) {
          pdf.addPage();
          drawPageBackground();
          currentPage++;
        }

        const xPosition = margin + col * (chartWidth + margin);
        const yPosition = margin + row * (chartHeight + margin);

        await addChartToPosition(card, chartElement, xPosition, yPosition, chartWidth, chartHeight, index);
        chartIndex++;
        return true;
      };

      // Función para agregar un gráfico en una posición específica
      const addChartToPosition = async (
        card: HTMLElement,
        chartElement: HTMLElement,
        xPosition: number,
        yPosition: number,
        width: number,
        height: number,
        configIndex: number
      ) => {
        const titleElement = card.querySelector('h3');
        const subtitleElement = card.querySelector('p');
        const maxChartImgHeight = height - 14;

        // Dibujar fondo blanco del contenedor con sombra
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(xPosition, yPosition, width, height, 2, 2, 'F');
        
        // Dibujar borde con gradiente simulado
        pdf.setDrawColor(191, 219, 254);
        pdf.setLineWidth(0.4);
        pdf.roundedRect(xPosition - 0.3, yPosition - 0.3, width + 0.6, height + 0.6, 2, 2, 'S');
        
        pdf.setDrawColor(147, 197, 253);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(xPosition, yPosition, width, height, 2, 2, 'S');

        // Barra superior decorativa
        pdf.setFillColor(239, 246, 255);
        pdf.roundedRect(xPosition, yPosition, width, 11, 2, 2, 'F');
        
        pdf.setDrawColor(191, 219, 254);
        pdf.setLineWidth(0.3);
        pdf.line(xPosition + 2, yPosition + 10.5, xPosition + width - 2, yPosition + 10.5);

        // Título
        if (titleElement) {
          pdf.setFontSize(9);
          pdf.setTextColor(30, 64, 175);
          pdf.setFont('helvetica', 'bold');
          const title = titleElement.textContent || '';
          pdf.text(title, xPosition + 2, yPosition + 5, { maxWidth: width - 50 });
        }

        // Subtítulo
        if (subtitleElement) {
          pdf.setFontSize(6.5);
          pdf.setTextColor(100, 116, 139);
          pdf.setFont('helvetica', 'normal');
          const subtitle = subtitleElement.textContent || '';
          pdf.text(subtitle, xPosition + 2, yPosition + 8.5, { maxWidth: width - 50 });
        }

        // Configuración
        const configInfo = chartConfigs.find(c => c.index === configIndex);
        if (configInfo) {
          const configText = `Período: ${configInfo.config}`;
          pdf.setFontSize(6);
          pdf.setFont('helvetica', 'bold');
          const textWidth = pdf.getTextWidth(configText);
          
          pdf.setFillColor(220, 252, 231);
          pdf.roundedRect(xPosition + width - textWidth - 5, yPosition + 2, textWidth + 3, 4.5, 1, 1, 'F');
          
          pdf.setTextColor(22, 101, 52);
          pdf.text(configText, xPosition + width - textWidth - 3.5, yPosition + 5);
        }

        // Capturar el gráfico completo (incluyendo labels y valores)
        const canvas = await html2canvas(chartElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = width - 4;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const finalHeight = Math.min(imgHeight, maxChartImgHeight);
        
        pdf.setFillColor(226, 232, 240);
        pdf.roundedRect(xPosition + 2.5, yPosition + 11.5, imgWidth, finalHeight, 1, 1, 'F');
        
        pdf.addImage(imgData, 'PNG', xPosition + 2, yPosition + 11, imgWidth, finalHeight);
      };

      // Procesar gráficos con lógica especial
      let processedCharts = 0;
      
      for (let i = 0; i < Cards.length; i++) {
        const card = Cards[i] as HTMLElement;
        const chartElement = card.querySelector('.recharts-wrapper') as HTMLElement;
        if (!chartElement) continue;

        // Gráfico 4 (Evolución Mensual) - PÁGINA 2 - Ocupa 100% horizontal, 50% vertical (arriba)
        if (processedCharts === 4) {
          pdf.addPage();
          drawPageBackground();
          
          const fullWidth = pageWidth - (2 * margin);
          const halfHeight = (pageHeight - (3 * margin)) / 2;
          await addChartToPosition(card, chartElement, margin, margin, fullWidth, halfHeight, processedCharts);
          processedCharts++;
          continue;
        }

        // Gráficos 5 y 6 (Precipitación vs Coordenadas + Patrón Mensual Radar) - PÁGINA 2 - Abajo 50%/50%
        if (processedCharts === 5) {
          const card2 = Cards[i + 1] as HTMLElement;
          const chartElement2 = card2?.querySelector('.recharts-wrapper') as HTMLElement;
          
          if (chartElement2) {
            const halfWidth = (pageWidth - (3 * margin)) / 2;
            const halfHeight = (pageHeight - (3 * margin)) / 2;
            const yPosBottom = margin + halfHeight + margin;
            
            // Precipitación vs Coordenadas (abajo izquierda)
            await addChartToPosition(card, chartElement, margin, yPosBottom, halfWidth, halfHeight, processedCharts);
            processedCharts++;
            
            // Patrón Mensual Radar (abajo derecha)
            await addChartToPosition(card2, chartElement2, margin + halfWidth + margin, yPosBottom, halfWidth, halfHeight, processedCharts);
            processedCharts++;
            i++; // Saltar el siguiente porque ya lo procesamos
            continue;
          }
        }

        // Gráficos 7 y 8 (Comparativa Zonas y Comparativa Año a Año) - PÁGINA 3 - Verticalmente 50%/50%
        if (processedCharts === 7) {
          const card2 = Cards[i + 1] as HTMLElement;
          const chartElement2 = card2?.querySelector('.recharts-wrapper') as HTMLElement;
          
          if (chartElement2) {
            pdf.addPage();
            drawPageBackground();
            
            const fullWidth = pageWidth - (2 * margin);
            const halfHeight = (pageHeight - (3 * margin)) / 2;
            
            // Comparativa Zonas (arriba)
            await addChartToPosition(card, chartElement, margin, margin, fullWidth, halfHeight, processedCharts);
            processedCharts++;
            
            // Comparativa Año a Año (abajo)
            await addChartToPosition(card2, chartElement2, margin, margin + halfHeight + margin, fullWidth, halfHeight, processedCharts);
            processedCharts++;
            i++; // Saltar el siguiente porque ya lo procesamos
            continue;
          }
        }

        // Gráficos normales (2x2 grid) - PÁGINA 1
        await addNormalChart(card, processedCharts);
        processedCharts++;
      }

      // Agregar pie de página en todas las páginas
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Barra inferior decorativa
        pdf.setFillColor(239, 246, 255); // blue-50
        pdf.rect(0, pageHeight - 8, pageWidth, 8, 'F');
        
        pdf.setDrawColor(191, 219, 254); // blue-200
        pdf.setLineWidth(0.3);
        pdf.line(0, pageHeight - 8, pageWidth, pageHeight - 8);
        
        // Información del pie de página
        pdf.setFontSize(7);
        pdf.setTextColor(71, 85, 105); // slate-600
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Estadísticas de Precipitación - Generado: ${new Date().toLocaleString('es-ES')}`, margin, pageHeight - 4);
        
        // Número de página
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 64, 175); // blue-700
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 20, pageHeight - 4);
      }

      // Guardar el PDF
      pdf.save(`estadisticas-precipitacion-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      alert('Ocurrió un error al generar el PDF. Por favor, intenta nuevamente.');
    } finally {
      setIsExportingPDF(false);
    }
  };
 
  return (
    <DashboardLayout contentClassName="">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">

        <div className="backdrop-blur-2xlp-8">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight ">
                  Estadísticas y Análisis
                </h1>
                <p className="text-slate-600 mt-1">
                  Visualización completa de datos de precipitación en tiempo real
                </p>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex items-center gap-3">
              <button
                onClick={exportToPDF}
                disabled={isExportingPDF || loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <FileDown className={`w-5 h-5 ${isExportingPDF ? 'animate-bounce' : ''}`} />
                {isExportingPDF ? 'Generando PDF...' : 'Exportar PDF'}
              </button>
              
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
          <Card
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
          </Card>

          <Card
            title="Reportes por Instrumento"
            subtitle="Cantidad de mediciones registradas"
            description="Cantidad de mediciones realizadas por cada tipo de instrumento meteorológico. Útil para identificar qué instrumentos tienen más actividad o necesitan mantenimiento."
            icon={<Activity className="w-6 h-6 text-violet-700" />}
            isLoading={loading}
          >
            <ReportesPorInstrumento data={reportesPorInstrumento} />
          </Card>
        </div>

        {/* Fila 2: Top sitios y distribución tipo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
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
          </Card>

          <Card
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
          </Card>
        </div>

        {/* Fila 3: Evolución mensual (Composed Chart) */}
        <Card
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
        </Card>

        {/* Fila 4: Scatter y Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="Precipitación vs Coordenadas"
            subtitle="Distribución geográfica"
            description="Relaciona la precipitación con la ubicación geográfica (latitud y longitud) de cada sitio. Los puntos rojos indican sitios con precipitación y los azules sitios con medición de caudal."
            icon={<MapPin className="w-6 h-6 text-pink-700" />}
            isLoading={loadingCoordenadas}
            showPeriodSelector={true}
            selectedPeriod={periodoCoordenadas}
            onPeriodChange={setPeriodoCoordenadas}
          >
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="w-56">
                  <CustomSelect
                    options={[
                      { value: "todos", label: "Todos los tipos", icon: <Filter className="w-4 h-4" /> },
                      { value: "lluvia", label: "Lluvia", icon: <Droplet className="w-4 h-4" /> },
                      { value: "nieve", label: "Nieve", icon: <Snowflake className="w-4 h-4" /> },
                      { value: "caudal", label: "Caudal", icon: <Waves className="w-4 h-4" /> },
                    ]}
                    value={tipoEventoCoordenadas || "todos"}
                    onChange={(value) => setTipoEventoCoordenadas(String(value) === 'todos' ? undefined : String(value))}
                    placeholder="Tipo de evento"
                    icon={<Filter className="w-5 h-5" />}
                  />
                </div>
              </div>
              <PrecipitacionCoordenadas 
                data={precipitacionCoordenadas} 
                periodo={periodoCoordenadas}
                tipoEvento={tipoEventoCoordenadas}
              />
            </div>
          </Card>

          <Card
            title="Patrón Mensual (Radar)"
            subtitle="Distribución circular anual"
            description="Visualización circular del patrón de eventos a lo largo de los 12 meses del año. Permite identificar estacionalidad, meses críticos y patrones climáticos anuales."
            icon={<Activity className="w-6 h-6 text-red-700" />}
            isLoading={loadingPatronMensual}
            showPeriodSelector={true}
            selectedPeriod={periodoPatronMensual}
            onPeriodChange={setPeriodoPatronMensual}
          >
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="w-56">
                  <CustomSelect
                    options={[
                      { value: "todos", label: "Todos los tipos", icon: <Filter className="w-4 h-4" /> },
                      { value: "Lluvia", label: "Lluvia", icon: <Droplet className="w-4 h-4" /> },
                      { value: "Nieve", label: "Nieve", icon: <Snowflake className="w-4 h-4" /> },
                      { value: "Caudal", label: "Caudal", icon: <Waves className="w-4 h-4" /> },
                    ]}
                    value={tipoEventoPatronMensual || "todos"}
                    onChange={(value) => setTipoEventoPatronMensual(String(value) === 'todos' ? undefined : String(value))}
                    placeholder="Tipo de evento"
                    icon={<Filter className="w-5 h-5" />}
                  />
                </div>
              </div>
              <PatronMensual data={patronMensual} />
            </div>
          </Card>
        </div>

        {/* Fila 6: Análisis de frecuencia */}
        <Card
          title="Comparativa de Precipitación por Zonas"
          subtitle="Áreas apiladas mostrando contribución de cada zona"
          description="Gráfico de áreas apiladas que muestra la distribución de Lluvia, Nieve y Caudal en diferentes rangos. Las tres capas representan los diferentes tipos de eventos meteorológicos."
          icon={<BarChart3 className="w-6 h-6 text-blue-700" />}
          isLoading={loadingAnalisisFrecuencia}
          showPeriodSelector={true}
          selectedPeriod={periodoAnalisisFrecuencia}
          onPeriodChange={setPeriodoAnalisisFrecuencia}
        >
          <div className="space-y-3">
            <div className="flex justify-end">
              <div className="w-44">
                <CustomSelect
                  options={[
                    { value: "5", label: "Rango: 5", icon: <GitCompare className="w-4 h-4" /> },
                    { value: "10", label: "Rango: 10", icon: <GitCompare className="w-4 h-4" /> },
                    { value: "20", label: "Rango: 20", icon: <GitCompare className="w-4 h-4" /> },
                    { value: "50", label: "Rango: 50", icon: <GitCompare className="w-4 h-4" /> },
                  ]}
                  value={rangoAnalisisFrecuencia.toString()}
                  onChange={(value) => setRangoAnalisisFrecuencia(Number(value))}
                  placeholder="Seleccione rango"
                  icon={<GitCompare className="w-5 h-5" />}
                />
              </div>
            </div>
            <AnalisisFrecuencia 
              data={analisisFrecuencia} 
              estadisticas={estadisticasFrecuencia}
            />
          </div>
        </Card>

        {/* Fila 7: Comparativa anual (Line Chart) */}
        <Card
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
        </Card>

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
                <p className="text-slate-800 font-semibold text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Conectado al servidor de datos
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-600 text-sm flex items-center justify-end gap-2">
                <BarChart3 className="w-4 h-4" />
                Datos en tiempo real
              </p>
              <p className="text-slate-500 text-xs flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" />
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
    </DashboardLayout>
  );
};

export default ShowCharts;

