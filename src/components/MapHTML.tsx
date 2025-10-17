import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getReportsForSite, getAvailableYears } from "../services/sitiosService";
import { useEffect, useState } from "react";
import { MapPin, Droplet, CalendarDays } from "lucide-react";
import LoadingPage from "../components/LoadingPage";

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
  lastReportDate: string | null;
}

const MapHTML = ({ position }: MapHTMLProps) => {
  const [siteReports, setSiteReports] = useState<Map<number, SiteData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Obtener años disponibles desde el backend (solo años con reportes reales)
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const years = await getAvailableYears();
        setAvailableYears(years);
        
        
        // 🎯 Seleccionar automáticamente el año más reciente
        if (years.length > 0) {
          setSelectedYear(years[0]); // Esto sería 2023
        }
      } catch (error) {
        console.error("Error fetching available years:", error);
        // Fallback: generar años desde 2014 hasta el año actual
        const currentYear = new Date().getFullYear();
        const fallbackYears = [];
        for (let year = 2014; year <= currentYear; year++) {
          fallbackYears.push(year);
        }
        setAvailableYears(fallbackYears);
        if (fallbackYears.length > 0) {
          setSelectedYear(fallbackYears[fallbackYears.length - 1]);
        }
      }
    };
    fetchAvailableYears();
  }, []);

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
  

            if (reports && reports.length > 0) {
              // Acumular el amount de cada reporte
              const totalAmount = reports.reduce((acc: number, report: any) => {
                const amount = parseFloat(report.amount) || 0;
                return acc + amount;
              }, 0);

              // Obtener el amount y fecha del último reporte
              const lastReport = reports[reports.length - 1];
              const lastReportAmount = parseFloat(lastReport.amount) || 0;
              const lastReportDate = lastReport.report?.date || null;

              reportsMap.set(coord.idSitio, {
                totalAmount,
                lastReportAmount,
                lastReportDate
              });
            } else {
              reportsMap.set(coord.idSitio, {
                totalAmount: 0,
                lastReportAmount: 0,
                lastReportDate: null
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
    return <LoadingPage />;
  }

  const center: [number, number] = position[0].coordenadas;

  return (
    <div className="relative h-screen w-full">
      {/* Selector de año */}
      <div className="absolute top-5 right-5 z-[1000] bg-white p-3 rounded-lg shadow-md flex items-center gap-3">
        <label htmlFor="year-filter" className="font-semibold text-sm text-gray-800">
          Filtrar por año:
        </label>
        <div className="relative">
          <select
            id="year-filter"
            value={selectedYear || "all"}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedYear(value === "all" ? null : parseInt(value));
              setLoading(true);
            }}
            className="pl-10 pr-8 py-2 rounded-md border border-gray-300 text-sm cursor-pointer bg-gray-50 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">Todos los años</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-800 pointer-events-none" />
          <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      <MapContainer
        key={JSON.stringify(center)}
        center={center}
        zoom={6}
        style={{ height: "100vh", width: "100%" }}
        maxBounds={[
          [-90, -180],
          [90, 180]
        ]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />

        {position.map((coords, index) => {
          const siteData = siteReports.get(coords.idSitio);
          const totalAmount = siteData?.totalAmount || 0;
          const lastReportAmount = siteData?.lastReportAmount || 0;
          const lastReportDate = siteData?.lastReportDate;
          const yearLabel = selectedYear ? selectedYear.toString() : "Todos los años";

          // Formatear la fecha
          const formattedDate = lastReportDate 
            ? new Date(lastReportDate).toLocaleDateString('es-AR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            : yearLabel;
          
            const reportYear = lastReportDate 
          ? new Date(lastReportDate).getFullYear()
          : (selectedYear || 'N/A');

          console.log(`marcador numero ${index}:`, {
            idSitio: coords.idSitio,
            coordenadas: coords.coordenadas,
            siteData,
            totalAmount,
            lastReportAmount,
            lastReportDate,
            formattedDate,
            shouldRender: siteData && (totalAmount !== 0 || lastReportAmount !== 0)
          });

          if (!siteData || (totalAmount === 0 && lastReportAmount === 0)) {
            return null;
          }



          return (
            <Marker key={index} position={coords.coordenadas}>
              <Popup>
                <div className="font-sans p-2 min-w-[220px] bg-white rounded-xl">
                  <div className="flex items-center gap-2 mb-3 pb-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-base font-semibold text-gray-900">
                      Sitio: <span className="text-gray-500">({coords.coordenadas.join(", ")})</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 font-medium">Total acumulado</span>
                      <span className="ml-auto text-sm text-blue-700 font-bold">
                        {totalAmount.toFixed(2)} mm
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500 italic text-start">Último reporte el: {formattedDate}  </span>
                      <span className="ml-auto text-xs text-gray-700 font-semibold">
                        {lastReportAmount.toFixed(2)} mm
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <CalendarDays className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-500">
                        Fecha: <span className="font-medium text-gray-700"> {reportYear}</span>
                      </span>
                    </div>
                  </div>
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