import { BarChart3, MapPin, ChevronRight, TrendingUp } from "lucide-react";

const icons = {
  "Ver Histograma": <BarChart3 className="w-6 h-6" />,
  "Ver Mapa de Calor": <MapPin className="w-6 h-6" />,
  "Ver Estadísticas": <TrendingUp className="w-6 h-6" />,
};

const ViewComplementMenu = ({ complements }) => {
  return (
    <div className="flex flex-col gap-3">
      {complements.map((item, index) => {
        return (
          <button
            key={index}
            onClick={item.onClick}
            className="group relative flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-lg font-semibold text-gray-700 bg-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white border-2 border-gray-200 hover:border-transparent transition-all duration-200 overflow-hidden hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-blue-500/30"
          >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            {/* Icono */}
            <div className="relative z-10 transition-transform duration-200 group-hover:scale-110">
              {icons[item.option]}
            </div>
            
            {/* Texto */}
            <span className="relative z-10 flex-1 text-left">{item.option}</span>
            
            {/* Flecha indicadora */}
            <div className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ViewComplementMenu;