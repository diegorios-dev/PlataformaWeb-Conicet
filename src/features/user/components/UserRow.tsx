import { memo } from "react";
import { User, Shield, Key, MapPin, Map, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import type { UserType } from "@features/user/types/user.types";

interface UserRowProps {
  user: UserType;
  isPasswordVisible: boolean;
  isDeleting: boolean;
  onTogglePassword: (userId: number) => void;
  onEdit: (option: string, user: UserType) => void;
  onDelete: (option: string, user: UserType) => void;
  onViewMap: (latitude: string, longitude: string, siteName: string) => void;
}

// ✅ OPTIMIZACIÓN: Componente de fila memoizado para evitar re-renders innecesarios
export const UserRow = memo(function UserRow({
  user,
  isPasswordVisible,
  isDeleting,
  onTogglePassword,
  onEdit,
  onDelete,
  onViewMap,
}: UserRowProps) {
  return (
    <tr
      key={user.id}
      className="hover:bg-slate-50/70 transition-colors duration-150"
    >
      <td className="px-4 py-5 whitespace-nowrap text-center">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200">
          {user.id}
        </span>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2.5 rounded-lg border border-blue-200">
            <User size={18} className="text-blue-700" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              {user.name}
            </span>
            {user.site?.nombre && (
              <span className="text-xs text-slate-500 font-medium">
                {user.site.nombre}
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-5 whitespace-nowrap text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            user.rol === "admin"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-green-50 text-green-700 border-green-200"
          }`}
        >
          <Shield size={13} />
          {user.rol}
        </span>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="relative group inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 text-slate-700 text-xs font-mono border border-slate-200 min-w-[140px]">
            <Key size={13} className="text-slate-400" />
            {isPasswordVisible ? user.password : '••••••••'}
          </span>
          <button
            onClick={() => onTogglePassword(user.id)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-slate-100 rounded-lg flex-shrink-0 border border-transparent hover:border-slate-200"
            title={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {isPasswordVisible ? (
              <EyeOff size={15} className="text-slate-600" />
            ) : (
              <Eye size={15} className="text-slate-600" />
            )}
          </button>
        </div>
      </td>
      <td className="px-4 py-5 whitespace-nowrap text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
            <MapPin size={13} />
            {user.zona?.locality || 'N/A'}
          </span>
          {user.site?.latitude && user.site?.longitude && (
            <button
              onClick={() => user.site && onViewMap(
                String(user.site.latitude), 
                String(user.site.longitude),
                user.site.nombre || "Ubicación"
              )}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold hover:scale-105 transition-all duration-200"
              title="Ver ubicación en el mapa"
            >
              <Map size={12} />
              Mapa
            </button>
          )}
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit("editar", user)}
            className="group flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200 hover:border-amber-300 transition-all duration-200"
          >
            <Pencil size={14} className="transition-transform group-hover:rotate-12" />
            Editar
          </button>
          <button
            onClick={() => onDelete("eliminar", user)}
            disabled={isDeleting}
            className="group flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={18} className="text-black-500" />
            )}
            {isDeleting ? "..." : "Eliminar"}
          </button>
        </div>
      </td>
    </tr>
  );
});