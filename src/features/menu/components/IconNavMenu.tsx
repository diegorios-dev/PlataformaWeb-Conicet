import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Users,
  MapPin,
  Upload,
  TrendingUp,
  FileSpreadsheet,
  Home,
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
      matches: (p) => p.includes("/dashboard/reportes"),
      color: "text-blue-600",
    },
    {
      key: "usuarios",
      label: "Usuarios",
      icon: Users,
      action: go.users.list,
      matches: (p) => p.includes("/dashboard/usuarios"),
      color: "text-indigo-600",
    },
    {
      key: "zonas",
      label: "Zonas",
      icon: MapPin,
      action: go.zonas.add,
      matches: (p) => p.includes("/dashboard/zonas"),
      color: "text-violet-600",
    },
    {
      key: "site_add",
      label: "Administrar Sitios",
      icon: MapPinned,
      action: go.sites.list,
      matches: (p) => p.includes("/dashboard/sitios"),
      color: "text-blue-600",
    },
    {
      key: "import",
      label: "Importar Excel",
      icon: Upload,
      action: go.excel.import,
      matches: (p) => p.includes("/dashboard/importar/excel"),
      color: "text-indigo-600",
    },
    {
      key: "export",
      label: "Exportar Excel",
      icon: FileSpreadsheet,
      action: go.excel.export,
      matches: (p) => p.includes("/dashboard/exportar/excel"),
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
      {/* Desktop Sidebar con animación fluida */}
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ x: -100, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
          width: hovered ? "240px" : "64px"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          opacity: { duration: 0.3 }
        }}
        className="fixed z-50 top-0 left-0 h-screen flex flex-col"
      >
        {/* Efecto de partículas decorativas en hover */}
        <AnimatePresence>
          {hovered && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.3, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-10 left-8 w-2 h-2 bg-indigo-400 rounded-full blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.2, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="absolute top-32 left-10 w-1.5 h-1.5 bg-blue-400 rounded-full blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.25, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="absolute bottom-40 left-6 w-1.5 h-1.5 bg-violet-400 rounded-full blur-sm"
              />
            </>
          )}
        </AnimatePresence>

        <motion.div
          style={{
            background: 'linear-gradient(135deg, #26B4F0 0%, #045BA9 50%, #021D6B 100%)'
          }}
          className="flex-1 backdrop-blur-2xl border-r border-white/70 shadow-2xl pt-10 pb-4 flex flex-col relative overflow-hidden"
        >
          {/* Efecto de brillo sutil que recorre el sidebar */}
          <motion.div
            animate={{
              y: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 2
            }}
            className="absolute left-0 w-full h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"
          />
          {/* Menu Items con animación stagger */}
          <motion.nav 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.2
                }
              }
            }}
            className="flex-1 flex flex-col gap-2 px-2"
          >
            {items.map((item) => {
              const ActiveIcon = item.icon;
              const active = isActive(item);
              return (
                <motion.button
                  key={item.key}
                  aria-label={item.label}
                  onClick={item.action}
                  variants={{
                    hidden: { x: -20, opacity: 0 },
                    visible: { 
                      x: 0, 
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 24
                      }
                    }
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    x: 4,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "group relative w-full flex items-center",
                    "rounded-xl border backdrop-blur-xl transition-all duration-300",
                    active
                      ? "bg-white/40 border-white shadow-2xl shadow-white/30 ring-2 ring-white/50"
                      : "bg-white/15 border-white/30 hover:bg-white/25 hover:border-white/50 hover:shadow-lg"
                  )}
                >
                  {/* Icon con micro-animaciones */}
                  <motion.div 
                    className={cn(
                      "p-3 flex items-center justify-center rounded-lg",
                      active && "bg-white/20"
                    )}
                    whileHover={{ 
                      rotate: [0, -8, 8, 0],
                      transition: { duration: 0.4 }
                    }}
                  >
                    <ActiveIcon
                      className={cn(
                        "w-6 h-6 transition-all duration-200",
                        active 
                          ? "text-white drop-shadow-md" 
                          : "text-white/80 group-hover:text-white group-hover:scale-110"
                      )}
                    />
                  </motion.div>

                  {/* Label con animación de entrada */}
                  <AnimatePresence>
                    {hovered && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "pr-4 text-sm font-bold truncate transition-colors duration-200",
                          active 
                            ? "text-white drop-shadow-lg" 
                            : "text-white/80 group-hover:text-white"
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip animado cuando colapsado */}
                  {!hovered && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2",
                        "bg-white/90 backdrop-blur-xl text-slate-700 text-xs font-semibold",
                        "px-2 py-1 rounded-lg shadow-lg border border-slate-200/60",
                        "whitespace-nowrap"
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {/* Indicador activo con animación */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full shadow-lg shadow-white/50"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  {/* Glow effect para item activo */}
                  {active && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl pointer-events-none"
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.nav>

          {/* Bottom Actions con animaciones */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-2 px-2 space-y-2"
          >
            <motion.button
              onClick={go.back}
              aria-label="Salir / Volver"
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="group relative w-full flex items-center rounded-xl border border-white/60 backdrop-blur-xl bg-gradient-to-r from-slate-200/40 to-slate-300/40 hover:from-red-100/60 hover:to-red-200/60 hover:border-red-300/70"
            >
              {!hovered && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl text-slate-700 text-xs font-semibold px-2 py-1 rounded-lg shadow-lg border border-slate-200/60 whitespace-nowrap"
                >
                  Salir / Volver
                </motion.span>
              )}
            </motion.button>

            <motion.button
              onClick={go.home}
              aria-label="Ir a inicio"
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="group relative w-full flex items-center rounded-xl border border-white/60 backdrop-blur-xl bg-gradient-to-r from-slate-200/40 to-slate-300/40 hover:from-emerald-100/60 hover:to-emerald-200/60 hover:border-emerald-300/70"
            >
              <motion.div 
                className="p-3"
                whileHover={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.5 }}
              >
                <BarChart3 className="w-5 h-5 text-white group-hover:text-emerald-700" />
              </motion.div>
              <AnimatePresence>
                {hovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-semibold text-white group-hover:text-emerald-700 pr-4"
                  >
                    Inicio
                  </motion.span>
                )}
              </AnimatePresence>
              {!hovered && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl text-slate-700 text-xs font-semibold px-2 py-1 rounded-lg shadow-lg border border-slate-200/60 whitespace-nowrap"
                >
                  Inicio
                </motion.span>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default IconNavMenu;
