import { useState } from "react";
import useNavegation from "../../hooks/useNavegation";
import BackButton from "../BackButton";
import { FileText, Users, MapPin, LogOut, Shield , TrendingUp, Upload, MapPinned} from "lucide-react";
import { FileSpreadsheet } from "lucide-react";
import DashboardButton from "./DashboardButton";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"menu" | "instrumentos">("menu");
  const { goReports, goConfigUsers, goBack, goAddZona, goImportExcel ,goEstadisticas , goExportExcel, goAddSite } = useNavegation();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex flex-col relative overflow-hidden">
      
      {/* Decoración de fondo sutil */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"></div>
      
      {/* Back Button flotante modernizado */}
      <div className="absolute top-6 left-6 z-50">
          <BackButton />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-5xl">
          
          {/* Header modernizado */}
          <div className="backdrop-blur-xl bg-white/80 border border-white/70 rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                  Panel de Administración
                </h2>
              </div>
            </div>
            <p className="text-center text-slate-500 text-sm md:text-base font-medium tracking-wide">
              Gestiona el sistema de monitoreo de forma centralizada
            </p>
          </div>

          {/* Grid de tarjetas modernizado */}
          {currentView === "menu" && (
            <div className="backdrop-blur-xl bg-white/70 border border-white/80 rounded-3xl shadow-2xl p-6 md:p-8">
              
              {/* Grid responsive de 2 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                
                <DashboardButton
                  onClick={goReports}
                  icon={FileText}
                  title="Administrar Reportes"
                  description="Gestiona y visualiza reportes"
                  colorScheme="blue"
                />

                <DashboardButton
                  onClick={goConfigUsers}
                  icon={Users}
                  title="Gestión de Usuarios"
                  description="Administra permisos y accesos"
                  colorScheme="indigo"
                />

                <DashboardButton
                  onClick={goAddZona}
                  icon={MapPin}
                  title="Agregar Zona"
                  description="Configura nuevas ubicaciones"
                  colorScheme="violet"
                />

                <DashboardButton
                  onClick={goAddSite}
                  icon={MapPinned}
                  title="Agregar Sitio"
                  description="Registra nuevos sitios de medición"
                  colorScheme="blue"
                />

                <DashboardButton
                  onClick={goImportExcel}
                  icon={Upload}
                  title="Importar Excel"
                  description="Sube archivos para importar datos"
                  colorScheme="emerald"
                />

                <DashboardButton
                  onClick={goEstadisticas}
                  icon={TrendingUp}
                  title="Ver Estadísticas"
                  description="Visualiza métricas y análisis"
                  colorScheme="cyan"
                />

                <DashboardButton
                  onClick={goExportExcel}
                  icon={FileSpreadsheet}
                  title="Exportar Excel"
                  description="Descarga datos en formato Excel"
                  colorScheme="green"
                />

              </div>

              {/* Botón de salir modernizado */}
              <div className="mt-8 pt-6 border-t border-slate-200/60">
                <button
                  onClick={goBack}
                  className="group relative overflow-hidden w-full backdrop-blur-xl bg-gradient-to-r from-slate-100/90 to-slate-200/90 hover:from-red-50 hover:to-red-100 border border-slate-300/60 hover:border-red-300 rounded-2xl p-4 md:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {/* Efecto de brillo mejorado */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative flex items-center justify-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-200/60 group-hover:bg-red-100/90 transition-all duration-300 group-hover:scale-110">
                      <LogOut className="w-5 h-5 md:w-6 md:h-6 text-slate-600 group-hover:text-red-600 transition-colors" />
                    </div>
                    <span className="text-base md:text-lg font-bold text-slate-700 group-hover:text-red-600 transition-colors">
                      Cerrar Panel de Administración
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;