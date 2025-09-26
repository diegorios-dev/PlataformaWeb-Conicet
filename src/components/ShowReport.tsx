import { useEffect, useState } from "react";
import { getReportes } from "../services/reporteService";

const ShowReport = ({handleShowEditFormReport}) => {

  const [reportes, setReportes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getReportes();
      setReportes(data);
    };
    fetchData();
  }, []);

  // Filtrar por ID o nota (ya no title porque tu JSON no tiene)
  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(reportes);
    } else {
      setFiltered(
        reportes.filter(
          (r) =>
            r.id.toString().includes(search) ||
            r.note?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, reportes]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Modificar Reportes</h2>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar reporte por ID o nota..."
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Listado */}
      <ul className="space-y-4 max-h-[400px] overflow-y-auto">
        {filtered.map((reporte) => (
          <li
            key={reporte.id}
            className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            <p className="font-semibold">ID: {reporte.id}</p>
            <p>Fecha: {reporte.date}</p>
            <p>Nota: {reporte.note}</p>
            <p>Imagen: {reporte.image}</p>
            <p>Audio: {reporte.audio}</p>

            {/* Amount si es regular */}
            {reporte.report_regular && (
              <p>Cantidad : {reporte.report_regular.amount} {reporte.report_regular.united_measure.abbreviation}</p>
            )}

            {/* Lat y Lng */}
            <p>Latitud: {reporte.site.latitude}</p>
            <p>Longitud: {reporte.site.longitude}</p>

            {/* Zona */}
            <p>Zona: {reporte.site.zona.locality}</p>

            <button className="mt-3 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => handleShowEditFormReport(reporte)}
            >
              Editar
            </button>
          </li>
        ))}

      </ul>
    </div>
  );
};

export default ShowReport;
