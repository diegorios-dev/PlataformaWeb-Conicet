import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DashboardButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  colorScheme: "blue" | "indigo" | "violet" | "green" | "emerald" | "cyan" | "slate";
}

const colorSchemes = {
  blue: {
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    bgGradient: "from-blue-50/80 to-blue-100/80 hover:from-blue-100 hover:to-blue-200",
    border: "border-blue-200/60 hover:border-blue-300",
    shadow: "hover:shadow-blue-500/20",
    iconColor: "text-white",
    title: "text-slate-800",
    description: "text-slate-600",
    chevron: "text-blue-400",
  },
  indigo: {
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    bgGradient: "from-indigo-50/80 to-indigo-100/80 hover:from-indigo-100 hover:to-indigo-200",
    border: "border-indigo-200/60 hover:border-indigo-300",
    shadow: "hover:shadow-indigo-500/20",
    iconColor: "text-white",
    title: "text-slate-800",
    description: "text-slate-600",
    chevron: "text-indigo-400",
  },
  violet: {
    iconBg: "bg-gradient-to-br from-violet-500 to-violet-600",
    bgGradient: "from-violet-50/80 to-violet-100/80 hover:from-violet-100 hover:to-violet-200",
    border: "border-violet-200/60 hover:border-violet-300",
    shadow: "hover:shadow-violet-500/20",
    iconColor: "text-white",
    title: "text-slate-800",
    description: "text-slate-600",
    chevron: "text-violet-400",
  },
  green: {
    iconBg: "bg-gradient-to-br from-green-500 to-green-600",
    bgGradient: "from-green-50/80 to-green-100/80 hover:from-green-100 hover:to-green-200",
    border: "border-green-200/60 hover:border-green-300",
    shadow: "hover:shadow-green-500/20",
    iconColor: "text-white",
    title: "text-slate-800",
    description: "text-slate-600",
    chevron: "text-green-400",
  },
  emerald: {
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    bgGradient: "from-emerald-50/80 to-emerald-100/80 hover:from-emerald-100 hover:to-emerald-200",
    border: "border-emerald-200/60 hover:border-emerald-300",
    shadow: "hover:shadow-emerald-500/20",
    iconColor: "text-white",
    title: "text-slate-800",
    description: "text-slate-600",
    chevron: "text-emerald-400",
  },
  cyan: {
    iconBg: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    bgGradient: "from-cyan-50/80 to-cyan-100/80 hover:from-cyan-100 hover:to-cyan-200",
    border: "border-cyan-200/60 hover:border-cyan-300",
    shadow: "hover:shadow-cyan-500/20",
    iconColor: "text-white",
    title: "text-slate-800",
    description: "text-slate-600",
    chevron: "text-cyan-400",
  },
  slate: {
    iconBg: "bg-gradient-to-br from-slate-500 to-slate-600",
    bgGradient: "from-slate-50/80 to-slate-100/80 hover:from-red-50 hover:to-red-100",
    border: "border-slate-200/60 hover:border-red-300",
    shadow: "hover:shadow-red-500/20",
    iconColor: "text-white",
    title: "text-slate-800 group-hover:text-red-700",
    description: "text-slate-600 group-hover:text-red-600",
    chevron: "text-slate-400 group-hover:text-red-500",
  },
};

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