import { useNavegation } from "@shared/hooks";
import { DashboardLayout } from '@shared/ui/layouts/DashboardLayout';
import { motion } from "framer-motion";

import { FileText, Users, MapPin, LogOut , TrendingUp, Upload, MapPinned} from "lucide-react";
import { FileSpreadsheet } from "lucide-react";
import { logoConicet, logoUnco } from '../../../assets';

import DashboardButton from "./DashboardButton";

const Dashboard = () => {
  const { go } = useNavegation();

  return (
    <DashboardLayout >
      
      {/* Decoración de fondo sutil con animación */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"
      />
    

      {/* Contenido principal */}
      <div className="flex flex-1 items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-5xl"
        >
          
          {/* Header modernizado */}


          {/* Grid de tarjetas modernizado */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/80 rounded-3xl shadow-xl p-6 md:p-8">
              
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="backdrop-blur-xl bg-white/80 border border-white/70 rounded-3xl p-4 md:p-8 mb-4"
            >
              <div className="flex items-center justify-center gap-6">
                <motion.img 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  src={conicet} 
                  alt="CONICET Logo" 
                  className="h-12 md:h-16 w-16 object-contain" 
                />
                
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight"
                >
                  Panel de Administración
                </motion.h2>
                
                <motion.img 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  src={unco} 
                  alt="UNCO Logo" 
                  className="h-12 md:h-16 w-auto object-contain" 
                />
              </div>
            </motion.div>

              {/* Grid responsive de 2 columnas con animación stagger */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.3
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
              >
                
                <div className="md:col-span-2 flex justify-center">
                  <div className="w-full content-center">
                    <DashboardButton
                      onClick={go.reports.list}
                      icon={FileText}
                      title="Administrar Reportes"
                      description="Gestiona y visualiza reportes"
                      colorScheme="blue"
                    />
                  </div>
                </div>

                <DashboardButton
                  onClick={go.users.list}
                  icon={Users}
                  title="Gestión de Usuarios"
                  description="Administra permisos y accesos"
                  colorScheme="indigo"
                />

                <DashboardButton
                  onClick={go.zonas.add}
                  icon={MapPin}
                  title="Administrar Zonas"
                  description="Configura nuevas ubicaciones"
                  colorScheme="violet"
                />

                <DashboardButton
                  onClick={go.sites.list}
                  icon={MapPinned}
                  title="Administrar Sitios"
                  description="Registra nuevos sitios de medición"
                  colorScheme="blue"
                />

                <DashboardButton
                  onClick={go.excel.import}
                  icon={Upload}
                  title="Importar Excel"
                  description="Sube archivos para importar datos"
                  colorScheme="emerald"
                />

                <DashboardButton
                  onClick={go.stats}
                  icon={TrendingUp}
                  title="Ver Estadísticas"
                  description="Visualiza métricas y análisis"
                  colorScheme="cyan"
                />

                <DashboardButton
                  onClick={go.excel.export}
                  icon={FileSpreadsheet}
                  title="Exportar Excel"
                  description="Descarga datos en formato Excel"
                  colorScheme="green"
                />

              </motion.div>

              {/* Botón de salir modernizado con animación */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="mt-8 pt-6 border-t border-slate-200/60"
              >
                <motion.button
                  onClick={go.back}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="group relative overflow-hidden w-full backdrop-blur-xl bg-gradient-to-r from-slate-100/90 to-slate-200/90 hover:from-red-50 hover:to-red-100 border border-slate-300/60 hover:border-red-300 rounded-2xl p-4 md:p-5 hover:shadow-xl hover:shadow-red-500/20"
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
                </motion.button>
              </motion.div>
            </div>
          
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;