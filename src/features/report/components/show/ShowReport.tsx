import { useState, useMemo } from "react";
import useReports from "@hooks/useReports";
import useNavigation from "@hooks/useNavegation";
import { buildAudioUrl, buildImageUrl } from "@shared/utils/urlBuilder";
import { useZonas } from "../../hooks/useZonas";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useImageModal } from "../../hooks/useImageModal";
import { filterByType, filterByPrecipitation, filterByZona, filterBySearch } from "../../utils/reportFilters";

import IconNavMenu from "@features/menu/components/IconNavMenu";
import { ReportHeader } from "./ReportHeader";
import { SearchBar } from "./SearchBar";
import { ReportFilters } from "./ReportFiltersProps";
import { ResultsBadge } from "./ResultsBadge";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <IconNavMenu />
        
        <ReportHeader count={filtered.length} />

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[24px] shadow-2xl shadow-slate-900/5 p-6 md:p-8 mb-6 transition-all duration-300 hover:shadow-slate-900/10">
          <SearchBar value={search} onChange={setSearch} />
          
          <ReportFilters
            filterType={filterType}
            setFilterType={setFilterType}
            filterPrecipitation={filterPrecipitation}
            setFilterPrecipitation={setFilterPrecipitation}
            filterZona={filterZona}
            setFilterZona={setFilterZona}
            zonas={zonas}
          />

          <ResultsBadge count={filtered.length} />
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
    </div>
  );
};

export default ShowReport;