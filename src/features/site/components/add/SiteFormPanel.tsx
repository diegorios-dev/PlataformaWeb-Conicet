import { AlertCircle, CloudRain, Locate, MapPin, Mountain, Save } from "lucide-react";
import type { JSX } from "react";

const SiteFormPanel = ({handleSubmit,formData,handleChange,zonas,go,events,getEventIcon} : 
  {handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void, formData: {nombre: string, latitude: string, longitude: string, zona_id: string, event_id: string, cota: string}, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, zonas: {id: string, locality: string}[], go: {zonas: {list: () => void}}, events: {id: string, name: string}[], getEventIcon: (eventId: string) => JSX.Element}) => {
  return (
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
                  onClick={go.zonas.list}
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
                    onClick={go.zonas.list}
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
  );
};

export default SiteFormPanel;