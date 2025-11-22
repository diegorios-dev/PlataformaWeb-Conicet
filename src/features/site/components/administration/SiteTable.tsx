import { Pencil, Trash2 } from "lucide-react";
import type { Site } from "../../services/siteService";

interface SiteTableProps {
  sites: Site[];
  onEdit: (site: Site) => void;
  onDelete: (site: Site) => void;
  deleting: boolean;
  deletingId?: number;
}

export const SiteTable = ({
  sites,
  onEdit,
  onDelete,
  deleting,
  deletingId,
}: SiteTableProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-3xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-blue-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Latitud
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Longitud
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Zona
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Evento
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Cota
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {sites.map((sitio) => (
              <tr
                key={sitio.id}
                className="hover:bg-blue-50/50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-900">
                    #{sitio.id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-slate-900">
                    {sitio.nombre}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    {sitio.latitude}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    {sitio.longitude}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
                    {sitio.zona_id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    {sitio.event_id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
                    {sitio.cota || "-"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(sitio)}
                      className="group flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200 transition-all duration-200"
                    >
                      <Pencil
                        size={14}
                        className="transition-transform group-hover:rotate-12"
                      />
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(sitio)}
                      disabled={deleting && deletingId === sitio.id}
                      className="group flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold border border-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting && deletingId === sitio.id ? (
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                        </svg>
                      ) : (
                        <Trash2
                          size={14}
                          className="transition-transform group-hover:scale-110"
                        />
                      )}
                      {deleting && deletingId === sitio.id ? "..." : "Eliminar"}
                    </button>
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