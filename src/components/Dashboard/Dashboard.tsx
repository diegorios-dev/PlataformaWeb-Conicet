import { useState } from "react";
import useNavegation from "../../hooks/useNavegation";
import BackButton from "../BackButton";
import { FileText, Users, MapPin, LogOut, Shield , TrendingUp, Upload} from "lucide-react";
import { FileSpreadsheet } from "lucide-react";
import DashboardButton from "../DashboardButton";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"menu" | "instrumentos">("menu");
  const { goReports, goConfigUsers, goBack, goAddZona, goImportExcel ,goEstadisticas , goExportExcel } = useNavegation();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col">
      
      {/* Back Button flotante */}
      <div className="absolute top-6 left-6 z-50">
        <div className="backdrop-blur-xl transition-all duration-300">
          <BackButton />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          
          {/* Header con glassmorphism */}
          <div className="backdrop-blur-2xl bg-white/50 border border-white/60 rounded-3xl shadow-2xl p-8 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/40">
                <Shield className="w-8 h-8 text-blue-700" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Panel de Administración
              </h2>
            </div>
            <p className="text-center text-slate-600 text-sm font-medium">
              
            </p>
          </div>

          {/* Botones con glassmorphism */}
          {currentView === "menu" && (
            <div className="backdrop-blur-2xl bg-white/40 border border-white/60 rounded-3xl shadow-2xl p-8">
              <div className="flex flex-col gap-4">
                
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
                  onClick={goImportExcel}
                  icon={Upload}
                  title="Importar Excel"
                  description="Sube un archivo Excel para importar datos"
                  colorScheme="indigo"
                />

                <DashboardButton
                  onClick={goEstadisticas}
                  icon={TrendingUp}
                  title="Ver Estadísticas"
                  description="Visualiza las estadísticas de los datos"
                  colorScheme="blue"
                />

                
                <DashboardButton
                  onClick={goExportExcel}
                  icon={FileSpreadsheet}
                  title="Exportar Excel"
                  description="Descarga un archivo Excel con los datos"
                  colorScheme="green"
                />

              </div>

              {/* Botón de salir */}
              <div className="mt-8 pt-6 border-t border-slate-200/50">
                <button
                  onClick={goBack}
                  className="group relative overflow-hidden w-full backdrop-blur-xl bg-gradient-to-r from-slate-500/10 to-slate-600/10 hover:from-red-500/15 hover:to-red-600/15 border border-slate-300/40 hover:border-red-400/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative flex items-center justify-center gap-3">
                    <LogOut className="w-5 h-5 text-slate-700 group-hover:text-red-800 transition-colors" />
                    <span className="text-lg font-bold text-slate-800 group-hover:text-red-800 transition-colors">
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