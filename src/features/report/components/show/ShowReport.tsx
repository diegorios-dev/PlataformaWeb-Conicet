import { useState, useMemo, useCallback } from "react";
import { useReports } from "@features/report/hooks";
import { useNavegation as useNavigation } from "@shared/hooks";
import { buildAudioUrl, buildImageUrl } from "@shared/utils/urlBuilder";
import { useZonas } from "../../hooks/useZonas";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useImageModal } from "../../hooks/useImageModal";
import { filterByType, filterByPrecipitation, filterByZona, filterBySearch } from "../../utils/reportFilters";
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
import { PaginationControls } from "./PaginationControls";

const ShowReport = () => {
  const { go } = useNavigation();
  const { 
    reports, 
    loading, 
    error, 
    pagination, 
    currentParams,
    goToPage, 
    changePerPage, 
    changeOrder 
  } = useReports();

  // Filtros (ahora solo para filtrado en el cliente)
  // ⚠️ NOTA: Estos filtros se aplican DESPUÉS de la paginación del backend
  // Para mejor UX, considera moverlos al backend
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPrecipitation, setFilterPrecipitation] = useState<"all" | "lluvia" | "nieve" | "caudal">("all");
  const [filterZona, setFilterZona] = useState("all");

  // Hooks externos
  const zonas = useZonas();
  const { play, stop } = useAudioPlayer();
  const { openModal, open, closeModal, image } = useImageModal();

  // ✅ OPTIMIZACIÓN: Memoizar handleEditClick
  const handleEditClick = useCallback((reporte: Report) => {
    go.reports.edit(reporte);
    if (reporte.type === "rotura") go.reports.resolveRotura();
  }, [go.reports]);

  // ✅ OPTIMIZACIÓN: Memoizar funciones de URL builders
  const memoizedBuildImageUrl = useCallback(buildImageUrl, []);
  const memoizedBuildAudioUrl = useCallback(buildAudioUrl, []);

  // filtrado optimizado (sin sorting, se hace en backend)
  const filtered = useMemo(() => {
    let result = [...reports];
    result = filterByType(result, filterType);
    result = filterByPrecipitation(result, filterPrecipitation);
    result = filterByZona(result, filterZona);
    result = filterBySearch(result, search);
    return result;
  }, [reports, search, filterType, filterPrecipitation, filterZona]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return search !== "" || 
       filterType !== "all" || 
       filterPrecipitation !== "all" || 
       filterZona !== "all";
  }, [search, filterType, filterPrecipitation, filterZona]);

  // ✅ OPTIMIZACIÓN: Función para limpiar filtros + resetear página
  const clearFilters = useCallback(() => {
    setSearch("");
    setFilterType("all");
    setFilterPrecipitation("all");
    setFilterZona("all");
    goToPage(1); // Resetear a página 1
  }, [goToPage]);

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
            <Badge count={pagination?.total || filtered.length} />
            
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
                value={currentParams.order || 'desc'}
                onChange={(value) => changeOrder(value as 'asc' | 'desc')}
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
          <>
            <ReportList
              reports={filtered}
              onImageClick={openModal}
              onAudioPlay={play}
              onAudioPause={stop}
              onEdit={handleEditClick}
              buildImageUrl={memoizedBuildImageUrl}
              buildAudioUrl={memoizedBuildAudioUrl}
            />

            {/* Pagination controls */}
            {pagination && (
              <div className="mt-6">
                <PaginationControls
                  currentPage={pagination.current_page}
                  lastPage={pagination.last_page}
                  total={pagination.total}
                  perPage={pagination.per_page}
                  from={pagination.from}
                  to={pagination.to}
                  onPageChange={goToPage}
                  onPerPageChange={changePerPage}
                />
              </div>
            )}
          </>
        )}

        <ImageModal open={open} image={image} onClose={closeModal} />
        </div>
      )}
    </DashboardLayout>
  );
};

export default ShowReport;