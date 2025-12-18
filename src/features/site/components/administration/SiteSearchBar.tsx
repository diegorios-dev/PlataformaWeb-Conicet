import { memo } from "react";
import { Search, X, Plus } from "lucide-react";

interface SiteSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  resultCount: number;
}

// ✅ OPTIMIZACIÓN: Componente memoizado
export const SiteSearchBar = memo(function SiteSearchBar({
  search,
  onSearchChange,
  onAddClick,
  resultCount,
}: SiteSearchBarProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl p-6 md:p-8 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 text-base group"
        >
          <Plus size={20} className="transition-transform group-hover:rotate-12" />
          Nuevo Sitio
        </button>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, latitud, longitud..."
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-slate-700 text-base placeholder:text-slate-400 font-medium"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-200 hover:bg-slate-300"
              >
                <X size={14} className="text-slate-600" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-slate-200">
        <span className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 bg-blue-50 px-5 py-3 rounded-xl">
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
          {resultCount} {resultCount === 1 ? "sitio" : "sitios"}
        </span>
      </div>
    </div>
  );
});