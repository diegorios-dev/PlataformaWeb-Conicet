import { useEffect, useState } from "react";
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
        console.log("Datos completos de API:", data);

        data.forEach((report, index) => {
          console.log(`Reporte ${index}:`, {
            id: report.id,
            type: report.type,
            hasRegular: !!report.report_regular,
            hasSite: !!report.site,
            precipitation: report.precipitation,
            site: report.site,
            regular: report.report_regular,
          });
        });

        setReportes(data);
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const map = L.map("heatmap").setView([-41.13, -71.31], 8);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    setMapInstance(map);

    return () => map.remove();
  }, []);

  const pluvData = reportes
    .filter((report) => {
      const hasRegular = report.report_regular;
      const hasSite = report.site;
      const hasCoords = hasSite && report.site.latitude && report.site.longitude;
      const hasPrecipitation = report.precipitation;

      if (!hasRegular || !hasCoords || !hasPrecipitation) {
        console.log("Reporte filtrado:", {
          id: report.id,
          hasRegular,
          hasSite,
          hasCoords,
          hasPrecipitation,
          precipitation: report.precipitation,
          site: report.site,
        });
      }

      return hasRegular && hasCoords && hasPrecipitation;
    })
    .map((report) => ({
      lat: parseFloat(report.site.latitude),
      lng: parseFloat(report.site.longitude),
      valor: parseFloat(report.report_regular.amount),
      // Cambiado: ahora usa el tipo de precipitación
      tipo: report.precipitation.type || "lluvia",
      nombre: report.site.name || "Sin nombre",
      fecha: report.date,
      note: report.note,
      unidad: report.report_regular.united_measure?.abbreviation || "mm",
      reportId: report.id,
    }));

  console.log("Datos mapeados para el mapa:", pluvData);

  useEffect(() => {
    if (!mapInstance || loading) return;

    console.log("pluvData.length:", pluvData.length);
    console.log("selectedTipo:", selectedTipo);

    if (heatLayer) {
      mapInstance.removeLayer(heatLayer);
    }

    markers.forEach((marker) => mapInstance.removeLayer(marker));
    setMarkers([]);

    if (pluvData.length === 0) {
      console.log("No hay datos procesados del API");
      return;
    }

    // Filtrar por tipo de precipitación (lluvia/nieve)
    const filteredData = pluvData.filter((d) => d.tipo === selectedTipo);

    console.log("Datos filtrados:", filteredData);

    if (filteredData.length === 0) {
      console.log(`No hay datos para el tipo: ${selectedTipo}`);
      return;
    }

    const maxValor = Math.max(...filteredData.map((d) => d.valor));
    const heatData = filteredData.map((d) => [d.lat, d.lng, d.valor / maxValor]);

    const newHeat = L.heatLayer(heatData, {
      radius: 30,
      blur: 20,
      maxZoom: 10,
      minOpacity: 0.6,
      gradient:
        selectedTipo === "lluvia"
          ? {
              0.0: "#ffffff",
              0.2: "#66b3ff",
              0.4: "#0080ff",
              0.6: "#0052a3",
              0.8: "#002952",
              1.0: "#000d1a",
            }
          : {
              0.0: "#e0f2fe",
              0.25: "#7dd3fc",
              0.5: "#38bdf8",
              0.75: "#0284c7",
              1.0: "#0c4a6e",
            },
    }).addTo(mapInstance);

    setHeatLayer(newHeat);

    if (filteredData.length > 0) {
      const bounds = L.latLngBounds(filteredData.map((d) => [d.lat, d.lng]));
      mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }

    const newMarkers = filteredData.map((d) => {
      const circle = L.circleMarker([d.lat, d.lng], {
        radius: 15,
        opacity: 0,
        fillOpacity: 0,
      });

      const tooltipContent = `
        <div class="font-sans text-sm bg-white rounded-lg shadow-lg p-3 min-w-[200px] border border-gray-200">
          <div class="flex items-center gap-2 mb-2 font-bold text-gray-800 text-base">
            <span>${d.nombre}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600 text-xs mb-1">
            <span>📍</span>
            <span>Lat: ${d.lat.toFixed(4)} | Lng: ${d.lng.toFixed(4)}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600 mb-1">
            <span>${selectedTipo === "lluvia" ? "🌧️" : "❄️"}</span>
            <span>
              ${selectedTipo === "lluvia" ? "Lluvia" : "Nieve"}: <b class="text-blue-700">${
        d.valor
      } ${d.unidad}</b>
            </span>
          </div>
          <div class="flex items-center gap-2 text-gray-600 text-xs mb-1">
            <span>🗓️</span>
            <span>Fecha: ${d.fecha}</span>
          </div>
          ${
            d.note
              ? `<div class="flex items-start gap-2 text-gray-600 text-xs mt-2 pt-2 border-t border-gray-200">
                  <span>📝</span>
                  <span class="flex-1">${d.note}</span>
                </div>`
              : ""
          }
        </div>
      `;

      circle.bindTooltip(tooltipContent, {
        direction: "top",
        offset: [0, -10],
        permanent: false,
        opacity: 0.95,
        sticky: true,
        className: "",
      });

      circle.addTo(mapInstance);
      return circle;
    });

    setMarkers(newMarkers);
  }, [selectedTipo, mapInstance, loading, pluvData.length]);

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col m-10">
      <div className="m-2">
        <BackButton />
      </div>

      {/* Filtros */}
      <div className="absolute top-6 z-[1000] flex gap-4 mt-20 p-20">
        <button
          onClick={() => setSelectedTipo("lluvia")}
          className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
            selectedTipo === "lluvia"
              ? "bg-blue-700 scale-105"
              : "bg-blue-400 hover:bg-blue-500"
          }`}
        >
          <Droplet className="w-6 h-6 inline-block" /> Lluvia
        </button>

        <button
          onClick={() => setSelectedTipo("nieve")}
          className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
            selectedTipo === "nieve"
              ? "bg-cyan-700 scale-105"
              : "bg-cyan-400 hover:bg-cyan-500"
          }`}
        >
          <Snowflake className="w-6 h-6 inline-block" /> Nieve
        </button>
      </div>

      {/* Indicador de carga */}
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] p-6 rounded-xl shadow-lg">
          <BeatLoader color="#3b82f6" size={15} />
        </div>
      )}

      {/* Mensaje si no hay datos */}
      {!loading && pluvData.filter((d) => d.tipo === selectedTipo).length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white p-6 rounded-xl shadow-lg">
          <p className="text-lg font-bold text-gray-700">
            No hay datos de {selectedTipo} disponibles
          </p>
        </div>
      )}

      <div className="relative rounded-2xl shadow-2xl w-[70vw] max-w-[1400px] h-[70vh] flex flex-col">
        <div id="heatmap" className="flex-1 rounded-3xl w-full h-full" />
      </div>
    </div>
  );
};

export default HeatMapView;