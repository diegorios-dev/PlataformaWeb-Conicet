import { FileText } from "lucide-react";

interface HistogramaHeaderProps {
  title: string;
  unidad: string;
}

export default function HistogramaHeader({ title, unidad }: HistogramaHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 ">
        <FileText className="w-8 h-8 text-white" />
      </div>

      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Distribuciones y valores en {unidad}
        </p>
      </div>
    </div>
  );
}
