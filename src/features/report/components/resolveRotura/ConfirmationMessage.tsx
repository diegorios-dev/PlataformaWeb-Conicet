import { AlertTriangle } from "lucide-react";

export const ConfirmationMessage = () => {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg shadow-green-500/30">
          <AlertTriangle className="w-16 h-16 text-white" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        ¿Confirmar eliminación de rotura?
      </h2>
      <p className="text-lg text-slate-600 mb-2">
        Esta acción eliminará permanentemente el reporte de rotura.
      </p>
      <p className="text-base text-slate-500">
        Esta operación no se puede deshacer.
      </p>
    </div>
  );
};