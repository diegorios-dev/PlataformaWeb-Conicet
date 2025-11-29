import { FileText, Droplet, Snowflake, AlertTriangle, MapPin, Waves, Filter } from "lucide-react";
import { FilterDropdown } from "@shared/ui/molecules/FilterDropdown";

interface ReportFiltersProps {
  filterType: string;
  setFilterType: (value: string) => void;
  filterPrecipitation: string;
  setFilterPrecipitation: (value: string) => void;
  filterZona: string;
  setFilterZona: (value: string) => void;
  zonas: any[];
}

export const ReportFilters = ({
  filterType,
  setFilterType,
  filterPrecipitation,
  setFilterPrecipitation,
  filterZona,
  setFilterZona,
  zonas,
}: ReportFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Header de filtros */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="p-1.5 bg-blue-50 rounded-lg">
          <Filter className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">Filtros</h3>
      </div>

      {/* Grid de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Filtro: Tipo de Reporte */}
        <FilterDropdown
          label="Tipo de Reporte"
          icon={<FileText className="w-4 h-4 text-blue-600" />}
          value={filterType}
          onChange={(value) => setFilterType(value as string)}
          options={[
            { value: "all", label: "Todos" },
            { value: "regular", label: "Regular", icon: <FileText className="w-4 h-4" /> },
            { value: "rotura", label: "Rotura", icon: <AlertTriangle className="w-4 h-4" /> },
          ]}
        />

        {/* Filtro: Evento */}
        <FilterDropdown
          label="Evento"
          icon={<Droplet className="w-4 h-4 text-blue-600" />}
          value={filterPrecipitation}
          onChange={(value) => setFilterPrecipitation(value as string)}
          options={[
            { value: "all", label: "Todos" },
            { value: "lluvia", label: "Lluvia", icon: <Droplet className="w-4 h-4" /> },
            { value: "nieve", label: "Nieve", icon: <Snowflake className="w-4 h-4" /> },
            { value: "caudal", label: "Caudal", icon: <Waves className="w-4 h-4" /> },
          ]}
        />

        {/* Filtro: Zona */}
        <FilterDropdown
          label="Zona"
          icon={<MapPin className="w-4 h-4 text-blue-600" />}
          value={filterZona}
          onChange={setFilterZona}
          options={[
            { value: "all", label: "Todas las zonas" },
            ...zonas.map((zona) => ({
              value: zona.id.toString(),
              label: zona.locality,
              icon: <MapPin className="w-4 h-4" />,
            })),
          ]}
        />
      </div>
    </div>
  );
};