import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getReportsForSites, getAvailableYears, getStatusSite } from "../services/sitiosService";
import { CalendarDays } from "lucide-react";
import L from "leaflet";
import iconReporteRegular from "../assets/iconReporteRegular.png";
import iconReporteInstrumentoRoto from "../assets/iconReporteIntrumentroRoto.png"
import { useEffect, useMemo, useRef, useState } from "react";
import { LoadingSpinner } from "./ui/LoadingState";
import { LoadingMap } from "./ui/LoadingState";

/* ----------------------- INTERFACES ----------------------- */

interface Coord {
  coordenadas: [number, number];
  cantidad: number;
  tipo: string;
  idSitio: number;
  nombreSitio?: string;
}

interface MapHTMLProps {
  position: Coord[];
  loading: boolean;
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

/* ----------------------- ICONOS PERSONALIZADOS ----------------------- */

const getCustomIcon = (tipo: string, isHealthy: boolean = true) => {
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
        transform: translateZ(0);
      ">
        <img 
          src="${iconSrc}" 
          style="width: 48px; height: 48px;" 
          alt="marker" 
        />
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24]
  });
};

/* ----------------------- COMPONENTE PRINCIPAL ----------------------- */

const MapHTML = ({ position, loading: externalLoading }: MapHTMLProps) => {
  const [siteReports, setSiteReports] = useState<Map<number, SiteData>>(new Map());
  const [siteStatus, setSiteStatus] = useState<Map<number, SiteStatus>>(new Map());
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const lastQueryKeyRef = useRef<string | null>(null);

  /* ------------------- AÑOS DISPONIBLES ------------------- */
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await getAvailableYears();
        let years: number[] = [];

        if (Array.isArray(response)) {
          years = response;
        } else if (response && typeof response === "object" && "years" in response) {
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
        setSelectedYear(fallbackYears[fallbackYears.length - 1]);
      }
    };

    fetchAvailableYears();
  }, []);

  /* ------------------- ESTADO DE SITIOS ------------------- */
  useEffect(() => {
    const fetchSiteStatus = async () => {
      if (!position || position.length === 0) return;

      const statusMap = new Map<number, SiteStatus>();

      for (const coord of position) {
        if (!coord.idSitio) continue;

        try {
          const status = await getStatusSite(coord.idSitio);
          statusMap.set(coord.idSitio, status);
        } catch {
          statusMap.set(coord.idSitio, {
            status: true,
            tiene_instrumentos_averiados: false,
            instrumentos_averiados: []
          });
        }
      }

      setSiteStatus(statusMap);
    };

    fetchSiteStatus();
  }, [position]);

  const siteIds = useMemo(() => (position || []).map((p) => p.idSitio), [position]);

  /* ------------------- REPORTES ------------------- */
  useEffect(() => {
    const fetchAllReports = async () => {
      if (!position || position.length === 0) {
        setLoadingReports(false);
        return;
      }

      const queryKey = `${selectedYear ?? "all"}|${siteIds.join(",")}`;

      if (lastQueryKeyRef.current === queryKey && siteReports.size > 0) {
        setLoadingReports(false);
        return;
      }

      setLoadingReports(true);

      try {
        const reportsMap = new Map<number, SiteData>();
        const batchResults = await getReportsForSites(siteIds, selectedYear || undefined);

        batchResults.forEach(({ siteId, reports }) => {
          if (!siteId) return;

          if (reports && reports.length > 0) {
            const totalAmount = reports.reduce((acc, report) => acc + (parseFloat(report.amount) || 0), 0);
            const last = reports[reports.length - 1];

            reportsMap.set(siteId, {
              totalAmount,
              lastReportAmount: parseFloat(last.amount) || 0,
              lastReportDate: last.report?.date || null
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
        console.error("Error fetching reports:", error);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchAllReports();
  }, [position, selectedYear]);

  /* ------------------- LOADING ------------------- */

  if (externalLoading) {
    return <LoadingMap message="Cargando sitios..." siteCount={0} />;
  }

  const isStatusReady = position.every((coord) => siteStatus.has(coord.idSitio));

  if (loadingReports || !isStatusReady) {
    return <LoadingSpinner message={`Cargando datos de ${position.length} sitios...`} size="lg" />;
  }

  if (!position || position.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div>No hay datos disponibles.</div>
      </div>
    );
  }

  /* ------------------- MAPA ------------------- */

  const center = position[0].coordenadas;

  return (
    <div className="relative w-full h-full">
      {/* Selector de año */}
      <div className="absolute top-5 right-5 z-[1000] bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="px-4 py-3 flex items-center gap-3">
          <label className="font-semibold text-sm text-slate-700 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            Filtrar por año:
          </label>

          <select
            value={selectedYear || "all"}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedYear(value === "all" ? null : parseInt(value));
              setLoadingReports(true);
            }}
            className="pl-3 pr-8 py-2 rounded-lg border bg-slate-50"
          >
            <option value="all">Todos</option>
            {availableYears.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {position.map((coords, index) => {
          const siteData = siteReports.get(coords.idSitio);
          const status = siteStatus.get(coords.idSitio);
          const isHealthy = status?.status !== false;

          if (!siteData || siteData.totalAmount === 0) {
            return (
              <Marker
                key={index}
                position={coords.coordenadas}
                icon={getCustomIcon("nodata", true)}
              >
                <Popup>
                  <div className="p-3 text-center">
                    <h3 className="font-bold">{coords.nombreSitio}</h3>
                    <p>Sin datos para este sitio.</p>
                  </div>
                </Popup>
              </Marker>
            );
          }

          return (
            <Marker
              key={index}
              position={coords.coordenadas}
              icon={getCustomIcon(coords.tipo, isHealthy)}
            >
              <Popup>
                <div className="p-3 text-sm">
                  <h3 className="font-bold">{coords.nombreSitio}</h3>
                  <p>Total: {siteData.totalAmount} mm</p>
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
