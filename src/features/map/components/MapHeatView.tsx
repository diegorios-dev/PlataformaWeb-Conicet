import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import { getReportes } from "@features/report/services";
import { getAllEvents, type Event } from "@features/event/services";
import { BeatLoader } from "react-spinners";
import { Droplet, Snowflake, Activity, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import "@/App.css"
import NavMenu from "@/shared/ui/layouts/navMenu";

const HeatMapView = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [heatLayer, setHeatLayer] = useState<any>(null);
  const [baseLayer, setBaseLayer] = useState<L.TileLayer | null>(null);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState<L.CircleMarker[]>([]);
  const [baseMap, setBaseMap] = useState<"original" | "vegetacion" | "topografia">("original");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
        // Seleccionar el primer evento por defecto
        if (data.length > 0) {
          setSelectedEventId(data[0].id);
        }
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getReportes();
        setReportes(data || []);
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper para obtener el icono según el tipo de evento
  const getEventIcon = (eventType: string) => {
    const type = eventType.toLowerCase();
    if (type.includes("nieve")) {
      return <Snowflake className="w-5 h-5" />;
    } else if (type.includes("caudal")) {
      return <Activity className="w-5 h-5" />;
    } else {
      return <Droplet className="w-5 h-5" />;
    }
  };

  // Helper para obtener emoji según el tipo de evento
  const getEventEmoji = (eventType: string) => {
    const type = eventType.toLowerCase();
    if (type.includes("nieve")) return "❄️";
    if (type.includes("caudal")) return "🌊";
    return "💧";
  };

  useEffect(() => {
    const map = L.map("heatmap", {
      scrollWheelZoom: true,
      zoomControl: false,
      minZoom: 6,
      maxZoom: 14,
    }).setView([-41.13, -71.31], 8);

    L.control.zoom({
      position: "bottomright",
      zoomInTitle: "Acercar",
      zoomOutTitle: "Alejar",
    }).addTo(map);

    const layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 18,
    }).addTo(map);

    setMapInstance(map);
    setBaseLayer(layer);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstance || !baseLayer) return;

    mapInstance.removeLayer(baseLayer);

    const tileUrl =
      baseMap === "original"
        ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        : baseMap === "vegetacion"
        ? "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";

    const attribution =
      baseMap === "original"
        ? "© OpenStreetMap"
        : baseMap === "vegetacion"
        ? "Tiles © Esri"
        : "© OpenTopoMap";

    const newLayer = L.tileLayer(tileUrl, { attribution, maxZoom: 14 }).addTo(mapInstance);
    setBaseLayer(newLayer);
  }, [baseMap, mapInstance]);

  const pluvData = useMemo(() => {
    return (reportes || [])
      .filter((r: any) => r.report_regular && r.site && r.site.latitude && r.site.longitude)
      .map((r: any) => ({
        lat: parseFloat(r.site.latitude),
        lng: parseFloat(r.site.longitude),
        valor: Number(r.report_regular.amount) || 0,
        event_id: r.site.event_id,
        nombre: r.site.name || `Sitio ${r.site.id}`,
        fecha: r.date,
        note: r.note,
        unidad: r.report_regular.united_measure?.abbreviation || "mm",
        id: r.id,
      }));
  }, [reportes]);

  const legendUnit = useMemo(() => {
    const currentEvent = events.find((e) => e.id === selectedEventId);
    if (!currentEvent) return "mm";
    const type = currentEvent.type.toLowerCase();
    if (type.includes("caudal")) return `m³/s de ${currentEvent.type}`;
    return `mm de ${currentEvent.type}`;
  }, [selectedEventId, events]);

  const legendColors = useMemo(() => {
    const currentEvent = events.find((e) => e.id === selectedEventId);
    const isCaudal = currentEvent?.type.toLowerCase().includes("caudal");
    return isCaudal
      ? ["#e0f3ff", "#a6d8ff", "#49c5ff", "#1aa3d8", "#0066b3"]
      : ["#00bfff", "#00ff80", "#ffff00", "#ff8000", "#ff0000"];
  }, [selectedEventId, events]);

  useEffect(() => {
    if (!mapInstance || loading || !selectedEventId) return;

    if (heatLayer) mapInstance.removeLayer(heatLayer);
    markers.forEach((m) => mapInstance.removeLayer(m));
    setMarkers([]);

    const filtered = pluvData.filter((d) => d.event_id === selectedEventId);
    if (filtered.length === 0) return;

    const currentZoom = mapInstance.getZoom();
    const baseRadius = 150; // Más grande
    const radius = Math.max(baseRadius / (currentZoom * 0.3), 60); // Radio mínimo más alto

    // Calcular el valor máximo para normalizar
    const valores = filtered.map((d) => d.valor);
    const maxValor = Math.max(...valores);
    const minValor = Math.min(...valores);

    // Normalizar los datos para mejor distribución de colores
    const heatData = filtered.map((d) => {
      const normalizedValue = (d.valor - minValor) / (maxValor - minValor || 1);
      return [d.lat, d.lng, normalizedValue];
    });

    const currentEvent = events.find((e) => e.id === selectedEventId);
    const isCaudal = currentEvent?.type.toLowerCase().includes("caudal");

    const gradient = isCaudal
      ? {
          0.0: "#e0f3ff",
          0.2: "#a6d8ff",
          0.4: "#49c5ff",
          0.6: "#1aa3d8",
          0.8: "#0066b3",
          1.0: "#003d6b",
        }
      : {
          0.0: "#0066ff",
          0.2: "#00ffb3",
          0.4: "#80ff00",
          0.6: "#ffff00",
          0.8: "#ff8000",
          1.0: "#ff0000",
        };

    const newHeat = (L as any).heatLayer(heatData, {
      radius,
      blur: 35, // Mayor difuminación
      minOpacity: 0.45,
      maxOpacity: 0.85, // Reducir opacidad máxima para mejor gradiente
      gradient,
      max: 1.0, // Establecer máximo en 1 ya que normalizamos
    }).addTo(mapInstance);

    setHeatLayer(newHeat);

    const bounds = L.latLngBounds(filtered.map((d) => [d.lat, d.lng]));
    mapInstance.fitBounds(bounds, { padding: [60, 60] });

    const newMarkers = filtered.map((d) => {
      const marker = L.circleMarker([d.lat, d.lng], {
        radius: 12,
        opacity: 0,
        fillOpacity: 0,
      });

      const currentEvent = events.find((e) => e.id === selectedEventId);
      const emoji = currentEvent ? getEventEmoji(currentEvent.type) : "💧";

      const tooltipContent = `
        <div class="tooltip-container">
          <div class="tooltip-header">
            <span class="tooltip-icon">📍</span>
            <span>${d.nombre}</span>
          </div>
          <div class="tooltip-value">
            <span class="tooltip-icon">${emoji}</span>
            <span>${d.valor} ${d.unidad}</span>
          </div>
          <div class="tooltip-date">
            <span class="tooltip-icon">📅</span>
            <span>${d.fecha}</span>
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: "top",
        offset: [0, -15],
        permanent: false,
        className: "custom-leaflet-tooltip",
      });
      marker.addTo(mapInstance);
      return marker;
    });

    setMarkers(newMarkers);
  }, [selectedEventId, mapInstance, loading, pluvData, events]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 flex flex-col">
      <div id="heatmap" className="absolute inset-0 z-0" />

      {/* Botones de tipo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[999]">
        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-lg px-6 py-4 rounded-3xl border border-white/30 shadow-xl">
          {events.map((event, index) => (
            <div key={event.id} className="flex items-center gap-4">
              {index > 0 && <div className="w-px h-8 bg-white/30" />}
              <button
                onClick={() => setSelectedEventId(event.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                  selectedEventId === event.id
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-400/50 scale-105"
                    : "bg-white/40 backdrop-blur-sm text-slate-700 hover:bg-white/60 hover:text-blue-700 shadow-sm border border-white/20"
                }`}
              >
                {getEventIcon(event.type)}
                <span>{event.type}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Selector de mapa base */}
      <div className="absolute top-6 right-6 z-[999]">
        <div className="bg-white/20 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/30 shadow-xl">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3 tracking-wide uppercase">
            <MapPin className="w-4 h-4 text-blue-600" />
            Mapa Base
          </label>
          <select
            value={baseMap}
            onChange={(e) => setBaseMap(e.target.value as "original" | "vegetacion" | "topografia")}
            className="text-sm bg-white/60 backdrop-blur-sm border-2 border-white/40 rounded-xl px-4 py-2.5 font-semibold text-slate-800 cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full [&>option]:bg-white [&>option]:text-slate-800 [&>option]:font-semibold [&>option]:py-2"
          >
            <option value="original">Mapa Estándar</option>
            <option value="vegetacion">Satelital</option>
            <option value="topografia">Topografía + Ríos</option>
          </select>
        </div>
      </div>

      {/* Botón de volver */}
      <div className="absolute top-6 left-6 z-[999]">
        <NavMenu />
      </div>

      {/* Leyenda */}
      <div className="absolute bottom-6 left-20 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-5 border border-white/30 text-xs text-gray-800 z-[1000] min-w-[220px]">
        <div className="font-bold mb-3 text-gray-900 text-sm flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
          Intensidad ({legendUnit})
        </div>
        <div className="flex gap-1 mb-2 rounded-lg overflow-hidden shadow-inner">
          {legendColors.map((c, i) => (
            <div
              key={i}
              className="flex-1 h-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-gray-700 font-semibold mt-2">
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>Bajo</span>
          </span>
          <span className="flex items-center gap-1">
            <span>Alto</span>
            <TrendingUp className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 z-[998] flex justify-center items-center bg-gradient-to-br from-slate-900/30 via-blue-900/20 to-slate-900/30 backdrop-blur-md">
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/90 to-white/70 border-2 border-white/80 p-12 rounded-3xl shadow-2xl flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <div className="mb-6">
              <BeatLoader color="#3b82f6" size={18} />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
              <span className="text-slate-800 font-bold tracking-wide text-lg">Cargando datos meteorológicos</span>
            </div>
            <span className="mt-3 text-slate-500 font-medium text-sm">Preparando tu mapa de calor...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatMapView;
