import { AlertCircle, Locate, MapPin, Mountain, Save } from "lucide-react";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";
import type { Site } from "@features/site/services/siteService";
import type { Event } from "@features/event/services";
import type { JSX } from "react";
import ResumenCambios from "./ResumenCambios";

const EditSiteFormPanel = ({
  handleSubmit,
  formData,
  handleChange,
  zonas,
  events,
  getEventIcon,
  cambios,
  submitting,
  onResetChanges
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: Partial<Site>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  zonas: Array<{id: number; locality: string}>;
  events: Event[];
  getEventIcon: (eventId: string) => JSX.Element;
  cambios: Record<string, {anterior: any, nuevo: any}>;
  submitting: boolean;
  onResetChanges?: () => void;
}) => {
  return (
    <div className="w-[480px] h-full overflow-y-auto bg-gradient-to-br from-white/98 to-white/95 backdrop-blur-xl shadow-2xl border-l-2 border-white/80">
      <div className="p-5">
        {/* Header del formulario */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg mb-2">
            <Locate className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Editar Sitio
          </h1>
          <p className="text-xs text-gray-600">
            Modifica la información del sitio de medición
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nombre del Sitio */}
          <div>
            <label className="text-gray-700 text-xs font-bold mb-1.5 flex items-center gap-1.5" htmlFor="nombre">
              <MapPin className="w-4 h-4 text-blue-500" />
              Nombre del Sitio
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej: Pluviómetro Norte, Estación Central..."
              value={formData.nombre || ""}
              onChange={handleChange}
              required
              disabled={submitting}
              className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition disabled:opacity-50"
            />
          </div>

          {/* Cota */}
          <div>
            <label className="text-gray-700 text-xs font-bold mb-1.5 flex items-center gap-1.5" htmlFor="cota">
              <Mountain className="w-4 h-4 text-blue-500" />
              Cota (msnm)
            </label>
            <input
              id="cota"
              type="text"
              placeholder="Ej: 1200, 850, 2100..."
              value={formData.cota || ""}
              onChange={handleChange}
              disabled={submitting}
              className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition disabled:opacity-50"
            />
          </div>

          {/* Zona */}
          <div>
            <label className="text-gray-700 text-xs font-bold mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-500" />
              Zona
            </label>
            <CustomSelect
              options={zonas.map(zona => ({
                value: String(zona.id),
                label: zona.locality,
                icon: <MapPin className="w-4 h-4" />
              }))}
              value={String(formData.zona_id || "")}
              onChange={(value) => handleChange({ target: { id: "zona_id", value } } as any)}
              placeholder="Seleccione una zona"
              icon={<MapPin className="w-4 h-4" />}
              disabled={submitting}
            />
          </div>

          {/* Alert si no hay zonas */}
          {zonas.length === 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-2 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-900 font-bold">
                  No hay zonas disponibles
                </p>
                <p className="text-[10px] text-blue-800">
                  No se puede editar el sitio sin zonas disponibles.
                </p>
              </div>
            </div>
          )}

          {/* Coordenadas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1.5" htmlFor="latitude">
                Latitud
              </label>
              <input
                id="latitude"
                type="number"
                step="any"
                placeholder="Click en el mapa"
                value={formData.latitude || ""}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1.5" htmlFor="longitude">
                Longitud
              </label>
              <input
                id="longitude"
                type="number"
                step="any"
                placeholder="Click en el mapa"
                value={formData.longitude || ""}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition disabled:opacity-50"
              />
            </div>
          </div>

          {/* Tipo de Precipitación */}
          <div>
            <label className="text-gray-700 text-xs font-bold mb-1.5 flex items-center gap-1.5">
              
              Tipo de Evento
            </label>
            <CustomSelect
              options={events.length === 0 ? [] : events.map(event => ({
                value: String(event.id),
                label: event.type,
                icon: getEventIcon(event.type)
              }))}
              value={String(formData.event_id || "")}
              onChange={(value) => handleChange({ target: { id: "event_id", value } } as any)}
              placeholder={events.length === 0 ? "Cargando eventos..." : "Seleccione un tipo de evento"}
              disabled={submitting}
            />
          </div>

          {/* Resumen de Cambios */}
          <div className="pt-2">
            <ResumenCambios cambios={cambios} onResetChanges={onResetChanges} />
          </div>

          {/* Botón Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || Object.keys(cambios).length === 0}
              className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 shadow-lg shadow-blue-300/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </>
              )}
            </button>
            
            {Object.keys(cambios).length === 0 && (
              <p className="text-xs text-center text-gray-500 mt-2">
                Realiza cambios para habilitar el botón de guardar
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSiteFormPanel;
