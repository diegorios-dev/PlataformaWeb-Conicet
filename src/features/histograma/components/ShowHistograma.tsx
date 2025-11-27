import { BarChart, CloudRain, CloudSnow, Waves, TrendingUp, Calendar, MapPin } from "lucide-react";
import { useNavegation as useNavigation } from "@shared/hooks";
import NavMenu from "@/shared/ui/layouts/NavMenu";

export default function ShowHistograma() {

  const {go} = useNavigation();

  return (
    <>
      <NavMenu/>
      {/* Decoración de fondo sutil */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"></div>
      
      {/* Contenido principal */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-5xl">

          {/* Tarjeta principal con glassmorphism */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/80 rounded-3xl shadow-xl p-6 md:p-8">
            
            {/* Header modernizado */}
            <div className="backdrop-blur-xl bg-white/80 border border-white/70 rounded-3xl p-4 md:p-8 mb-6">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                  <BarChart className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                    Análisis de Histogramas
                  </h2>
                  <p className="text-base text-slate-600 mt-1 font-medium">
                    Distribución temporal de datos por tipo de instrumento
                  </p>
                </div>
              </div>
            </div>

            {/* Grid de tarjetas mejorado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              
              {/* Histograma de Lluvia */}
              <button
                onClick={() => go.histograma.lluvia()}
                className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-blue-50/90 to-blue-100/90 hover:from-blue-100 hover:to-blue-200 border border-blue-200/60 hover:border-blue-300 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
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
              </button>

              {/* Histograma de Nieve */}
              <button
                onClick={() => go.histograma.nieve()}
                className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-cyan-50/90 to-cyan-100/90 hover:from-cyan-100 hover:to-cyan-200 border border-cyan-200/60 hover:border-cyan-300 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
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
              </button>

              {/* Histograma de Caudalímetro */}
              <button
                onClick={() => go.histograma.caudalimetro()}
                className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-50/90 to-emerald-100/90 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200/60 hover:border-emerald-300 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
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
              </button>

            </div>

            {/* Información adicional */}
            <div className="mt-6 pt-6 border-t border-slate-200/60">
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
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
