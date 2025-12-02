import { useState, useMemo } from "react";
import { useReports } from "@features/report/hooks";
import { useNavegation as useNavigation } from "@shared/hooks";
import { buildAudioUrl, buildImageUrl } from "@shared/utils/urlBuilder";
import { useZonas } from "../../hooks/useZonas";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useImageModal } from "../../hooks/useImageModal";
import { filterByType, filterByPrecipitation, filterByZona, filterBySearch, sortByDate } from "../../utils/reportFilters";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";
import type { Report } from "@features/report/types";

import {DashboardLayout} from "@shared/ui/layouts/DashboardLayout/DashboardLayout";
import { ReportHeader } from "./ReportHeader";
import { SearchBar } from "@shared/ui/molecules/SearchBar";
import { ReportFilters } from "./ReportFiltersProps";
import { Badge } from "@shared/ui/atoms/Badge";
import { ReportList } from "./ReportList";
import { ImageModal } from "./ImageModal";
import { EmptyReportsState } from "@shared/ui/Loading";
import { LoadingSpinner, ErrorState } from "@shared/ui/Loading/index";

const ShowReport = () => {
  const { go } = useNavigation();
  const { reports, loading, error } = useReports(); // Sin orden inicial, se ordena en frontend

  // Filtros
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPrecipitation, setFilterPrecipitation] = useState("all");
  const [filterZona, setFilterZona] = useState("all");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Hooks externos
  const zonas = useZonas();
  const { play, stop } = useAudioPlayer();
  const { openModal, open, closeModal, image } = useImageModal();

  const handleEditClick = (reporte: Report) => {
    go.reports.edit(reporte);
    if (reporte.type === "rotura") go.reports.resolveRotura();
  };

  // filtrado y ordenamiento optimizado
  const filtered = useMemo(() => {
    let result = [...reports];
    result = filterByType(result, filterType);
    result = filterByPrecipitation(result, filterPrecipitation);
    result = filterByZona(result, filterZona);
    result = filterBySearch(result, search);
    result = sortByDate(result, sortOrder);
    return result;
  }, [reports, search, filterType, filterPrecipitation, filterZona, sortOrder]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return search !== "" || 
       filterType !== "all" || 
       filterPrecipitation !== "all" || 
       filterZona !== "all";
  }, [search, filterType, filterPrecipitation, filterZona]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearch("");
    setFilterType("all");
    setFilterPrecipitation("all");
    setFilterZona("all");
  };

  return (
   <DashboardLayout contentClassName="">
      {/* Mostrar loading al cargar */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorState 
          error={{ message: error }}
          title="Error al cargar reportes"
          onRetry={() => window.location.reload()}
        />
      ) : (
        <div className="w-full max-w-7xl mx-auto">
          <ReportHeader count={filtered.length} />

        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-900/5 p-5 md:p-6 mb-6 space-y-5">
          {/* Barra de búsqueda */}
          <div>
            <SearchBar 
              value={search} 
              onChange={setSearch} 
              placeholder="Buscar por ID, nota o zona..."
            />
          </div>
          
          {/* Filtros */}
          <ReportFilters
            filterType={filterType}
            setFilterType={setFilterType}
            filterPrecipitation={filterPrecipitation}
            setFilterPrecipitation={setFilterPrecipitation}
            filterZona={filterZona}
            setFilterZona={setFilterZona}
            zonas={zonas}
          />

          {/* Resultados y ordenamiento */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Badge count={filtered.length} />
            
            <div className="space-y-2 min-w-[240px] relative z-50">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <div className="p-1 bg-blue-50 rounded-lg">
                  <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
                </div>
                Ordenar por fecha
              </label>
              <CustomSelect
                options={[
                  { 
                    value: "desc", 
                    label: "Más reciente primero", 
                    icon: <ArrowDown className="w-4 h-4" /> 
                  },
                  { 
                    value: "asc", 
                    label: "Más antiguo primero", 
                    icon: <ArrowUp className="w-4 h-4" /> 
                  }
                ]}
                value={sortOrder}
                onChange={(value) => setSortOrder(value as 'asc' | 'desc')}
                placeholder="Ordenar por fecha"
                icon={<ArrowUpDown className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>

        {/* Mostrar estado vacío si no hay reportes */}
        {filtered.length === 0 ? (
          <EmptyReportsState
            hasFilters={hasActiveFilters}
            onClearFilters={hasActiveFilters ? clearFilters : undefined}
          />
        ) : (
          <ReportList
            reports={filtered}
            onImageClick={openModal}
            onAudioPlay={play}
            onAudioPause={stop}
            onEdit={handleEditClick}
            buildImageUrl={buildImageUrl}
            buildAudioUrl={buildAudioUrl}
          />
        )}

        <ImageModal open={open} image={image} onClose={closeModal} />
        </div>
      )}
    </DashboardLayout>
  );
};

export default ShowReport;