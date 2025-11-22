import { MapPin, Plus } from "lucide-react";

interface SiteEmptyStateProps {
  onAddClick: () => void;
}

export const SiteEmptyState = ({ onAddClick }: SiteEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl">
      <div className="bg-slate-100 rounded-full p-6 mb-4 shadow-lg shadow-slate-500/10">
        <MapPin className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-700 mb-2">
        No hay sitios registrados
      </h3>
      <p className="text-base text-slate-500 mb-6">
        Agregá tu primer sitio para comenzar
      </p>
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 text-base"
      >
        <Plus size={20} />
        Agregar Sitio
      </button>
    </div>
  );
};