import { useState, useMemo } from "react";
import { useReports } from "@features/report/hooks";
import { useNavegation as useNavigation } from "@shared/hooks";
import { buildAudioUrl, buildImageUrl } from "@shared/utils/urlBuilder";
import { useZonas } from "../../hooks/useZonas";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useImageModal } from "../../hooks/useImageModal";
import { filterByType, filterByPrecipitation, filterByZona, filterBySearch, sortByDate } from "../../utils/reportFilters";
import { ArrowUpDown } from "lucide-react";

import {DashboardLayout} from "@shared/ui/layouts/DashboardLayout/DashboardLayout";
import { ReportHeader } from "./ReportHeader";
import { SearchBar } from "@shared/ui/molecules/SearchBar";
import { ReportFilters } from "./ReportFiltersProps";
import { Badge } from "@shared/ui/atoms/Badge";
import { ReportList } from "./ReportList";
import { ImageModal } from "./ImageModal";
import { EmptyReportsState } from "@shared/ui/Loading";

const ShowReport = () => {
  const { go } = useNavigation();
  const reports = useReports({ order: 'desc' });

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

  const handleEditClick = (reporte: any) => {
    go.reports.edit(reporte);
    if (reporte.type === "rotura") go.reports.resolveRotura();
  };

  // 🧠 filtrado y ordenamiento optimizado
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
      <div className="w-full max-w-7xl mx-auto">
        <ReportHeader count={filtered.length} />

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[24px] shadow-2xl shadow-slate-900/5 p-6 md:p-8 mb-6 transition-all duration-300 hover:shadow-slate-900/10 relative">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Buscar por ID, nota o zona..."
          />
          
          <ReportFilters
            filterType={filterType}
            setFilterType={setFilterType}
            filterPrecipitation={filterPrecipitation}
            setFilterPrecipitation={setFilterPrecipitation}
            filterZona={filterZona}
            setFilterZona={setFilterZona}
            zonas={zonas}
          />

          <div className="flex items-center justify-between mt-7">
            <Badge count={filtered.length} />
            
            <div className="space-y-3.5">
              <label className="flex items-center gap-2.5 text-[13px] font-bold text-slate-700 uppercase tracking-[0.08em] px-0.5">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <ArrowUpDown className="w-4 h-4 text-blue-600" />
                </div>
                Ordenar por fecha
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-5 py-3.5 rounded-[14px] font-semibold text-[15px] transition-all duration-300 shadow-sm active:scale-[0.98] bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md border border-slate-200/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Más antiguo primero</option>
                <option value="desc">Más reciente primero</option>
              </select>
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
      </div>

      <ImageModal open={open} image={image} onClose={closeModal} />
    </DashboardLayout>
  );
};

export default ShowReport;