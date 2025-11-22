import { X, Save, MapPin } from "lucide-react";
import type { Site } from "../../services/siteService";

interface SiteFormModalProps {
  isOpen: boolean;
  editMode: boolean;
  formData: Partial<Site>;
  loading: boolean;
  onClose: () => void;
  onChange: (field: keyof Site, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SiteFormModal = ({
  isOpen,
  editMode,
  formData,
  loading,
  onClose,
  onChange,
  onSubmit,
}: SiteFormModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2">
      <div className="relative bg-gradient-to-br from-blue-50/90 to-white/95 rounded-2xl shadow-2xl p-4 max-w-sm w-full transform transition-all duration-300 border border-blue-200">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-slate-100 hover:bg-slate-200 text-slate-600 p-1.5 rounded-xl transition-all duration-200 hover:scale-110"
        >
          <X size={18} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg mb-2">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-1 text-blue-900 tracking-tight">
            {editMode ? "Editar Sitio" : "Registrar Sitio"}
          </h3>
          <p className="text-sm text-blue-700 mb-3 font-medium">
            {editMode
              ? "Modifica los datos del sitio seleccionado"
              : "Completa la información para registrar un nuevo sitio"}
          </p>
          <form onSubmit={onSubmit} className="space-y-4 w-full mt-1">
            <div>
              <label
                className="text-gray-700 text-xs font-bold mb-1 flex items-center gap-2"
                htmlFor="nombre"
              >
                <MapPin className="w-4 h-4 text-blue-500" />
                Nombre del Sitio
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Pluviómetro Norte, Estación Central..."
                value={formData.nombre || ""}
                onChange={(e) => onChange("nombre", e.target.value)}
                required
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  className="block text-gray-700 text-xs font-bold mb-1"
                  htmlFor="latitude"
                >
                  Latitud
                </label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="Latitud"
                  value={formData.latitude || ""}
                  onChange={(e) => onChange("latitude", parseFloat(e.target.value))}
                  required
                  className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-xs font-bold mb-1"
                  htmlFor="longitude"
                >
                  Longitud
                </label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="Longitud"
                  value={formData.longitude || ""}
                  onChange={(e) => onChange("longitude", parseFloat(e.target.value))}
                  required
                  className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
                />
              </div>
            </div>
            <div>
              <label
                className="text-gray-700 text-xs font-bold mb-1 flex items-center gap-2"
                htmlFor="zona_id"
              >
                Zona
              </label>
              <input
                id="zona_id"
                type="text"
                placeholder="ID de zona"
                value={formData.zona_id || ""}
                onChange={(e) => onChange("zona_id", e.target.value)}
                required
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
              />
            </div>
            <div>
              <label
                className="text-gray-700 text-xs font-bold mb-1 flex items-center gap-2"
                htmlFor="event_id"
              >
                Evento
              </label>
              <input
                id="event_id"
                type="text"
                placeholder="ID de evento"
                value={formData.event_id || ""}
                onChange={(e) => onChange("event_id", e.target.value)}
                required
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
              />
            </div>
            <div>
              <label
                className="text-gray-700 text-xs font-bold mb-1 flex items-center gap-2"
                htmlFor="cota"
              >
                Cota (msnm)
              </label>
              <input
                id="cota"
                type="text"
                placeholder="Ej: 1200, 850, 2100..."
                value={formData.cota || ""}
                onChange={(e) => onChange("cota", e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all transform hover:scale-105 shadow-lg shadow-blue-300/50 flex items-center justify-center gap-2 text-base mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />{" "}
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Registrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};