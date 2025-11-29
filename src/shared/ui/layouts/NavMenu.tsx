import React, { useState, useEffect } from "react";
import {
  Map,
  BarChart3,
  MapPin,
  LogOut,
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

const NavMenu: React.FC = () => {
  const { go } = useNavegation();
  const [hovered, setHovered] = useState<boolean>(false);
  const [activePath, setActivePath] = useState<string>(typeof window !== "undefined" ? window.location.pathname : "/");

  // Update active path on navigation popstate (basic route awareness)
  useEffect(() => {
    const handler = () => setActivePath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const items: NavItemConfig[] = [
    {
      key: "map",
      label: "Ir al Mapa",
      icon: Map,
      // Detectar solo rutas de mapa (ejemplos): /map, /dashboard/map, /mapa
      action: go?.map || (() => window.location.assign("/dashboard/map")),
      // REPARACIÓN: antes usabas p.includes("/") lo que coincide siempre; ahora buscamos rutas específicas
      matches: (p) =>
        p === "/" || // si quieres que '/' sea la home/mapa, mantenlo
        p === "/map" ||
        p.startsWith("/dashboard/map") ||
        p.includes("/mapa") ||
        p.includes("/Mapa"),
      color: "text-emerald-900",
    },
    {
      key: "histograma",
      label: "Ver Histograma",
      icon: BarChart3,
      action: () => {
        if (go?.histograma?.list) {
          go.histograma.list();
        } else {
          window.location.assign("/histograma");
        }
      },
      matches: (p) => p.includes("/histogram") || p.includes("/histograma"),
      color: "text-indigo-600",
    },
    {
      key: "heatmap",
      label: "Ver Mapa de Calor",
      icon: MapPin,
      action: go?.heatmap || (() => window.location.assign("/dashboard/heatmap")),
      matches: (p) => p.includes("/heatmap") || p.includes("/mapa-de-calor") || p.includes("/calor"),
      color: "text-indigo-800",
    },
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
                        active ? "text-indigo-700" : item.color || "text-slate-600",
                        "group-hover:scale-110"
                      )}
                    />
                  </div>

                  {/* Label (only when hovered) */}
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

          {/* Bottom Actions (Cerrar / Inicio) */}
          <div className="mt-2 px-2">
            <button
              onClick={go?.back}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default NavMenu;