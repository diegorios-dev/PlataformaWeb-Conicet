import { BarChart3 } from "lucide-react";

export default function HistogramaEmpty({ periodo }) {
  return (
    <div className="text-center py-12">
      <BarChart3 className="w-12 h-12 mx-auto text-slate-400" />
      <h3 className="text-lg font-semibold mt-4 text-slate-700">
        Sin datos disponibles
      </h3>
      <p className="text-slate-500">
        No hay registros para el período seleccionado {periodo}
      </p>
    </div>
  );
}
