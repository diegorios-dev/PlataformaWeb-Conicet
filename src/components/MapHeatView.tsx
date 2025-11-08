import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import BackButton from "./BackButton";
import { getReportes } from "../services/reportService";
import { BeatLoader } from "react-spinners";
import { Droplet, Snowflake } from "lucide-react";

const HeatMapView = () => {
  const [selectedTipo, setSelectedTipo] = useState("lluvia");
  const [mapInstance, setMapInstance] = useState(null);
  const [heatLayer, setHeatLayer] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);

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

  useEffect(() => {
    const map = L.map("heatmap", {
      scrollWheelZoom: true,
      zoomControl: false,
    }).setView([-41.13, -71.31], 8);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    setMapInstance(map);
    return () => map.remove();
  }, []);

  // mapear datos (memo para evitar remaps innecesarios)
  const pluvData = useMemo(() => {
    return (reportes || [])
      .filter((r) => r.report_regular && r.site && r.site.latitude && r.site.longitude)
      .map((r) => ({
        lat: parseFloat(r.site.latitude),
        lng: parseFloat(r.site.longitude),
        valor: Number(r.report_regular.amount) || 0,
        tipo: r.site.event_id === 2 ? "nieve" : "lluvia",
        nombre: r.site.name || `Sitio ${r.site.id}`,
        fecha: r.date,
        note: r.note,
        unidad: r.report_regular.united_measure?.abbreviation || "mm",
        id: r.id,
      }));
  }, [reportes]);

  useEffect(() => {
    if (!mapInstance || loading) return;

    if (heatLayer) mapInstance.removeLayer(heatLayer);
    markers.forEach((m) => mapInstance.removeLayer(m));
    setMarkers([]);

    const filtered = pluvData.filter((d) => d.tipo === selectedTipo);
    if (filtered.length === 0) return;

    const valores = filtered.map((d) => d.valor);
    const minValor = Math.min(...valores);
    const maxValor = Math.max(...valores);

    // Escala logarítmica para normalizar valores
    const logMin = Math.log10(minValor + 1);
    const logMax = Math.log10(maxValor + 1);

    const heatData = filtered.map((d) => {
      const logValor = Math.log10(d.valor + 1);
      const normalized = (logValor - logMin) / (logMax - logMin || 1);
      const weight = Math.max(0.05, normalized); // evita invisibilidad total
      return [d.lat, d.lng, weight];
    });

    const newHeat = L.heatLayer(heatData, {
      radius: 30,
      blur: 18,
      minOpacity: 0.25,
      maxOpacity: 0.85,
      gradient: {
        0.0: "#0066ff", // azul frío = poca lluvia/nieve
        0.25: "#00ffb3", // verde agua
        0.5: "#ffff00", // amarillo
        0.75: "#ff8000", // naranja
        1.0: "#ff0000", // rojo intenso = mucha lluvia/nieve
      },
    }).addTo(mapInstance);

    setHeatLayer(newHeat);

    // Centrar mapa en la zona de puntos
    const bounds = L.latLngBounds(filtered.map((d) => [d.lat, d.lng]));
    mapInstance.fitBounds(bounds, { padding: [60, 60] });

    // Tooltips
    const newMarkers = filtered.map((d) => {
      const marker = L.circleMarker([d.lat, d.lng], {
        radius: 10,
        opacity: 0,
        fillOpacity: 0,
      });

      const tooltipHTML = `
        <div class="rounded-xl shadow-lg bg-white/90 backdrop-blur-md p-3 text-[11px] text-gray-700 font-sans">
          <div class="font-semibold text-gray-900 text-sm mb-1">${d.nombre}</div>
          <div class="flex items-center gap-2 mb-1">
            ${selectedTipo === "lluvia" ? "💧" : "❄️"}
            <span><b>${d.valor} ${d.unidad}</b></span>
          </div>
          <div class="flex items-center gap-2 mb-1">
            📅 <span>${d.fecha}</span>
          </div>
          ${
            d.note
              ? `<div class="border-t mt-1 pt-1 text-[10px] text-gray-600">
                  📝 ${d.note}
                </div>`
              : ""
          }
        </div>
      `;
      marker.bindTooltip(tooltipHTML, {
        direction: "top",
        offset: [0, -10],
        permanent: false,
        className: "custom-tooltip",
      });
      marker.addTo(mapInstance);
      return marker;
    });

    setMarkers(newMarkers);
  }, [selectedTipo, mapInstance, loading, pluvData.length]);


  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      <div id="heatmap" className="absolute inset-0 z-0" />

      {/* Panel superior centrado */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[999]">
        <div className="flex items-center gap-6 bg-white/40 backdrop-blur-md px-8 py-3 rounded-3xl border border-white/50 shadow-lg shadow-blue-100">
          <button
            onClick={() => setSelectedTipo("lluvia")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all ${
              selectedTipo === "lluvia"
                ? "bg-blue-500/30 text-blue-900 border border-blue-400 shadow-blue-300/50"
                : "bg-white/40 text-slate-700 hover:bg-blue-100/40"
            }`}
          >
            <Droplet className="w-5 h-5" />
            Lluvia
          </button>

          <button
            onClick={() => setSelectedTipo("nieve")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all ${
              selectedTipo === "nieve"
                ? "bg-cyan-400/30 text-cyan-900 border border-cyan-300 shadow-cyan-300/50"
                : "bg-white/40 text-slate-700 hover:bg-cyan-100/40"
            }`}
          >
            <Snowflake className="w-5 h-5" />
            Nieve
          </button>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-[999]">
        <BackButton />
      </div>

      {/* Leyenda */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-4 border border-gray-200 text-xs text-gray-700 z-[1000]">
        <div className="font-semibold mb-2 text-gray-800">
          Intensidad ({selectedTipo === "lluvia" ? "mm de lluvia" : "mm de nieve"})
        </div>
        <div className="flex gap-1 mb-1">
          {["#00bfff", "#00ff80", "#ffff00", "#ff8000", "#ff0000"].map((c, i) => (
            <div key={i} className="w-6 h-3 rounded-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>Bajo</span>
          <span>Alto</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 z-[998] flex justify-center items-center bg-slate-900/20 backdrop-blur-sm">
          <div className="backdrop-blur-2xl bg-white/60 border border-white/80 p-10 rounded-3xl shadow-2xl flex flex-col items-center">
            <BeatLoader color="#3b82f6" size={15} />
            <span className="mt-6 text-slate-700 font-medium tracking-wide">
              Cargando datos meteorológicos...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatMapView;
