import { useEffect, useState } from "react";
import useReports from "../../../hooks/useReports";
import useNavegation from "../../../hooks/useNavegation";
import { ArrowLeft, Pencil, Search } from "lucide-react";
const ShowReport = () => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);

  const { goEditReport, goBack } = useNavegation();
  const reports = useReports();

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
    <div className="min-h-screen bg-blue-50 p-4 w-full">
      <div className="w-full mx-auto p-10">
      <div className="mb-6 flex justify-between items-center">
        <button
        onClick={goBack}
        className="px-4 py-2 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-950 transition font-semibold text-base flex items-center gap-2"
        >
        <ArrowLeft size={20} />
        Volver
        </button>
        <h2 className="text-3xl font-black text-blue-900 tracking-tight">
        Modificar Reportes
        </h2>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl border border-blue-200 p-10 w-full">
        {/* Buscador */}
        <div className="relative mb-8">
        <input
          type="text"
          placeholder="Buscar reporte por ID o nota..."
          className="w-full p-4 pl-12 border-2 border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 transition text-lg shadow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={22} />
        </div>

        {/* Listado en 2 columnas */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 pr-2">
        {filtered.map((reporte) => (
          <li
          key={reporte.id}
          className="p-8 border border-blue-100 rounded-2xl bg-white shadow-xl transition group hover:shadow-2xl hover:border-blue-300"
          >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex-1">
            <p className="font-bold text-blue-800 text-xl mb-1 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-mono">ID: {reporte.id}</span>
            </p>
            <p className="text-gray-700 mb-1">
              Fecha: <span className="font-medium">{reporte.date}</span>
            </p>
            <p className="text-gray-700 mb-1">
              Nota: <span className="italic">{reporte.note}</span>
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
            <div className="flex flex-col gap-2 text-base text-gray-600 bg-blue-50 rounded-xl px-2 py-2 border border-blue-100 shadow mt-4 md:mt-0">
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
            <div className="md:w-48 flex-shrink-0 flex justify-center items-center">
            {reporte.image ? (
              <img
              src={"../../../../" + reporte.image}
              alt="Reporte"
              className="rounded-xl border border-blue-200 shadow w-full h-auto max-h-40 object-cover"
              />
            ) : (
              <span className="text-gray-400 italic">Sin imagen</span>
            )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
            className="mt-6 px-2 py-2 bg-blue-900 text-white rounded-full shadow hover:bg-blue-950 transition font-semibold tracking-wide text-base group-hover:scale-105 flex items-center gap-2"
            onClick={() => goEditReport(reporte)}
            >
            <Pencil size={18} />
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
