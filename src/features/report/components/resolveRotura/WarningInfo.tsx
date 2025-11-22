import { AlertCircle } from "lucide-react";

export const WarningInfo = () => {
  return (
    <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 shadow-md">
      <div className="flex items-start gap-3">
        <div className="bg-amber-100 p-3 rounded-xl shadow-sm flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h4 className="text-base font-bold text-amber-900 mb-1">Atención</h4>
          <p className="text-sm text-amber-800">
            Al confirmar, el reporte de rotura será eliminado permanentemente
            del sistema. Asegúrate de haber resuelto el problema antes de
            proceder.
          </p>
        </div>
      </div>
    </div>
  );
};