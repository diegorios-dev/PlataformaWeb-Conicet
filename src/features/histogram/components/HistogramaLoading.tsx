import { Loader2, BarChart3 } from "lucide-react";

export default function HistogramaLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl">
      <div className="relative">
        <BarChart3 className="w-16 h-16 text-slate-300 mb-4" />
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="mt-6 text-slate-700 font-semibold text-lg">Cargando histograma</p>
      <p className="mt-2 text-slate-500 text-sm">Procesando datos temporales...</p>
    </div>
  );
}
