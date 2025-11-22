import { AlertTriangle, Droplet, Snowflake, Waves } from "lucide-react";

interface ReportCardHeaderProps {
  id: number;
  type: string;
  eventId?: number;
}

export const ReportCardHeader = ({ id, type, eventId }: ReportCardHeaderProps) => {
  const getEventIcon = () => {
    if (eventId === 1) {
      return (
        <div className="bg-blue-100 p-3 rounded-xl shadow-md shadow-blue-500/20">
          <Droplet className="w-6 h-6 text-blue-600" />
        </div>
      );
    }
    if (eventId === 2) {
      return (
        <div className="bg-cyan-100 p-3 rounded-xl shadow-md shadow-cyan-500/20">
          <Snowflake className="w-6 h-6 text-cyan-600" />
        </div>
      );
    }
    if (eventId === 3) {
      return (
        <div className="bg-teal-100 p-3 rounded-xl shadow-md shadow-teal-500/20">
          <Waves className="w-6 h-6 text-teal-600" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 via-blue-50/50 to-slate-50 p-5 border-b-2 border-slate-200 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="bg-blue-600 text-white px-4 py-2 rounded-xl text-base font-bold shadow-lg shadow-blue-600/30">
          #{id}
        </span>
        {type === "regular" && (
          <span className="bg-green-100 text-green-700 border-2 border-green-300 px-3 py-1.5 rounded-lg text-sm font-bold">
            Regular
          </span>
        )}
        {type === "rotura" && (
          <span className="bg-red-100 text-red-700 border-2 border-red-300 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Rotura
          </span>
        )}
      </div>
      {getEventIcon()}
    </div>
  );
};