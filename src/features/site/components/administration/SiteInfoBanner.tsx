import { AlertCircle } from "lucide-react";

export const SiteInfoBanner = () => {
  return (
    <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 shadow-md">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 p-3 rounded-xl shadow-sm flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h4 className="text-base font-bold text-blue-900 mb-1">
            Gestión de Sitios
          </h4>
          <p className="text-sm text-blue-800">
            Administra los sitios del sistema. Cada sitio representa una
            ubicación de medición y puede estar asociado a una zona y evento.
            Utiliza las acciones para editar o eliminar sitios según corresponda.
          </p>
        </div>
      </div>
    </div>
  );
};