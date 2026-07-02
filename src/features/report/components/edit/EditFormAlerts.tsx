import { CheckCircle2, AlertCircle } from "lucide-react";

interface AlertsProps {
  success: boolean;
  error: string;
}

export const Alerts = ({ success, error }: AlertsProps) => {
  return (
    <>
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-800">
            ¡Reporte actualizado exitosamente!
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}
    </>
  )
}
