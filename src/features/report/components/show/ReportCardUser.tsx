import { User } from "lucide-react";

interface ReportCardUserProps {
  userName?: string;
}

export const ReportCardUser = ({ userName }: ReportCardUserProps) => {
  if (!userName) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
      <div className="p-1.5 bg-white rounded-lg shadow-sm">
        <User className="w-3.5 h-3.5 text-indigo-600" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-medium text-indigo-600/70 uppercase tracking-wide">
          Creado por
        </span>
        <span className="text-sm font-semibold text-slate-700 leading-tight">
          {userName}
        </span>
      </div>
    </div>
  );
};
