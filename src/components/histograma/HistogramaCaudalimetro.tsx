import { useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useFetchData } from "../../hooks/useFetchData";
import { getHistogramaCaudalimetro } from "../../services/reportService";
import BackButton from "../BackButton";

export default function HistogramaCaudalimetro() {
  const [periodo, setPeriodo] = useState("mes");
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(10);

  // Función que llama al servicio
  const fetchData = useCallback(() => {
    // Solo enviar year y month según el periodo
    if (periodo === "dia") {
      return getHistogramaCaudalimetro(periodo, year, month);
    } else if (periodo === "mes") {
      return getHistogramaCaudalimetro(periodo, year, null);
    } else {
      return getHistogramaCaudalimetro(periodo, null, null);
    }
  }, [periodo, year, month]);

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

  return (
    <div className="w-4/5 mx-auto my-10">
      <div className="p-10">
        <BackButton />
      </div>
      <h2 className="text-center text-2xl font-semibold mb-6">Histograma de Caudalímetro</h2>

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
        <div className="bg-white rounded-lg shadow p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="label" />
              <YAxis label={{ value: "L/s", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#0288D1" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
