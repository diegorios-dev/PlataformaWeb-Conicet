import { AlertCircle, RotateCcw, Check  } from "lucide-react";

interface ResumenCambiosProps {
  cambios: Record<string, {anterior: any, nuevo: any}>;
  onResetChanges?: () => void;
}

const ResumenCambios = ({ cambios, onResetChanges }: ResumenCambiosProps) => {
  const hayCambios = Object.keys(cambios).length > 0;

  if (!hayCambios) {
    return (
      <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <p className="text-xs text-slate-500 font-medium">
            No hay cambios pendientes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-semibold text-slate-700">
            Cambios pendientes ({Object.keys(cambios).length})
          </h3>
        </div>
        {onResetChanges && (
          <button
            type="button"
            onClick={onResetChanges}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            title="Deshacer todos los cambios"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reestablecer
          </button>
        )}
      </div>
      
      <div className="overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2 px-2 font-semibold text-slate-600 capitalize">Campo</th>
              <th className="text-left py-2 px-2 font-semibold text-slate-600">Previo</th>
              <th className="text-left py-2 px-2 font-semibold text-slate-600">Nuevo</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(cambios).map(([campo, valores]) => (
              <tr key={campo} className="border-b border-slate-50 last:border-0">
                <td className="py-2 px-2 font-medium text-slate-700 capitalize">
                  {campo}
                </td>
                <td className="py-2 px-2 text-slate-500 bg-slate-50/50">
                  {String(valores.anterior)}
                </td>
                <td className="py-2 px-2 text-slate-700 font-medium bg-blue-100">
                    <div className="flex items-center justify-between">
                        <span>{String(valores.nuevo)}</span>
                        <Check className="text-green-500 w-3.5 h-3.5" />
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResumenCambios;
