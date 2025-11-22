import { MapPin } from "lucide-react";

interface ReportCardLocationProps {
  siteName?: string;
  locality: string;
  latitude: number;
  longitude: number;
}

export const ReportCardLocation = ({ siteName, locality, latitude, longitude }: ReportCardLocationProps) => {
  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 shadow-md mt-auto">
      <div className="flex items-start gap-3 mb-2">
        <MapPin className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex flex-col">
          {siteName && (
            <span className="text-base font-bold text-slate-800">{siteName}</span>
          )}
          <span className="text-base font-semibold text-slate-700">{locality}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
        <div>
          <span className="font-medium">Lat:</span> <span className="font-mono">{latitude}</span>
        </div>
        <div>
          <span className="font-medium">Lng:</span> <span className="font-mono">{longitude}</span>
        </div>
      </div>
    </div>
  );
};