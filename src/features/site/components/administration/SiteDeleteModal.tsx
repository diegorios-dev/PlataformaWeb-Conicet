import { X, Trash2 } from "lucide-react";
import type { Site } from "../../services";

interface SiteDeleteModalProps {
  isOpen: boolean;
  site: Site | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SiteDeleteModal = ({
  isOpen,
  site,
  loading,
  onClose,
  onConfirm,
}: SiteDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-all duration-200 hover:scale-110"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="p-4 rounded-2xl mb-4 bg-red-100">
            <Trash2 size={18} className="text-black-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-red-900">
            Confirmar eliminación
          </h3>
          <p className="text-base mb-6 text-red-700">
            ¿Estás seguro que querés eliminar el sitio <b>{site?.nombre}</b>?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:scale-105"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};