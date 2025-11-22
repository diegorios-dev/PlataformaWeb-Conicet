import { ChevronRight } from "lucide-react";

import { colorSchemes } from "../config/ColorSchemes";
import type {DashboardButtonProps} from "../types/dashboard";

export default function DashboardButton({
  onClick,
  icon: Icon,
  title,
  description,
  colorScheme,
}: DashboardButtonProps) {

  const colors = colorSchemes[colorScheme];

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br ${colors.bgGradient} border ${colors.border} rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-2xl ${colors.shadow} hover:scale-[1.03] active:scale-[0.98] transform`}
    >
      {/* Efecto de brillo mejorado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Efecto de resplandor interno */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 to-transparent" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icono con gradiente y efecto 3D */}
          <div className={`p-3.5 md:p-4 rounded-xl ${colors.iconBg} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}>
            <Icon className={`w-6 h-6 md:w-7 md:h-7 ${colors.iconColor} transition-all`} />
          </div>
          
          <div className="text-left">
            <h3 className={`text-base md:text-lg font-bold ${colors.title} transition-colors mb-1`}>
              {title}
            </h3>
            <p className={`text-xs md:text-sm ${colors.description} transition-colors font-medium`}>
              {description}
            </p>
          </div>
        </div>
        
        {/* Chevron con animación */}
        <ChevronRight 
          className={`w-6 h-6 md:w-7 md:h-7 ${colors.chevron} group-hover:translate-x-2 transition-all duration-300`} 
        />
      </div>
    </button>
  );
}