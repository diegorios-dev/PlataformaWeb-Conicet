import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getReportsForSite } from "../services/sitiosService";
import { useEffect, useState } from "react";

interface Coord {
  coordenadas: [number, number];
  cantidad: number;
  tipo: string;
  idSitio: number;
}

interface MapHTMLProps {
  position: Coord[];
}

interface SiteData {
  totalAmount: number;
  lastReportAmount: number;
}

const MapHTML = ({ position }: MapHTMLProps) => {
  const [siteReports, setSiteReports] = useState<Map<number, SiteData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear()); // null = todos los años

  // Generar años disponibles (desde 2023 hasta el año actual)
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: currentYear - 2022 }, (_, i) => 2023 + i);

  useEffect(() => {
    const fetchAllReports = async () => {
      if (!position || position.length === 0) {
        setLoading(false);
        return;
      }

      const reportsMap = new Map<number, SiteData>();

      try {
        // Fetchear reportes para cada sitio filtrados por el año seleccionado
        for (const coord of position) {
          if (coord.idSitio) {
            const reports = await getReportsForSite(coord.idSitio, selectedYear || undefined);
            console.log(`Reports for site ${coord.idSitio} (year ${selectedYear || 'all'}):`, reports);

            if (reports && reports.length > 0) {
              // Acumular el amount de cada reporte
              const totalAmount = reports.reduce((acc: number, report: any) => {
                const amount = parseFloat(report.amount) || 0;
                return acc + amount;
              }, 0);

              // Obtener el amount del último reporte
              const lastReport = reports[reports.length - 1];
              const lastReportAmount = parseFloat(lastReport.amount) || 0;

              reportsMap.set(coord.idSitio, {
                totalAmount,
                lastReportAmount
              });
            } else {
              reportsMap.set(coord.idSitio, {
                totalAmount: 0,
                lastReportAmount: 0
              });
            }
          }
        }

        setSiteReports(reportsMap);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, [position, selectedYear]);

  if (!position || position.length === 0) {
    return <p>No hay posiciones para mostrar</p>;
  }

  const center: [number, number] = position[0].coordenadas;

  console.log("position:", position);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {/* Selector de año */}
      <div className="absolute top-5 right-5 z-[1000] bg-white p-3 rounded-lg shadow-md flex items-center gap-2.5">
        <label htmlFor="year-filter" className="font-semibold text-sm text-gray-800">
          📅 Filtrar por año:
        </label>
        <select
          id="year-filter"
          value={selectedYear || "all"}
          onChange={(e) => {
        const value = e.target.value;
        setSelectedYear(value === "all" ? null : parseInt(value));
        setLoading(true);
          }}
          className="px-3 py-1.5 rounded-md border border-gray-300 text-sm cursor-pointer bg-gray-50 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los años</option>
          {availableYears.map(year => (
        <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <MapContainer key={JSON.stringify(center)} center={center} zoom={6} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      {position.map((coords, index) => {

      const siteData = siteReports.get(coords.idSitio);
      const totalAmount = siteData?.totalAmount || 0;
      const lastReportAmount = siteData?.lastReportAmount || 0;
      const yearLabel = selectedYear ? selectedYear.toString() : "Todos los años";
      
      
      return (
        <Marker key={index} position={coords.coordenadas}>
        <Popup>
          <div className="font-sans p-2 min-w-[200px]">
          <div className="text-base font-bold mb-2.5 text-blue-600 border-b-2 border-gray-200 pb-2">
            📍 Sitio : ({coords.coordenadas})
          </div>
          
          {loading ? (
            <div className="p-3 text-center text-gray-500 italic">
            Cargando reportes...
            </div>
          ) : (
            <div className="bg-gray-100 p-2.5 rounded-md mt-2.5">
            <div className="mb-1.5">
              <span className="text-[13px] text-emerald-600 font-bold">
              💧 Total acumulado ({yearLabel}):
              </span>{' '}
              <span className="text-[15px] font-bold text-emerald-700">
              {totalAmount.toFixed(2)} mm
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500">
              Último reporte:
              </span>{' '}
              <span className="text-sm text-gray-700">
              {lastReportAmount.toFixed(2)} mm
              </span>
            </div>
            </div>
          )}
          </div>
        </Popup>
        </Marker>
      );
      })}
    </MapContainer>
    </div>
  );
};


export default MapHTML;
