import { Loader2 } from "lucide-react";

export default function HistogramaLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="mt-4 text-slate-600 font-medium">Cargando datos...</p>
    </div>
  );
}
