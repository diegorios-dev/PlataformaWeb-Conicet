import { memo, useEffect, useRef } from "react";
import { X, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number | string;
  longitude: number | string;
  siteName: string;
}

// ✅ OPTIMIZACIÓN: Componente memoizado y en archivo separado
export const MapModal = memo(function MapModal({ 
  isOpen, 
  onClose, 
  latitude, 
  longitude, 
  siteName 
}: MapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!isOpen || !mapRef.current) return;
    
    // Evitar doble inicialización
    if (mapInstanceRef.current) return;

    const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
    const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;

    // ✅ OPTIMIZACIÓN: requestAnimationFrame en vez de setTimeout
    const rafId = requestAnimationFrame(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const customIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            width: 48px;
            height: 48px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 5px solid white;
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 16px;
              height: 16px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 48]
      });

      L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .openPopup();

      mapInstanceRef.current = map;
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, latitude, longitude, siteName]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-slate-900/60 backdrop-blur-md" />
      
      <div 
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-8 py-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full translate-y-24 -translate-x-24 blur-2xl" />
          
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg shadow-blue-900/30 border border-white/30">
                <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{siteName}</h3>
                  <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/30">
                    Ubicación
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="text-xs font-medium text-blue-100 uppercase tracking-wide">Latitud</span>
                    </div>
                    <p className="text-base font-bold text-white font-mono">
                      {typeof latitude === 'string' ? parseFloat(latitude).toFixed(6) : latitude.toFixed(6)}
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                      <span className="text-xs font-medium text-blue-100 uppercase tracking-wide">Longitud</span>
                    </div>
                    <p className="text-base font-bold text-white font-mono">
                      {typeof longitude === 'string' ? parseFloat(longitude).toFixed(6) : longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="relative bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-white/20 group"
              title="Cerrar"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 z-10" />
          <div ref={mapRef} style={{ height: '550px', width: '100%' }} className="relative z-0" />
        </div>
      </div>
    </div>
  );
});
