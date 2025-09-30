import { useEffect, useState } from "react";
import useReports from "../../../hooks/useReports";
import useNavegation from "../../../hooks/useNavegation";

const ShowReport = () => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  
  const {goEditReport, goBack} = useNavegation()
  const reports = useReports()
  

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(reports);
    } else {
      setFiltered(
        reports.filter(
          (r) =>
            r.id.toString().includes(search) ||
            r.note?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, reports]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <button
        onClick={goBack}
        className="px-6 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-950 transition font-semibold text-base"
        >
        Volver
        </button>
        <h2 className="text-3xl font-black text-blue-900 tracking-tight">
        Modificar Reportes
        </h2>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl border border-blue-200 p-10">
        {/* Buscador */}
        <input
        type="text"
        placeholder="Buscar reporte por ID o nota..."
        className="w-full p-4 border-2 border-blue-300 rounded-xl mb-8 focus:outline-none focus:ring-2 focus:ring-blue-700 transition text-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />

        {/* Listado */}
        <ul className="space-y-8 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 pr-2">
        {filtered.map((reporte) => (
          <li
          key={reporte.id}
          className="p-8 border border-blue-100 rounded-2xl bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-white shadow-lg transition group"
          >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
            <p className="font-bold text-blue-800 text-xl mb-1">
              ID: <span className="font-mono">{reporte.id}</span>
            </p>
            <p className="text-gray-700 mb-1">
              Fecha: <span className="font-medium">{reporte.date}</span>
            </p>
            <p className="text-gray-700 mb-1">
              Nota: <span className="italic">{reporte.note}</span>
            </p>
            <p className="text-gray-700 mb-1">
              Imagen: <span className="text-blue-700 underline">{reporte.image}</span>
            </p>
            <p className="text-gray-700 mb-1">
              Audio: <span className="text-blue-700 underline">{reporte.audio}</span>
            </p>
            {reporte.report_regular && (
              <p className="text-gray-800 font-medium mb-1">
              Cantidad: <span className="font-semibold">{reporte.report_regular.amount}</span>
              <span className="ml-1 text-blue-800">{reporte.report_regular.united_measure.abbreviation}</span>
              </p>
            )}
            </div>
            <div className="flex flex-col gap-2 text-base text-gray-600 bg-blue-50 rounded-xl px-6 py-4 border border-blue-100">
            <p>
              Latitud: <span className="font-mono">{reporte.site.latitude}</span>
            </p>
            <p>
              Longitud: <span className="font-mono">{reporte.site.longitude}</span>
            </p>
            <p>
              Zona: <span className="font-semibold text-blue-800">{reporte.site.zona.locality}</span>
            </p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
            className="mt-6 px-6 py-2 bg-blue-900 text-white rounded-lg shadow hover:bg-blue-950 transition font-semibold tracking-wide text-base group-hover:scale-105"
            onClick={() => goEditReport(reporte)}
            >
            Editar
            </button>
          </div>
          </li>
        ))}
        </ul>
      </div>
      </div>
    </div>
  );
};

export default ShowReport;
