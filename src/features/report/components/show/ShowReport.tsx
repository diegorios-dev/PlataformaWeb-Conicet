import { useState, useMemo } from "react";
import useReports from "@hooks/useReports";
import useNavigation from "@hooks/useNavegation";
import { buildAudioUrl, buildImageUrl } from "@shared/utils/urlBuilder";
import { useZonas } from "../../hooks/useZonas";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useImageModal } from "../../hooks/useImageModal";
import { filterByType, filterByPrecipitation, filterByZona, filterBySearch } from "../../utils/reportFilters";

import {DashboardLayout} from "@shared/ui/layouts/DashboardLayout/DashboardLayout";
import IconNavMenu from "@features/menu/components/IconNavMenu";
import { ReportHeader } from "./ReportHeader";
import { SearchBar } from "@shared/ui/molecules/SearchBar";
import { ReportFilters } from "./ReportFiltersProps";
import { Badge } from "@shared/ui/atoms/Badge";
import { ReportList } from "./ReportList";
import { ImageModal } from "./ImageModal";

const ShowReport = () => {
  const { go } = useNavigation();
  const reports = useReports();

  // Filtros
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPrecipitation, setFilterPrecipitation] = useState("all");
  const [filterZona, setFilterZona] = useState("all");

  // Hooks externos
  const zonas = useZonas();
  const { play, stop } = useAudioPlayer();
  const { openModal, open, closeModal, image } = useImageModal();

  const handleEditClick = (reporte: any) => {
    go.reports.edit(reporte);
    if (reporte.type === "rotura") go.reports.resolveRotura();
  };

  // 🧠 filtrado optimizado
  const filtered = useMemo(() => {
    let result = [...reports];
    result = filterByType(result, filterType);
    result = filterByPrecipitation(result, filterPrecipitation);
    result = filterByZona(result, filterZona);
    result = filterBySearch(result, search);
    return result;
  }, [reports, search, filterType, filterPrecipitation, filterZona]);

  return (
   <DashboardLayout contentClassName="">
      <div className="w-full max-w-7xl mx-auto">
        <IconNavMenu />
        
        <ReportHeader count={filtered.length} />

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[24px] shadow-2xl shadow-slate-900/5 p-6 md:p-8 mb-6 transition-all duration-300 hover:shadow-slate-900/10 relative z-50">
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

          <Badge count={filtered.length} />
        </div>

        <ReportList
          reports={filtered}
          onImageClick={openModal}
          onAudioPlay={play}
          onAudioPause={stop}
          onEdit={handleEditClick}
          buildImageUrl={buildImageUrl}
          buildAudioUrl={buildAudioUrl}
        />
      </div>

      <ImageModal open={open} image={image} onClose={closeModal} />
    </DashboardLayout>
  );
};

export default ShowReport;