import { Navigation, Trash2, MousePointerClick } from "lucide-react";

const SiteMapPanel = ({mapRef,formData,onClearMap} : {mapRef: React.RefObject<HTMLDivElement | null>, formData: {latitude: string, longitude: string}, onClearMap: () => void}) => (
  <div className="flex-1 relative">
    {/* Mapa */}
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
            onClick={onClearMap}
            className="flex items-center justify-center w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition border border-red-200 flex-shrink-0"
            title="Limpiar marcador"
          >
            <Trash2 size={18} className="text-black-500" />
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
);

export default SiteMapPanel;