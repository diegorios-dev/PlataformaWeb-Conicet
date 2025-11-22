import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative mb-8">
      <Search 
        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 pointer-events-none" 
        size={20} 
      />
      <input
        type="text"
        placeholder="Buscar por ID, nota o zona..."
        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-200/80 rounded-[16px] 
                 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 focus:bg-white
                 transition-all duration-300 text-slate-700 text-[15px] placeholder:text-slate-400
                 hover:border-slate-300/80 hover:bg-white/80 shadow-sm font-medium"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-all duration-200 group"
        >
          <X size={14} className="text-slate-600 group-hover:text-slate-900" />
        </button>
      )}
    </div>
  );
};