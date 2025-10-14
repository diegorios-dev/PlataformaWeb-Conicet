import { useState, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useFetchData } from "../../hooks/useFetchData";
import { getHistograma } from "../../services/reportService";
import BackButton from "../BackButton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import {FileText} from "lucide-react";

export default function HistogramaLluvia() {
  const [periodo, setPeriodo] = useState("mes");
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(10);
  const chartRef = useRef<HTMLDivElement>(null);

  // Función que llama al servicio
  const fetchData = useCallback(() => {
    // Solo enviar year y month según el periodo
    if (periodo === "dia") {
      return getHistograma(periodo, year, month);
    } else if (periodo === "mes") {
      return getHistograma(periodo, year, null);
    } else {
      return getHistograma(periodo, null, null);
    }
  }, [periodo, year, month]);

  const { data, loading, error } = useFetchData(fetchData);

  const generatePDF = async () => {
    if (!chartRef.current || !data) {
      alert('No hay datos para generar el PDF');
      return;
    }

    try {
      console.log('Iniciando captura del gráfico...');
      
      // Capturar el gráfico como imagen
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      console.log('Gráfico capturado, generando PDF...');

      const imgData = canvas.toDataURL('image/png');
      
      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Agregar título
      pdf.setFontSize(18);
      pdf.text('Histograma de Lluvia', 148, 15, { align: 'center' });

      // Agregar información del filtro
      pdf.setFontSize(12);
      let filterText = `Período: ${periodo}`;
      if (periodo === 'mes' || periodo === 'dia') {
        filterText += ` - Año: ${year}`;
      }
      if (periodo === 'dia') {
        const monthName = months.find(m => m.value === month)?.label;
        filterText += ` - Mes: ${monthName}`;
      }
      pdf.text(filterText, 148, 25, { align: 'center' });

      // Agregar imagen del gráfico
      const imgWidth = 260;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 18, 35, imgWidth, imgHeight);

      console.log('PDF generado correctamente');

      // Guardar PDF
      const fileName = `histograma-lluvia-${periodo}-${year}${periodo === 'dia' ? `-${month}` : ''}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF descargado:', fileName);
    } catch (error) {
      console.error('Error detallado al generar PDF:', error);
      alert(`Error al generar el PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

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

  return (
    <div className="w-4/5 mx-auto my-10">
      <div className="p-10">
        <BackButton />
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={generatePDF}
          disabled={!data || loading}
          className="px-4 py-2 bg-sky-300 text-white rounded-full hover:bg-sky-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <FileText />
          <span>Generar PDF</span>
        </button>
      </div>

      <h2 className="text-center text-2xl font-semibold mb-6">Histograma de Lluvia</h2>

      {/* Filtros */}
      <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
        <label htmlFor="periodo" className="font-medium">Agrupar por: </label>
        <select
          id="periodo"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="dia">Día</option>
          <option value="mes">Mes</option>
          <option value="año">Año</option>
        </select>

        {periodo === "dia" && (
          <>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 w-24"
              min={2000}
              max={2100}
            />
          </>
        )}

        {periodo === "mes" && (
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 w-24"
            min={2000}
            max={2100}
          />
        )}
      </div>

      {loading && <p className="text-center text-gray-500">Cargando datos...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && data && (
        <div ref={chartRef} className="bg-white rounded-lg shadow p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="label" />
              <YAxis label={{ value: "mm", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#38bdf8" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
