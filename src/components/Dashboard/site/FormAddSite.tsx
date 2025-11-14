import { useState, useEffect, useRef } from "react";
import { postNewSite } from "../../../services/sitiosService";
import { getAllZonas } from "../../../services/zonaService";
import { getAllEvents, type Event } from "../../../services/eventService";
import useNavegation from "../../../hooks/useNavegation";
import BackButton from "../../BackButton";
import Toast from "../../ui/Toast";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Locate,
  MapPin,
  CloudRain,
  Snowflake,
  Activity,
  Save,
  AlertCircle,
  MousePointerClick,
  Trash2,
  Navigation,
  Mountain
} from "lucide-react";

const FormAddSite = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    latitude: "",
    longitude: "",
    zona_id: "",
    event_id: "1",
    cota: ""
  });
  
  const [zonas, setZonas] = useState([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  
  const { goBack, goAddZona } = useNavegation();

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current) return;
    const defaultLat = -38.95;
    const defaultLng = -68.06;

    // Crear mapa
    const map = L.map(mapRef.current, {
      zoomControl: false
    }).setView([defaultLat, defaultLng], 8);

    // Agregar capa de tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Evento de click en el mapa
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      
      // Actualizar formulario
      setFormData(prev => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6)
      }));

      // Remover marcador anterior si existe
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Crear nuevo marcador
      const newMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background: linear-gradient(135deg, #3b82f6, #2563eb);
              width: 40px;
              height: 40px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 4px solid white;
              box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 14px;
                height: 14px;
                background-color: white;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        })
      }).addTo(map);

      markerRef.current = newMarker;
    });

    // Cleanup
    return () => {
      map.remove();
    };
  }, []);

  // Actualizar marcador cuando se cambian las coordenadas manualmente
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (!formData.latitude || !formData.longitude) return;

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    // Remover marcador anterior
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    // Crear nuevo marcador
    const newMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 4px solid white;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 14px;
              height: 14px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      })
    }).addTo(mapInstanceRef.current);

    markerRef.current = newMarker;

    // Centrar mapa en el marcador
    mapInstanceRef.current.setView([lat, lng], 12);
  }, [formData.latitude, formData.longitude]);

  // Cargar zonas y eventos al montar el componente
  useEffect(() => {
    fetchZonas();
    fetchEvents();
  }, []);

  const fetchZonas = async () => {
    try {
      const data = await getAllZonas();
      setZonas(data);
    } catch (error) {
      console.error("Error al cargar zonas:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
      // Establecer el primer evento como default si existe
      if (data.length > 0) {
        setFormData(prev => ({
          ...prev,
          event_id: String(data[0].id)
        }));
      }
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  // Helper para obtener el icono según el tipo de evento
  const getEventIcon = (eventType: string) => {
    const type = eventType.toLowerCase();
    if (type.includes('nieve')) {
      return <Snowflake className="w-5 h-5 text-blue-500" />;
    } else if (type.includes('caudal')) {
      return <Activity className="w-5 h-5 text-blue-500" />;
    } else {
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleClearMap = () => {
    // Limpiar coordenadas del formulario
    setFormData(prev => ({
      ...prev,
      latitude: "",
      longitude: ""
    }));

    // Remover marcador del mapa
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await postNewSite(formData);
      setToastType("success");
      setToastMessage("Sitio creado exitosamente");
      setToastOpen(true);
      setTimeout(() => {
        goBack();
      }, 2000);
    } catch (error) {
      console.error("Error al crear sitio:", error);
      setToastType("error");
      setToastMessage("Error al crear sitio. Por favor intenta nuevamente.");
      setToastOpen(true);
    }
  };

  return (
    <div className="relative w-full h-screen flex overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50">
      {/* Botón de volver - Posición absoluta sobre el mapa */}
      <div className="absolute top-6 left-6 z-[1000]">
        <BackButton />
      </div>

      {/* Mapa - Ocupa toda la pantalla */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Indicador de coordenadas sobre el mapa */}
        {formData.latitude && formData.longitude && (
          <div className="absolute bottom-6 left-6 z-[999] bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-2 border-white/60 rounded-2xl shadow-2xl p-4 max-w-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-600 flex items-center gap-2 mb-2">
                  <Navigation className="w-4 h-4" />
                  Coordenadas Seleccionadas
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Lat:</span> {formData.latitude}
                  </p>
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Lon:</span> {formData.longitude}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearMap}
                className="flex items-center justify-center w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition border border-red-200 flex-shrink-0"
                title="Limpiar marcador"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Instrucciones sobre el mapa */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[999] bg-gradient-to-br from-blue-500/95 to-blue-600/95 backdrop-blur-xl border-2 border-blue-400/50 rounded-2xl shadow-2xl px-6 py-3">
          <p className="text-white font-bold text-sm flex items-center gap-2">
            <MousePointerClick className="w-5 h-5" />
            Haga click en el mapa para seleccionar la ubicación del sitio
          </p>
        </div>
      </div>

      {/* Panel lateral derecho - Formulario */}
      <div className="w-[480px] h-full overflow-y-auto bg-gradient-to-br from-white/98 to-white/95 backdrop-blur-xl shadow-2xl border-l-2 border-white/80">
        <div className="p-8">
          {/* Header del formulario */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
              <Locate className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Agregar Sitio
            </h1>
            <p className="text-sm text-gray-600">
              Complete la información del nuevo sitio de medición
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del Sitio */}
            <div>
              <label className="text-gray-700 text-sm font-bold mb-3 flex items-center gap-2" htmlFor="nombre">
                <MapPin className="w-5 h-5 text-blue-500" />
                Nombre del Sitio
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Pluviómetro Norte, Estación Central..."
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full py-3.5 px-5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium"
              />
            </div>

            {/* Cota */}
            <div>
              <label className="text-gray-700 text-sm font-bold mb-3 flex items-center gap-2" htmlFor="cota">
              <Mountain className="w-5 h-5 text-blue-500" />
              Cota (msnm)
              </label>
              <input
              id="cota"
              type="text"
              placeholder="Ej: 1200, 850, 2100..."
              value={formData.cota}
              onChange={handleChange}
              className="w-full py-3.5 px-5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium"
              />
            </div>

            {/* Zona */}
            <div>
              <label className="text-gray-700 text-sm font-bold mb-3 flex items-center gap-2" htmlFor="zona_id">
                <MapPin className="w-5 h-5 text-blue-500" />
                Zona
              </label>
              <select
                id="zona_id"
                value={formData.zona_id}
                onChange={handleChange}
                required
                className="w-full py-3.5 px-5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium"
              >
                <option value="">Seleccione una zona</option>
                {zonas.map(zona => (
                  <option key={zona.id} value={zona.id}>
                    {zona.locality}
                  </option>
                ))}
              </select>
              <div className="mt-3 flex items-center justify-between bg-blue-50/50 px-4 py-3 rounded-xl">
                <span className="text-xs text-gray-600 font-medium">
                  ¿No encuentras la zona?
                </span>
                <button
                  type="button"
                  onClick={goAddZona}
                  className="inline-flex items-center gap-2 text-xs text-blue-600 bg-white border-2 border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition font-bold"
                >
                  <MapPin className="w-4 h-4" />
                  Crear Nueva Zona
                </button>
              </div>
            </div>

            {/* Alert si no hay zonas */}
            {zonas.length === 0 && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900 font-bold mb-1">
                    No hay zonas disponibles
                  </p>
                  <p className="text-xs text-yellow-800 mb-3">
                    Primero debes crear una zona para poder agregar sitios.
                  </p>
                  <button
                    type="button"
                    onClick={goAddZona}
                    className="text-xs text-yellow-800 font-bold underline hover:text-yellow-900"
                  >
                    Ir a crear zona →
                  </button>
                </div>
              </div>
            )}

            {/* Coordenadas */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="latitude">
                  Latitud
                </label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="Click en el mapa o ingrese manualmente"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  className="w-full py-3.5 px-5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="longitude">
                  Longitud
                </label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="Click en el mapa o ingrese manualmente"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  className="w-full py-3.5 px-5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium"
                />
              </div>
            </div>

            {/* Tipo de Precipitación */}
            <div>
              <label className="text-gray-700 text-sm font-bold mb-3 flex items-center gap-2" htmlFor="event_id">
                {events.length > 0 && formData.event_id ? (
                  getEventIcon(events.find(e => String(e.id) === formData.event_id)?.type || '')
                ) : (
                  <CloudRain className="w-5 h-5 text-blue-500" />
                )}
                Tipo de Evento
              </label>
              <select
                id="event_id"
                value={formData.event_id}
                onChange={handleChange}
                required
                className="w-full py-3.5 px-5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium"
              >
                {events.length === 0 ? (
                  <option value="">Cargando eventos...</option>
                ) : (
                  events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.type}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Botón Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 shadow-lg shadow-blue-300/50 flex items-center justify-center gap-3 text-lg"
              >
                <Save className="w-6 h-6" />
                Crear Sitio
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toast
        isOpen={toastOpen}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export default FormAddSite;