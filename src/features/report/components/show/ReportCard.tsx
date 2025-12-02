import { ReportCardHeader } from "./ReportCardHeader";
import { ReportCardInfo } from "./ReportCardInfo";
import { ReportCardImage } from "./ReportCardImage";
import { ReportCardAudio } from "./ReportCardAudio";
import { ReportCardSamples } from "./ReportCardSamples";
import { ReportCardLocation } from "./ReportCardLocation";
import { ReportCardActions } from "./ReportCardActions";
import type { Report } from "@features/report/types";
import { ReportCardUser } from "./ReportCardUser";

interface ReportCardProps {
  reporte: Report;
  onImageClick: (url: string) => void;
  onAudioPlay: (id: number) => void;
  onAudioPause: () => void;
  onEdit: (reporte: Report) => void;
  buildImageUrl: (path: string) => string;
  buildAudioUrl: (path: string) => string;
}

export const ReportCard = ({
  reporte,
  onImageClick,
  onAudioPlay,
  onAudioPause,
  onEdit,
  buildImageUrl,
  buildAudioUrl,
}: ReportCardProps) => {
  return (
    <div className="group bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-3xl overflow-hidden hover:scale-[1.005] transition-all duration-300 flex flex-col">
      <ReportCardHeader 
        id={reporte.id} 
        type={reporte.type} 
        eventId={reporte.site?.event_id} 
      />

      <div className="p-6 flex flex-col flex-1 gap-4">
     
        
        <div className="flex gap-4">
          <ReportCardInfo
            date={reporte.date}
            note={reporte.note}
            amount={reporte.report_regular?.amount}
            unitAbbreviation={reporte.report_regular?.united_measure?.abbreviation}
          />
          <ReportCardImage
            imageUrl={reporte.image ? buildImageUrl(reporte.image) : undefined}
            onImageClick={() => reporte.image && onImageClick(buildImageUrl(reporte.image))}
          />
        </div>

        {reporte.audio && (
          <ReportCardAudio
            audioUrl={buildAudioUrl(reporte.audio)}
            onPlay={() => onAudioPlay(reporte.id)}
            onPause={onAudioPause}
          />
        )}

        {reporte.report_regular && (
          <ReportCardSamples
            sampleChemical={reporte.report_regular.sample_chemical}
            sampleIsotopo={reporte.report_regular.sample_isotopo}
            sampleLevel={reporte.report_regular.sample_level}
          />
        )}

        <ReportCardLocation
          siteName={reporte.site.nombre}
          locality={reporte.site.zona?.locality}
          latitude={reporte.site.latitude}
          longitude={reporte.site.longitude}
        />
        <ReportCardUser userName={reporte.user?.name} />

        <ReportCardActions
          type={reporte.type}
          onClick={() => onEdit(reporte)}
        />
      </div>
    </div>
  );
};