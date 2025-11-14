import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getReportsForSites, getAvailableYears, getStatusSite } from "../services/sitiosService";
import { MapPin, Droplet, CalendarDays, AlertTriangle } from "lucide-react";
import L from "leaflet";
import iconReporteRegular from "../assets/iconReporteRegular.png";
import iconReporteInstrumentoRoto from "../assets/iconReporteIntrumentroRoto.png";
import { useEffect, useMemo, useRef, useState } from "react";
import { LoadingMap, LoadingSpinner } from "./ui/LoadingState";
import { Lightbulb } from "lucide-react";

interface Coord {
  coordenadas: [number, number];
  cantidad: number;
  tipo: string;
  idSitio: number;
  nombreSitio?: string;
}

interface MapHTMLProps {
  position: Coord[];
  loading?: boolean;
}

interface SiteData {
  totalAmount: number;
  lastReportAmount: number;
  lastReportDate: string | null;
}

interface SiteStatus {
  status: boolean;
  tiene_instrumentos_averiados: boolean;
  instrumentos_averiados: Array<{
    instrument_id: number;
    instrument_name: string;
    description: string;
    last_breakage_date: string;
    cantidad_reportes_rotura: number;
  }>;
}

// Función para crear iconos personalizados según el tipo de instrumento y estado
const getCustomIcon = (tipo: string, isHealthy: boolean = true) => {
  const config = {
    'Lluvia': {
      color: '#3b82f6',      // Azul
      shadow: 'rgba(59, 130, 246, 0.15)'
    },
    'Nieve': {
      color: '#06b6d4',      // Cyan
      shadow: 'rgba(6, 182, 212, 0.15)'
    },
    'Caudal': {
      color: '#10b981',      // Verde
      shadow: 'rgba(16, 185, 129, 0.15)'
    }
  };

  // Si hay instrumentos averiados, usar sombra roja
  const shadowColor = !isHealthy ? 'rgba(239, 68, 68, 0.15)' : (config[tipo as keyof typeof config] || config['Lluvia']).shadow;
  const iconSrc = !isHealthy ? iconReporteInstrumentoRoto : iconReporteRegular;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 2px 4px ${shadowColor});
        -webkit-filter: drop-shadow(0 2px 4px ${shadowColor});
        animation: float-marker 3s ease-in-out infinite, pulse-shadow 3s ease-in-out infinite;
        transform: translateZ(0);
        will-change: transform, filter;
        transition: transform 0.2s ease;
      "
      onmouseover="this.style.animation='none'; this.style.transform='scale(1.15) translateZ(0)'"
      onmouseout="this.style.animation='float-marker 3s ease-in-out infinite, pulse-shadow 3s ease-in-out infinite'; this.style.transform='translateZ(0)'"
      >
        <img src="${iconSrc}" 
             style="
               width: 48px; 
               height: 48px;
               filter: hue-rotate(0deg) saturate(1.2);
             " 
             alt="marker" 
        />
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24]
  });
};

