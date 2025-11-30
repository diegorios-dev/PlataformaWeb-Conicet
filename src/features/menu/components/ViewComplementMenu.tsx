import { BarChart3, MapPin, ChevronRight } from "lucide-react";
import { memo } from "react";

const icons = {
  "Ver Histograma": <BarChart3 className="w-5 h-5" />,
  "Ver Mapa de Calor": <MapPin className="w-5 h-5" />
};

// ⚡ Memorizar componente - Diseño modernizado
const ViewComplementMenu = memo(({ complements }) => {
  return (
    <div className="space-y-2">
      {complements.map((item, index) => {
        return (
          <button
            key={index}
            onClick={item.onClick}
            className="group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white border border-slate-200 hover:border-transparent transition-all duration-200 overflow-hidden hover:shadow-md active:scale-[0.98]"
          >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            {/* Icono */}
            <div className="relative z-10 text-blue-600 group-hover:text-white transition-colors duration-200">
              {icons[item.option] || <BarChart3 className="w-5 h-5" />}
            </div>
            
            {/* Texto */}
            <span className="relative z-10 flex-1 text-left">{item.option}</span>
            
            {/* Flecha indicadora */}
            <div className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </div>
          </button>
        );
      })}
    </div>
  );
});

ViewComplementMenu.displayName = 'ViewComplementMenu';

export default ViewComplementMenu;