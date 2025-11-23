import { useState, useEffect, useRef } from "react";
import { postNewSite } from "@features/site/services";
import { getAllZonas } from "@features/zona/services";
import { getAllEvents, type Event } from "@features/event/services";
import useNavegation from "@hooks/useNavegation";
import BackButton from "@shared/ui/buttons/BackButton";
import Toast from "@shared/ui/Loading/Toast";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  CloudRain,
  Snowflake,
  Activity,
} from "lucide-react";
import SiteFormPanel from "./SiteFormPanel";
import SiteMapPanel from "./SiteMapPanel";

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
  
  const { go } = useNavegation();

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
        go.back();
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
      <SiteMapPanel mapRef={mapRef} formData={formData} onClearMap={handleClearMap} />

      {/* Panel lateral derecho - Formulario */}
      <SiteFormPanel handleSubmit={handleSubmit} formData={formData} handleChange={handleChange} zonas={zonas} go={go} events={events} getEventIcon={getEventIcon} />

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