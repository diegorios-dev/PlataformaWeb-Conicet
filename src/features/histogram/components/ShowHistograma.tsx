import { BarChart, CloudRain, CloudSnow, Waves, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useNavegation as useNavigation } from "@shared/hooks";
import NavMenu from "@/shared/ui/layouts/NavMenu";
import { logoConicet, logoFai, logoInta, logoUnco, logoUncoBarrilocheHorizontal } from "../../../assets";

export default function ShowHistograma() {

  const {go} = useNavigation();

  return (
    <>
      <NavMenu/>
      {/* Decoración de fondo sutil con animación */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"
      />
      
      {/* Contenido principal */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-5xl px-4 mb-8"
        >

          {/* Tarjeta principal con glassmorphism */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/80 rounded-3xl shadow-xl p-6 md:p-8">
            
            {/* Header modernizado con animación */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="backdrop-blur-xl bg-white/80 border border-white/70 rounded-3xl p-4 md:p-8 mb-6"
            >
              <div className="flex items-center justify-center gap-4 mb-3">
                <motion.div 
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30"
                >
                  <BarChart className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-center"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                    Análisis de Histogramas
                  </h2>
                  <p className="text-base text-slate-600 mt-1 font-medium">
                    Distribución temporal de datos por tipo de instrumento
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Grid de tarjetas mejorado con stagger */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.6
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
            >
              
              {/* Histograma de Lluvia */}
              <motion.button
                onClick={() => go.histograma.lluvia()}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                }}
                whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-blue-50/90 to-blue-100/90 hover:from-blue-100 hover:to-blue-200 border border-blue-200/60 hover:border-blue-300 rounded-2xl p-5 md:p-6 hover:shadow-xl hover:shadow-blue-500/20"
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                      <CloudRain className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 text-center mb-2">
                    Histograma de Lluvia
                  </h3>
                  
                  <p className="text-sm text-slate-600 text-center">
                    Analisis de precipitación líquida
                  </p>
                </div>
              </motion.button>

              {/* Histograma de Nieve */}
              <motion.button
                onClick={() => go.histograma.nieve()}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                }}
                whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-cyan-50/90 to-cyan-100/90 hover:from-cyan-100 hover:to-cyan-200 border border-cyan-200/60 hover:border-cyan-300 rounded-2xl p-5 md:p-6 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                      <CloudSnow className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 text-center mb-2">
                    Histograma de Nieve
                  </h3>
                  
                  <p className="text-sm text-slate-600 text-center">
                    Análisis rrecipitación sólida
                  </p>
                </div>
              </motion.button>

              {/* Histograma de Caudalímetro */}
              <motion.button
                onClick={() => go.histograma.caudalimetro()}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                }}
                whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-50/90 to-emerald-100/90 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200/60 hover:border-emerald-300 rounded-2xl p-5 md:p-6 hover:shadow-xl hover:shadow-emerald-500/20"
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                      <Waves className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 text-center mb-2">
                    Histograma de Caudal
                  </h3>
                  
                  <p className="text-sm text-slate-600 text-center">
                    Análisis de caudal hídrico
                  </p>
                </div>
              </motion.button>

            </motion.div>

            {/* Información adicional con animación */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-6 pt-6 border-t border-slate-200/60"
            >
              <div className="backdrop-blur-xl bg-gradient-to-r from-slate-50/90 to-slate-100/90 border border-slate-200/60 rounded-2xl p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100/80">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      Información sobre los Histogramas
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Los histogramas muestran la distribución de frecuencia de las mediciones registradas por cada tipo de instrumento. 
                      Visualiza patrones temporales, identifica valores extremos y analiza la concentración de datos en diferentes rangos 
                      para cada estación de monitoreo.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </motion.div>

        {/* Footer Profesional - Ancho completo con animación */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
          className="w-full backdrop-blur-xl   overflow-hidden"
        >
          {/* Borde superior decorativo */}
          <div className="h-1 " />
            
            <div className="p-8">
              {/* Título del footer */}
              <div className="text-center mb-6">
              
                <p className="text-sm italic text-slate-600">
                  Proyecto desarrollado en colaboración con
                </p>
              </div>

              {/* Logos con animación stagger */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 1.6
                    }
                  }
                }}
                className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8"
              >
                

               

                {/* Logo CONICET */}
                <motion.a 
                  href="https://www.conicet.gov.ar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
                  }}
                  whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  className="flex items-center justify-center group"
                >
                  <div className="relative p-4">
                    <img 
                      src={logoConicet} 
                      alt="CONICET" 
                      className="h-22 md:h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </motion.a>

                {/* Separador vertical */}
                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

                {/* Logo FAI */}
                <motion.a 
                  href="https://www.fi.uncoma.edu.ar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
                  }}
                  whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  className="flex items-center justify-center group"
                >
                  <div className="relative p-4">
                    <img 
                      src={logoFai} 
                      alt="FAI" 
                      className="h-14 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </motion.a>

                {/* Separador vertical */}
                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

                {/* Logo INTA */}
                <motion.a 
                  href="https://www.argentina.gob.ar/inta" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
                  }}
                  whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  className="flex items-center justify-center group"
                >
                  <div className="relative p-4">
                    <img 
                      src={logoInta} 
                      alt="INTA" 
                      className="h-14 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </motion.a>

                {/* Separador vertical */}
                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

                {/* Logo UNCo */}
                <motion.a 
                  href="https://www.uncoma.edu.ar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
                  }}
                  whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  className="flex items-center justify-center group"
                >
                  <div className="relative p-4">
                    <img 
                      src={logoUnco} 
                      alt="Universidad Nacional del Comahue" 
                      className="h-14 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </motion.a>
                 {/* Separador vertical */}
                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                {/* Logo UNCo Bariloche */}
                <motion.a 
                  href="https://app.crub.uncoma.edu.ar/inicio/novedades" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
                  }}
                  whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  className="flex items-center justify-center group"
                >
                  <div className="relative p-4">
                    <img 
                      src={logoUncoBarrilocheHorizontal} 
                      alt="UNCo Bariloche" 
                      className="h-14 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </motion.a>
              </motion.div>

              {/* Línea divisoria */}
              <div className="my-6 border-t border-slate-200/60" />

              {/* Información adicional */}
              <div className="text-center">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sistema de Monitoreo y Análisis de Datos Hidrológicos
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  © {new Date().getFullYear()} - Todos los derechos reservados
                </p>
              </div>
            </div>
        </motion.div>
      </div>
    </>
  );
}
