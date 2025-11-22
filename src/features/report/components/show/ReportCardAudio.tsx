import { Mic } from "lucide-react";

interface ReportCardAudioProps {
  audioUrl: string;
  onPlay: () => void;
  onPause: () => void;
}

export const ReportCardAudio = ({ audioUrl, onPlay, onPause }: ReportCardAudioProps) => {
  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-slate-200 p-2 rounded-xl shadow-sm">
          <Mic className="w-5 h-5 text-slate-600" />
        </div>
        <span className="text-base font-bold text-slate-800">Audio del Reporte</span>
      </div>
      <audio
        controls
        className="w-full h-10 rounded-xl"
        onPlay={onPlay}
        onPause={onPause}
      >
        <source src={audioUrl} type="audio/mpeg" />
        <source src={audioUrl} type="audio/wav" />
        <source src={audioUrl} type="audio/ogg" />
        <source src={audioUrl} type="audio/mp4" />
        Tu navegador no soporta el elemento de audio.
      </audio>
    </div>
  );
};