const MapHTML = ({ position, loading: externalLoading }: MapHTMLProps) => {
  const [siteReports, setSiteReports] = useState<Map<number, SiteData>>(new Map());
  const [siteStatus, setSiteStatus] = useState<Map<number, SiteStatus>>(new Map());
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await getAvailableYears();
        
        // Manejar tanto si viene un array directo como si viene { years: [...] }
        let years: number[] = [];
        
        if (Array.isArray(response)) {
          years = response;
        } else if (response && typeof response === 'object' && 'years' in response) {
          years = (response as any).years || [];
        }
        
        setAvailableYears(years);
        
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error("Error fetching available years:", error);
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

  // Fetch site status (instrumentos averiados)
  useEffect(() => {
    const fetchSiteStatus = async () => {
      if (!position || position.length === 0) {
        return;
      }

      const statusMap = new Map<number, SiteStatus>();

      try {
        for (const coord of position) {
          if (coord.idSitio) {
            try {
              const status = await getStatusSite(coord.idSitio);
              statusMap.set(coord.idSitio, status);
            } catch (error) {
              console.error(`Error fetching status for site ${coord.idSitio}:`, error);
              // Si hay error, asumir que el sitio está sano
              statusMap.set(coord.idSitio, {
                status: true,
                tiene_instrumentos_averiados: false,
                instrumentos_averiados: []
              });
            }
          }
        }

        setSiteStatus(statusMap);
      } catch (error) {
        console.error("Error fetching site statuses:", error);
      }
    };

    fetchSiteStatus();
  }, [position]);
  const siteIds = useMemo(() => (position || []).filter(p => p.idSitio).map(p => p.idSitio), [position]);
  const lastQueryKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchAllReports = async () => {
      if (!position || position.length === 0) {
        setLoadingReports(false);
        return;
      }

      const queryKey = `${selectedYear ?? 'all'}|${siteIds.join(',')}`;

      // Evita refetch innecesario si el conjunto de sitios y el año no cambiaron
      if (lastQueryKeyRef.current === queryKey && siteReports.size > 0) {
        setLoadingReports(false);
        return;
      }

      setLoadingReports(true);
      const reportsMap = new Map<number, SiteData>();
      try {
        // Llamada batch (con fallback interno)
        const batchResults = await getReportsForSites(siteIds, selectedYear || undefined);

        batchResults.forEach(({ siteId, reports }) => {
          if (!siteId) return;
          if (reports && reports.length > 0) {
            const totalAmount = reports.reduce((acc: number, report: any) => {
              const amount = parseFloat(report.amount) || 0;
              return acc + amount;
            }, 0);

            const lastReport = reports[reports.length - 1];
            const lastReportAmount = parseFloat(lastReport.amount) || 0;
            const lastReportDate = lastReport.report?.date || null;

            reportsMap.set(siteId, {
              totalAmount,
              lastReportAmount,
              lastReportDate
            });
          } else {
            reportsMap.set(siteId, {
              totalAmount: 0,
              lastReportAmount: 0,
              lastReportDate: null
            });
          }
        });

        setSiteReports(reportsMap);
        lastQueryKeyRef.current = queryKey;
      } catch (error) {
        console.error('Error fetching batch reports:', error);
      } finally {
        setLoadingReports(false);
      }
    };
    fetchAllReports();
  }, [position, siteIds, selectedYear]);

  // Mostrar loading mientras carga datos externos
  if (externalLoading) {
    return <LoadingMap message="Cargando sitios..." siteCount={0} />;
  }

  // Mostrar loading mientras carga los reportes/puntos del mapa
  if (loadingReports) {
    return <LoadingSpinner message={`Cargando datos de ${position?.length || 0} reportes...`} size="lg" />;
  }

  // Si terminó de cargar pero no hay datos
  if (!position || position.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-10 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl max-w-md shadow-xl">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No hay datos disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            No se encontraron sitios con datos para el instrumento seleccionado.
          </p>
          <div className="text-sm text-gray-500 bg-blue-50 rounded-lg p-4">
            <Lightbulb className="inline w-4 h-4 mr-1 text-yellow-400" />
            <strong>Sugerencia:</strong> Intenta seleccionar otro instrumento desde el menú lateral
          </div>
        </div>
      </div>
    );
  }

  const center: [number, number] = position[0].coordenadas;

  return (
    <div className="relative w-full h-full">
      {/* Selector de año */}
      <div className="absolute top-5 right-5 z-[1000] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-3">
          <label htmlFor="year-filter" className="font-semibold text-sm text-slate-700 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            Filtrar por año:
          </label>
          <div className="relative">
            <select
              id="year-filter"
              value={selectedYear || "all"}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedYear(value === "all" ? null : parseInt(value));
                setLoadingReports(true);
              }}
              className="pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm cursor-pointer bg-slate-50 font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">Todos los años</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <MapContainer
        key={JSON.stringify(center)}
        center={center}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
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

          if (!siteData || (totalAmount === 0 && lastReportAmount === 0)) {
            return null;
          }

          // Obtener el estado del sitio para determinar el icono
          const status = siteStatus.get(coords.idSitio);
          const isHealthy = status?.status !== false; // Si status es false, el sitio tiene instrumentos averiados

          return (
            <Marker 
              key={index} 
              position={coords.coordenadas}
              icon={getCustomIcon(coords.tipo, isHealthy)}
            >
              <Popup>
                <div className="font-sans p-3 min-w-[260px] bg-white rounded-xl">
                  {/* Header del popup */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-base font-bold text-slate-800 block">
                        {coords.nombreSitio || 'Sitio'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {coords.coordenadas[0].toFixed(4)}, {coords.coordenadas[1].toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="space-y-3">
                    {/* Total acumulado */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplet className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Total Acumulado
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-blue-700 block">
                        {totalAmount.toFixed(2)} <span className="text-sm font-medium">mm</span>
                      </span>
                    </div>

                    {/* Último reporte */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Último Reporte
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-slate-800">
                            {lastReportAmount.toFixed(2)} <span className="text-xs font-medium text-slate-500">mm</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {formattedDate}
                        </p>
                      </div>
                    </div>

                    {/* Año */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">Año de registro:</span>
                      <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {reportYear}
                      </span>
                    </div>

                    {/* Instrumentos averiados */}
                    {status && !status.status && status.instrumentos_averiados.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                            Instrumentos Averiados
                          </span>
                        </div>
                        <div className="space-y-2">
                          {status.instrumentos_averiados.map((inst, idx) => (
                            <div key={idx} className="bg-white rounded p-2 border border-red-100">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-slate-800">{inst.instrument_name}</span>
                                <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                  {inst.cantidad_reportes_rotura} reporte{inst.cantidad_reportes_rotura > 1 ? 's' : ''}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mb-1">{inst.description}</p>
                              <p className="text-xs text-slate-500">
                                Última rotura: {new Date(inst.last_breakage_date).toLocaleDateString('es-AR')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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