import { useState, useEffect } from "react";
import {
  FileText,
  Users,
  MapPin,
  Upload,
  TrendingUp,
  FileSpreadsheet,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart3,
  MapPinned,
} from "lucide-react";
import { useNavegation } from "@shared/hooks";

// Simple mapping type for menu items
interface NavItemConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  matches: (path: string) => boolean;
  color?: string; 
}

// Utility to combine conditional classes
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const IconNavMenu: React.FC = () => {
  const { go } = useNavegation();
  const [hovered, setHovered] = useState<boolean>(false);
  const [activePath, setActivePath] = useState<string>(window.location.pathname);

  // Update active path on navigation popstate (basic route awareness)
  useEffect(() => {
    const handler = () => setActivePath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const items: NavItemConfig[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: Home,
      action: go.dashboard,
      matches: (p) => p === "/dashboard",
      color: "text-indigo-600",
    },
    {
      key: "reportes",
      label: "Reportes",
      icon: FileText,
      action: go.reports.list,
      matches: (p) => p.includes("/dashboard/administration/report"),
      color: "text-blue-600",
    },
    {
      key: "usuarios",
      label: "Usuarios",
      icon: Users,
      action: go.users.list,
      matches: (p) => p.includes("/dashboard/administration/user"),
      color: "text-indigo-600",
    },
    {
      key: "zonas",
      label: "Zonas",
      icon: MapPin,
      action: go.zonas.list,
      matches: (p) => p.includes("/dashboard/Zona"),
      color: "text-violet-600",
    },
    {
      key: "site_add",
      label: "Administrar Sitios",
      icon: MapPinned,
      action: go.sites.list,
      matches: (p) => p.includes("/dashboard/site"),
      color: "text-blue-600",
    },
    {
      key: "import",
      label: "Importar Excel",
      icon: Upload,
      action: go.excel.import,
      matches: (p) => p.includes("/dashboard/import/excel"),
      color: "text-indigo-600",
    },
    {
      key: "export",
      label: "Exportar Excel",
      icon: FileSpreadsheet,
      action: go.excel.export,
      matches: (p) => p.includes("/dashboard/export/excel"),
      color: "text-green-600",
    },
    {
      key: "estadisticas",
      label: "Estadísticas",
      icon: TrendingUp,
      action: go.stats,
      matches: (p) => p.includes("/estadisticas"),
      color: "text-blue-600",
    }
  ];

    function isActive(item: NavItemConfig) {
    return item.matches(activePath);
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "fixed z-50 top-0 left-0 h-screen flex flex-col transition-all duration-300",
          hovered ? "w-60" : "w-16"
        )}
      >
        <div
          className={cn(
            "flex-1 backdrop-blur-2xl bg-white/50 border-r border-white/70 shadow-2xl",
            "pt-10 pb-4 flex flex-col"
          )}
        >
          {/* Menu Items */}
          <nav className="flex-1 flex flex-col gap-2 px-2">
            {items.map((item) => {
              const ActiveIcon = item.icon;
              const active = isActive(item);
              return (
                <button
                  key={item.key}
                  aria-label={item.label}
                  onClick={item.action}
                  className={cn(
                    "group relative w-full flex items-center",
                    "rounded-xl border backdrop-blur-xl",
                    "transition-all duration-300",
                    active
                      ? "bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border-indigo-400/40 shadow-lg shadow-indigo-500/20"
                      : "bg-white/40 border-white/60 hover:bg-white/70 hover:shadow-md"
                  )}
                >
                  {/* Icon */}
                  <div className="p-3 flex items-center justify-center">
                    <ActiveIcon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        active ? item.color || "text-indigo-700" : item.color || "text-slate-600",
                        "group-hover:scale-110"
                      )}
                    />
                  </div>

                  {/* Label (only when expanded) */}
                  {hovered && (
                    <span
                      className={cn(
                        "pr-4 text-sm font-semibold text-slate-700 truncate",
                        active && "text-indigo-800"
                      )}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip when collapsed */}
                  {!hovered && (
                    <span
                      className={cn(
                        "pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2",
                        "opacity-0 group-hover:opacity-100 group-focus:opacity-100",
                        "bg-white/90 backdrop-blur-xl text-slate-700 text-xs font-semibold",
                        "px-2 py-1 rounded-lg shadow border border-slate-200/60",
                        "transition-opacity duration-200 whitespace-nowrap"
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-2 px-2">
            <button
              onClick={go.back}
              aria-label="Salir / Volver"
              className={cn(
                "group relative w-full flex items-center rounded-xl border border-white/60",
                "backdrop-blur-xl bg-gradient-to-r from-slate-200/40 to-slate-300/40",
                "hover:from-red-100/60 hover:to-red-200/60 hover:border-red-300/70",
                "transition-all duration-300"
              )}
            >
              <div className="p-3">
                <LogOut className="w-5 h-5 text-slate-600 group-hover:text-red-700" />
              </div>
              {hovered && (
                <span className="text-sm font-semibold text-slate-700 group-hover:text-red-700 pr-4">
                  Cerrar / Volver
                </span>
              )}
              {!hovered && (
                <span
                  className={cn(
                    "pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2",
                    "opacity-0 group-hover:opacity-100",
                    "bg-white/90 backdrop-blur-xl text-slate-700 text-xs font-semibold px-2 py-1",
                    "rounded-lg shadow border border-slate-200/60 transition-opacity whitespace-nowrap"
                  )}
                >
                  Salir / Volver
                </span>
              )}
            </button>

            <button
              onClick={go.home}
              aria-label="Ir a inicio"
              className={cn(
                "mt-2 group relative w-full flex items-center rounded-xl border border-white/60",
                "backdrop-blur-xl bg-gradient-to-r from-slate-200/40 to-slate-300/40",
                "hover:from-emerald-100/60 hover:to-emerald-200/60 hover:border-emerald-300/70",
                "transition-all duration-300"
              )}
            >
              <div className="p-3">
                <BarChart3 className="w-5 h-5 text-slate-600 group-hover:text-emerald-700" />
              </div>
              {hovered && (
                <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 pr-4">
                  Inicio
                </span>
              )}
              {!hovered && (
                <span
                  className={cn(
                    "pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2",
                    "opacity-0 group-hover:opacity-100",
                    "bg-white/90 backdrop-blur-xl text-slate-700 text-xs font-semibold px-2 py-1",
                    "rounded-lg shadow border border-slate-200/60 transition-opacity whitespace-nowrap"
                  )}
                >
                  Inicio
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IconNavMenu;
