import { Search } from "lucide-react";
import { EmptyState } from "../../../../shared/ui/Loading/LoadingState";
import { ReportCard } from "./ReportCard";

interface ReportListProps {
  reports: any[];
  onImageClick: (url: string) => void;
  onAudioPlay: (id: number) => void;
  onAudioPause: () => void;
  onEdit: (reporte: any) => void;
  buildImageUrl: (path: string) => string;
  buildAudioUrl: (path: string) => string;
}

export const ReportList = ({
  reports,
  onImageClick,
  onAudioPlay,
  onAudioPause,
  onEdit,
  buildImageUrl,
  buildAudioUrl,
}: ReportListProps) => {
  if (reports.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No se encontraron reportes"
        description="Intenta ajustar los filtros o la búsqueda"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {reports.map((reporte) => (
        <ReportCard
          key={reporte.id}
          reporte={reporte}
          onImageClick={onImageClick}
          onAudioPlay={onAudioPlay}
          onAudioPause={onAudioPause}
          onEdit={onEdit}
          buildImageUrl={buildImageUrl}
          buildAudioUrl={buildAudioUrl}
        />
      ))}
    </div>
  );
};