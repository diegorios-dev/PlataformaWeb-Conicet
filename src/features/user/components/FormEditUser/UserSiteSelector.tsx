import { MapPin, Locate } from "lucide-react";
import type { UserType, Zona, Site } from "../../types";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";

interface UserSiteSelectorProps {
  user: UserType;
  sitios: Site[];
  zonaSeleccionada: Zona | null;
  onZonaChange: (zona: Zona | null) => void;
  onUserChange: (user: UserType) => void;
  disabled?: boolean;
}

export const UserSiteSelector = ({
  user,
  sitios,
  zonaSeleccionada,
  onZonaChange,
  onUserChange,
  disabled = false
}: UserSiteSelectorProps) => {
  const handleSiteChange = (siteId: number) => {
    const sitio = sitios.find((s) => s.id === siteId);
    if (!sitio) return;
    
    // La zona se actualiza automáticamente según el sitio
    const zona = sitio.zona || null;
    onZonaChange(zona);
    onUserChange({ 
      ...user, 
      site_id: siteId, 
      site: sitio,
      zona_id: zona?.id,
      zona: zona || undefined
    });
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-4 border border-green-50">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="text-green-500" size={16} />
        <h3 className="font-semibold text-base">Ubicación y Sitio</h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="font-semibold text-xs mb-1 block text-gray-600">
            Sitio
          </label>
          <CustomSelect
            options={sitios.map((s) => ({
              value: String(s.id),
              label: s.nombre || "Sin nombre",
              subtitle: `${s.zona?.locality || "Sin zona"} - Lat: ${s.latitude}, Lon: ${s.longitude}`,
              icon: <MapPin className="w-4 h-4" />
            }))}
            value={String(user.site_id || "")}
            onChange={(value) => handleSiteChange(parseInt(String(value)))}
            placeholder="Seleccionar sitio"
            icon={<Locate className="w-5 h-5" />}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="font-semibold text-xs mb-1 block text-gray-600">
            Zona (automática)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-50 border border-green-100 rounded-lg text-gray-700 font-sans text-sm cursor-not-allowed"
            value={zonaSeleccionada?.locality || "No asignada"}
            disabled
            readOnly
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-gray-50 border border-gray-200 rounded-md p-2 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">Latitud</span>
          <span className="font-bold text-gray-900 text-xs">
            {user.site?.latitude || 'N/A'}
          </span>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-2 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">Longitud</span>
          <span className="font-bold text-gray-900 text-xs">
            {user.site?.longitude || 'N/A'}
          </span>
        </div>
      </div>
    </section>
  );
};
