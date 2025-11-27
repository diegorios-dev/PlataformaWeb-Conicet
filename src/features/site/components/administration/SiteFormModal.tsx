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
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/25 backdrop-blur-md z-50">
      <div className="bg-white rounded-xl border border-blue-100 shadow-2xl max-w-2xl w-full p-0 overflow-hidden animate-fade-in-scale">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 flex items-center gap-3">
          <div className="bg-white/30 rounded-full p-2">
            <MapPin className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-sans">
              {editMode ? "Editar Sitio" : "Registrar Sitio"}
            </h2>
            <p className="text-blue-100 text-xs font-sans">
              {editMode
                ? "Modifica los datos del sitio seleccionado"
                : "Completa la información para registrar un nuevo sitio"}
            </p>
          </div>
          <button
            className="ml-auto bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
            onClick={onClose}
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 font-sans">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                className="text-gray-700 text-xs font-bold mb-1.5 flex items-center gap-2"
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
                disabled={loading}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-gray-700 text-xs font-bold mb-1.5"
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
                  disabled={loading}
                  className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-xs font-bold mb-1.5"
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
                  disabled={loading}
                  className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <label
                className="text-gray-700 text-xs font-bold mb-1.5 flex items-center gap-2"
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
                disabled={loading}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
              />
            </div>

            <div>
              <label
                className="text-gray-700 text-xs font-bold mb-1.5 flex items-center gap-2"
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
                disabled={loading}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
              />
            </div>

            <div>
              <label
                className="text-gray-700 text-xs font-bold mb-1.5 flex items-center gap-2"
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
                disabled={loading}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
              />
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-blue-100 pt-4 flex justify-end gap-3">
              <button
                type="button"
                className="px-5 py-2 bg-white border border-blue-100 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-all duration-200 text-sm"
                onClick={onClose}
              >
                <X size={16} /> Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} /> {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Registrar"}
              </button>
            </div>
          </form>
        </div>

        {/* Spinner overlay al guardar */}
        {loading && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 flex flex-col items-center shadow-2xl">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-base font-semibold text-blue-700">Guardando cambios...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};