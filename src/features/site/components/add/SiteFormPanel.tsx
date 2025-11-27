import { AlertCircle, CloudRain, Locate, MapPin, Mountain, Save } from "lucide-react";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";
import type { JSX } from "react";

const SiteFormPanel = ({handleSubmit,formData,handleChange,zonas,go,events,getEventIcon} : 
  {handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void, formData: {nombre: string, latitude: string, longitude: string, zona_id: string, event_id: string, cota: string}, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, zonas: {id: string, locality: string}[], go: {zonas: {list: () => void}}, events: {id: string, name: string}[], getEventIcon: (eventId: string) => JSX.Element}) => {
  return (
      <div className="w-[480px] h-full overflow-y-auto bg-gradient-to-br from-white/98 to-white/95 backdrop-blur-xl shadow-2xl border-l-2 border-white/80">
        <div className="p-5">
          {/* Header del formulario - compacto */}
          <div className="mb-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg mb-2">
              <Locate className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Agregar Sitio
            </h1>
            <p className="text-xs text-gray-600">
              Complete la información del nuevo sitio de medición
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
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full py-2 px-3 rounded-lg border-2 border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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
              value={formData.cota}
              onChange={handleChange}
              className="w-full py-2 px-3 rounded-lg border-2 border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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
                  value: zona.id,
                  label: zona.locality,
                  icon: <MapPin className="w-4 h-4" />
                }))}
                value={formData.zona_id}
                onChange={(value) => handleChange({ target: { id: "zona_id", value } } as any)}
                placeholder="Seleccione una zona"
                icon={<MapPin className="w-4 h-4" />}
              />
              <div className="mt-2 flex items-center justify-between bg-blue-50/50 px-3 py-2 rounded-lg">
                <span className="text-[10px] text-gray-600 font-medium">
                  ¿No encuentras la zona?
                </span>
                <button
                  type="button"
                  onClick={go.zonas.list}
                  className="inline-flex items-center gap-1 text-[10px] text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-2 py-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition font-bold"
                >
                  <MapPin className="w-3 h-3" />
                  Crear Nueva Zona
                </button>
              </div>
            </div>

            {/* Alert si no hay zonas */}
            {zonas.length === 0 && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-2 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-yellow-900 font-bold">
                    No hay zonas disponibles
                  </p>
                  <p className="text-[10px] text-yellow-800 mb-1">
                    Primero debes crear una zona para poder agregar sitios.
                  </p>
                  <button
                    type="button"
                    onClick={go.zonas.list}
                    className="text-[10px] text-yellow-800 font-bold underline hover:text-yellow-900"
                  >
                    Ir a crear zona →
                  </button>
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
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 rounded-lg border-2 border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 rounded-lg border-2 border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>
            </div>

            {/* Tipo de Precipitación */}
            <div>
              <label className="text-gray-700 text-xs font-bold mb-1.5 flex items-center gap-1.5">
                {events.length > 0 && formData.event_id ? (
                  getEventIcon(events.find(e => String(e.id) === formData.event_id)?.type || '')
                ) : (
                  <CloudRain className="w-4 h-4 text-blue-500" />
                )}
                Tipo de Evento
              </label>
              <CustomSelect
                options={events.length === 0 ? [] : events.map(event => ({
                  value: event.id,
                  label: event.type,
                  icon: getEventIcon(event.type)
                }))}
                value={formData.event_id}
                onChange={(value) => handleChange({ target: { id: "event_id", value } } as any)}
                placeholder={events.length === 0 ? "Cargando eventos..." : "Seleccione un tipo de evento"}
                icon={<CloudRain className="w-4 h-4" />}
              />
            </div>

            {/* Botón Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 shadow-lg shadow-blue-300/50 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Crear Sitio
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default SiteFormPanel;