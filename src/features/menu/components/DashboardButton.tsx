import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DashboardButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  colorScheme: "blue" | "indigo" | "violet" | "green" | "slate";
}

const colorSchemes = {
  blue: {
    gradient: "from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20",
    border: "border-blue-300/40 hover:border-blue-400/60",
    shadow: "hover:shadow-blue-500/20",
    icon: "bg-blue-500/20 border-blue-400/30",
    iconColor: "text-blue-700",
    title: "text-blue-900",
    chevron: "text-blue-600",
  },
  indigo: {
    gradient: "from-indigo-500/10 to-indigo-600/10 hover:from-indigo-500/20 hover:to-indigo-600/20",
    border: "border-indigo-300/40 hover:border-indigo-400/60",
    shadow: "hover:shadow-indigo-500/20",
    icon: "bg-indigo-500/20 border-indigo-400/30",
    iconColor: "text-indigo-700",
    title: "text-indigo-900",
    chevron: "text-indigo-600",
  },
  violet: {
    gradient: "from-violet-500/10 to-violet-600/10 hover:from-violet-500/20 hover:to-violet-600/20",
    border: "border-violet-300/40 hover:border-violet-400/60",
    shadow: "hover:shadow-violet-500/20",
    icon: "bg-violet-500/20 border-violet-400/30",
    iconColor: "text-violet-700",
    title: "text-violet-900",
    chevron: "text-violet-600",
  },
  green: {
    gradient: "from-green-500/10 to-emerald-600/10 hover:from-green-500/20 hover:to-emerald-600/20",
    border: "border-green-300/40 hover:border-green-400/60",
    shadow: "hover:shadow-green-500/20",
    icon: "bg-green-500/20 border-green-400/30",
    iconColor: "text-green-700",
    title: "text-green-900",
    chevron: "text-green-600",
  },
  slate: {
    gradient: "from-slate-500/10 to-slate-600/10 hover:from-red-500/15 hover:to-red-600/15",
    border: "border-slate-300/40 hover:border-red-400/60",
    shadow: "hover:shadow-red-500/10",
    icon: "bg-slate-500/20 border-slate-400/30",
    iconColor: "text-slate-700 group-hover:text-red-800",
    title: "text-slate-800 group-hover:text-red-800",
    chevron: "text-slate-600 group-hover:text-red-800",
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
      className={`group relative overflow-hidden backdrop-blur-xl bg-gradient-to-r ${colors.gradient} border ${colors.border} rounded-xl p-3.5 md:p-4 transition-all duration-300 hover:shadow-lg ${colors.shadow} hover:scale-[1.01]`}
    >
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5 md:gap-3">
          <div className={`p-2 md:p-2.5 rounded-lg ${colors.icon} backdrop-blur-sm border`}>
            <Icon className={`w-5 h-5 md:w-5 md:h-5 ${colors.iconColor} transition-colors`} />
          </div>
          <div className="text-left">
            <h3 className={`text-sm md:text-base font-bold ${colors.title} transition-colors`}>{title}</h3>
            <p className="text-xs md:text-sm text-slate-600">{description}</p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 md:w-5 md:h-5 ${colors.chevron} group-hover:translate-x-1 transition-all`} />
      </div>
    </button>
  );
}