import { FileText } from "lucide-react";

interface ReportHeaderProps {
  count: number;
}

export const ReportHeader = ({ count }: ReportHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Reportes
          </h1>
          <p className="text-base text-slate-600 mt-1 font-medium">
            {count} {count === 1 ? "reporte encontrado" : "reportes encontrados"}
          </p>
        </div>
      </div>
    </div>
  );
};