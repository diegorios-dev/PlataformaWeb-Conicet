import { AlertTriangle } from "lucide-react";

interface ReportDamageInfoProps {
  report: any;
}

export const ReportDamageInfo = ({ report }: ReportDamageInfoProps) => {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 mb-6 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-red-100 p-3 rounded-xl shadow-sm flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-900 mb-2">
            Información del Daño Original
          </h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-semibold text-red-800">Fecha:</span>
              <span className="text-red-700">{report.date}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-red-800">Sitio:</span>
              <span className="text-red-700">{report.site?.nombre}</span>
            </div>
            {report.breakage_instrument?.description_damage && (
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-red-800">
                  Descripción del daño:
                </span>
                <p className="text-red-700 bg-red-100/50 p-3 rounded-xl border border-red-200">
                  {report.breakage_instrument.description_damage}
                </p>
              </div>
            )}
            {report.note && (
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-red-800">Nota:</span>
                <p className="text-red-700 italic">{report.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};