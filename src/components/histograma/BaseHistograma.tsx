import { useState, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, FileText } from "lucide-react";
import { useFetchData } from "../../hooks/useFetchData";
import BackButton from "../BackButton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { LoadingSpinner, EmptyState } from "../ui/LoadingState";

import autoTable from "jspdf-autotable";


export default function BaseHistograma({
  title,
  service,
  unidad = "mm",
  color = "#3b82f6",
  filenamePrefix = "histograma",
}) {

  const [pdfQuality, setPdfQuality] = useState(2);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [periodo, setPeriodo] = useState("mes");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // getMonth() es 0-indexado
  const chartRef = useRef(null);

  const fetchData = useCallback(() => {
    if (periodo === "dia") return service(periodo, year, month);
    if (periodo === "mes") return service(periodo, year, null);
    if (periodo === "año") return service(periodo, year, null);
    return service(periodo, null, null);
  }, [periodo, year, month, service]);

  const { data, loading, error } = useFetchData(fetchData);

  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  const generatePDF = async () => {
    setGenerandoPDF(true);
    try {
      if (!chartRef.current || !data) {
        alert("No hay datos para generar el PDF");
        setGenerandoPDF(false);
        return;
      }

      // Espera breve para asegurar que el gráfico esté renderizado
      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await html2canvas(chartRef.current as any, {
        scale: pdfQuality,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      // Metadatos PDF
      pdf.setProperties({
        title,
        author: "precipitacionWeb",
        keywords: "histograma, precipitacion, reporte, exportacion, pdf"
      });

      pdf.setFontSize(18);
      pdf.text(title, 148, 15, { align: "center" });
      pdf.setFontSize(12);

      let filterText = `Período: ${periodo}`;
      if (periodo === "mes" || periodo === "dia") filterText += ` - Año: ${year}`;
      if (periodo === "dia") {
        const monthName = months.find((m) => m.value === month)?.label;
        filterText += ` - Mes: ${monthName}`;
      }
      pdf.text(filterText, 148, 25, { align: "center" });

      const imgWidth = 260;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 18, 35, imgWidth, imgHeight);

      // Tabla de datos numéricos
      if (Array.isArray(data) && data.length > 0) {
        const columns = Object.keys(data[0]).map(key => ({ header: key, dataKey: key }));
        const rows = data.map(row => ({ ...row }));
        autoTable(pdf, {
          startY: 40 + imgHeight,
          head: [columns.map(col => col.header)],
          body: rows.map(row => columns.map(col => row[col.dataKey])),
          theme: 'grid',
          styles: { fontSize: 10 },
        });
      }

      // Marca de agua con fecha/hora de generación
      const fechaHora = new Date().toLocaleString();
      pdf.setFontSize(8);
      pdf.text(`Generado el ${fechaHora} por precipitacionWeb`, 18, pdf.internal.pageSize.getHeight() - 8);

      const fileName = `${filenamePrefix}-${periodo}-${year}${periodo === "dia" ? `-${month}` : ""}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('No se pudo generar el PDF. Intenta nuevamente.');
    } finally {
      setGenerandoPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <BackButton />

        {/* Header estilo ShowReport */}
        <div className="mb-6 flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{title}</h2>
            <p className="text-sm text-slate-600 mt-1 font-medium">Distribuciones y valores en {unidad}</p>
          </div>
        </div>

        {/* Controles y acciones */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <span className="text-base font-semibold text-slate-800">Configuración</span>
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-600">Calidad exportación:</label>
              <select
                value={pdfQuality}
                onChange={e => setPdfQuality(Number(e.target.value))}
                className="px-2 py-1 rounded border border-slate-300 text-xs bg-slate-50 font-medium"
                disabled={generandoPDF}
              >
                <option value={1}>Baja</option>
                <option value={2}>Media</option>
                <option value={3}>Alta</option>
              </select>
              <button
                onClick={generatePDF}
                disabled={!data || loading || generandoPDF}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <FileText size={18} />
                {generandoPDF ? (
                  <>
                    <span className="animate-pulse">Generando...</span>
                    <svg className="w-4 h-4 text-white animate-spin ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  </>
                ) : (
                  "Generar PDF"
                )}
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Agrupar por</label>
              <div className="bg-slate-100/70 border border-slate-200 rounded-full p-1 flex" role="group" aria-label="Agrupar por periodo">
                {[
                  { key: 'dia', label: 'Día' },
                  { key: 'mes', label: 'Mes' },
                  { key: 'año', label: 'Año' },
                ].map(btn => {
                  const active = periodo === btn.key;
                  return (
                    <button
                      key={btn.key}
                      onClick={() => setPeriodo(btn.key)}
                      aria-pressed={active}
                      className={`flex-1 px-4 py-2 rounded-full text-xs font-medium transition-all ${active ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'}`}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {(periodo === 'dia') && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600">Mes</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-700 text-sm font-medium transition"
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(periodo === 'dia' || periodo === 'mes') && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600">Año</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full pl-4 pr-3 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-700 text-sm font-medium transition"
                  min={2000}
                  max={2100}
                />
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="mt-5">
            {loading && <LoadingSpinner message="Cargando histograma..." />}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-center text-red-600 font-medium">Error: {error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico */}
        {!loading && !error && data && data.length > 0 && (
          <div className="bg-white/85 backdrop-blur-md border border-white/70 rounded-2xl p-4 shadow-[0_8px_24px_-12px_rgba(2,6,23,0.18)]">
            {/* Contenedor sin blur para captura PDF */}
            <div ref={chartRef} className="bg-white rounded-xl p-2">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={data}>
                  <XAxis dataKey="label" />
                  <YAxis label={{ value: unidad, angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {!loading && !error && (!data || data.length === 0) && (
          <EmptyState
            icon={BarChart3}
            title="Sin datos disponibles"
            description={`No hay registros para ${periodo === 'dia' ? 'este día' : periodo === 'mes' ? 'este mes' : 'este año'}`}
          />
        )}
      </div>
    </div>
  );
}
