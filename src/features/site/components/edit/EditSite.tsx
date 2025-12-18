import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSiteById, updateSite, type Site } from "@features/site/services";
import { getAllZonas } from "@features/zone/services";
import { getAllEvents, type Event } from "@features/event/services";
import Toast from "@shared/ui/Loading/Toast";
import BackButton from "@shared/ui/buttons/BackButton";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  CloudRain,
  Snowflake,
  Activity,
  Loader2,
} from "lucide-react";
import EditSiteFormPanel from "./EditSiteFormPanel";
import EditSiteMapPanel from "./EditSiteMapPanel";

const EditSite = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Site>>({
    nombre: "",
    latitude: 0,
    longitude: 0,
    zona_id: "",
    event_id: "",
    cota: ""
  });
  
  const [datosOriginales, setDatosOriginales] = useState<Site | null>(null);
  const [cambios, setCambios] = useState<Record<string, {anterior: any, nuevo: any}>>({});
  const [zonas, setZonas] = useState<Array<{id: number; locality: string}>>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Helper para obtener el icono según el tipo de evento
  const getEventIcon = (eventType: string) => {
    const type = eventType.toLowerCase();
    if (type.includes('nieve')) {
      return <Snowflake className="w-4 h-4" />;
    } else if (type.includes('caudal')) {
      return <Activity className="w-4 h-4" />;
    } else {
      return <CloudRain className="w-4 h-4" />;
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setToastType("error");
        setToastMessage("ID de sitio no válido");
        setToastOpen(true);
        setTimeout(() => navigate("/dashboard/site"), 2000);
        return;
      }

      try {
        setLoading(true);
        const [siteData, zonasData, eventsData] = await Promise.all([
          getSiteById(parseInt(id)),
          getAllZonas(),
          getAllEvents()
        ]);

        // Guardar datos originales
        setDatosOriginales(siteData);
        
        // Prellenar formulario
        setFormData({
          nombre: siteData.nombre,
          latitude: siteData.latitude,
          longitude: siteData.longitude,
          zona_id: siteData.zona_id,
          event_id: siteData.event_id,
          cota: siteData.cota || ""
        });

        setZonas(zonasData);
        setEvents(eventsData);
      } catch (error: unknown) {
        const err = error as {message?: string};
        setToastType("error");
        setToastMessage(err.message || "Error al cargar el sitio");
        setToastOpen(true);
        setTimeout(() => navigate("/dashboard/site"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || loading) return;

    const map = L.map(mapRef.current, {
      zoomControl: false
    }).setView([formData.latitude || -38.95, formData.longitude || -68.06], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Evento de click en el mapa
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      setFormData(prev => ({
        ...prev,
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6))
      }));

      // Remover marcador anterior
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
  }, [loading]);

  // Posicionar marcador inicial cuando se cargan los datos
  useEffect(() => {
    if (!mapInstanceRef.current || !datosOriginales || loading) return;

    const lat = datosOriginales.latitude;
    const lng = datosOriginales.longitude;

    // Crear marcador inicial
    const initialMarker = L.marker([lat, lng], {
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

    markerRef.current = initialMarker;
    mapInstanceRef.current.setView([lat, lng], 12);
  }, [datosOriginales, loading]);

  // Actualizar marcador cuando se cambian las coordenadas manualmente
  useEffect(() => {
    if (!mapInstanceRef.current || loading) return;
    if (!formData.latitude || !formData.longitude) return;

    const lat = Number(formData.latitude);
    const lng = Number(formData.longitude);

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
    mapInstanceRef.current.setView([lat, lng], 12);
  }, [formData.latitude, formData.longitude, loading]);

  // Detectar cambios
  useEffect(() => {
    if (!datosOriginales) return;

    const cambiosDetectados: Record<string, {anterior: any, nuevo: any}> = {};

    if (formData.nombre !== datosOriginales.nombre) {
      cambiosDetectados.nombre = { 
        anterior: datosOriginales.nombre, 
        nuevo: formData.nombre 
      };
    }
    
    if (Number(formData.latitude) !== Number(datosOriginales.latitude)) {
      cambiosDetectados.latitud = { 
        anterior: datosOriginales.latitude, 
        nuevo: formData.latitude 
      };
    }
    
    if (Number(formData.longitude) !== Number(datosOriginales.longitude)) {
      cambiosDetectados.longitud = { 
        anterior: datosOriginales.longitude, 
        nuevo: formData.longitude 
      };
    }
    
    if (String(formData.zona_id) !== String(datosOriginales.zona_id)) {
      const zonaAnterior = zonas.find(z => String(z.id) === String(datosOriginales.zona_id))?.locality || datosOriginales.zona_id;
      const zonaNueva = zonas.find(z => String(z.id) === String(formData.zona_id))?.locality || formData.zona_id;
      cambiosDetectados.zona = { 
        anterior: zonaAnterior, 
        nuevo: zonaNueva 
      };
    }
    
    if (String(formData.event_id) !== String(datosOriginales.event_id)) {
      const eventoAnterior = events.find(e => String(e.id) === String(datosOriginales.event_id))?.type || datosOriginales.event_id;
      const eventoNuevo = events.find(e => String(e.id) === String(formData.event_id))?.type || formData.event_id;
      cambiosDetectados.evento = { 
        anterior: eventoAnterior, 
        nuevo: eventoNuevo 
      };
    }
    
    if (String(formData.cota || "") !== String(datosOriginales.cota || "")) {
      cambiosDetectados.cota = { 
        anterior: datosOriginales.cota || "Sin especificar", 
        nuevo: formData.cota || "Sin especificar" 
      };
    }

    setCambios(cambiosDetectados);
  }, [formData, datosOriginales, zonas, events]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleClearMap = () => {
    setFormData(prev => ({
      ...prev,
      latitude: 0,
      longitude: 0
    }));

    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  const handleResetChanges = () => {
    if (!datosOriginales) return;
    
    setFormData({
      nombre: datosOriginales.nombre,
      latitude: datosOriginales.latitude,
      longitude: datosOriginales.longitude,
      zona_id: datosOriginales.zona_id,
      event_id: datosOriginales.event_id,
      cota: datosOriginales.cota || ""
    });

    // Reposicionar marcador en el mapa
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    if (datosOriginales.latitude && datosOriginales.longitude && mapInstanceRef.current) {
      const newMarker = L.marker([datosOriginales.latitude, datosOriginales.longitude], {
        icon: L.divIcon({
          className: '',
          html: `
            <div style="
              background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
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
      mapInstanceRef.current.setView([datosOriginales.latitude, datosOriginales.longitude], 12);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!id) return;

    try {
      setSubmitting(true);
      await updateSite(parseInt(id), formData);
      setToastType("success");
      setToastMessage("Sitio actualizado exitosamente");
      setToastOpen(true);
      setTimeout(() => {
        navigate("/dashboard/sitios");
      }, 2000);
    } catch (error: any) {
      setSubmitting(false);
      
      // Detectar error de validación (422 Unprocessable Content)
      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors || error?.response?.data?.message;
        const errorMsg = typeof validationErrors === 'string' 
          ? validationErrors 
          : 'Error de validación. Verifica los datos ingresados.';
        setToastType("error");
        setToastMessage(errorMsg);
        setToastOpen(true);
        return;
      }
      
      // Error genérico
      const err = error as {message?: string};
      setToastType("error");
      setToastMessage(err.message || "Error al actualizar el sitio");
      setToastOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Cargando datos del sitio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      <div className="absolute top-4 left-4 z-[1000]">
        <BackButton onClick={() => navigate("/dashboard/site")} />
      </div>

      {/* Mapa - Ocupa toda la pantalla */}
      <EditSiteMapPanel mapRef={mapRef} formData={formData} onClearMap={handleClearMap} />

      {/* Panel lateral derecho - Formulario */}
      <EditSiteFormPanel 
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        zonas={zonas}
        events={events}
        getEventIcon={getEventIcon}
        cambios={cambios}
        submitting={submitting}
        onResetChanges={handleResetChanges}
      />

      <Toast
        isOpen={toastOpen}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export default EditSite;
