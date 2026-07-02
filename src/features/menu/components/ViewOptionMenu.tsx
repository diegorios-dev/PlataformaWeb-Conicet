import { Droplet, Snowflake, Waves } from "lucide-react";
import { memo } from "react";
import type { ReactElement } from "react";
import type { ViewOptionMenuProps } from "./types/interfaces";

const icons: Record<string, ReactElement> = {
  Lluvia: <Droplet className="w-5 h-5" />,
  Nieve: <Snowflake className="w-5 h-5" />,
  Caudal: <Waves className="w-5 h-5" />,
};

// ⚡ Memorizar componente - Diseño modernizado
const ViewOptionMenu = memo(({ instruments, selectedInstrument, onSelectInstrument }: ViewOptionMenuProps) => {
  return (
    <div className="space-y-2">
      {instruments.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelectInstrument(item.event)}
          className={`group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden
            ${
              selectedInstrument === item.event
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg scale-[1.02]"
                : "bg-white text-slate-800 hover:bg-white border border-slate-300 hover:border-amber-400 hover:shadow-md active:scale-[0.98]"
            }`}
        >
          {/* Efecto de brillo en selección */}
          {selectedInstrument === item.event && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          )}
          
          <span className="relative z-10 flex items-center gap-3">
            <span className={`${selectedInstrument === item.event ? 'text-white' : 'text-amber-700'}`}>
              {icons[item.event] || icons.Lluvia}
            </span>
            <span>{item.instrumento}</span>
          </span>
        </button>
      ))}
    </div>
  );
});

ViewOptionMenu.displayName = 'ViewOptionMenu';

export default ViewOptionMenu;