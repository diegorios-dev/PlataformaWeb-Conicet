import { useState } from "react";
import { Lock, LogOut, Wrench, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Droplet, Snowflake, BarChart3, MapPin } from "lucide-react";

import { logoConicet, logoUncoBariloche } from "../../../assets/index";

import { useSitio } from "@features/site/hooks";
import MapHTML from "@features/map/components/MapHTML";
import { useNavegation } from "@shared/hooks";
import ViewOptionMenu from "@features/menu/components/ViewOptionMenu";
import ViewComplementMenu from "@features/menu/components/ViewComplementMenu";

import { useAuth } from "@features/auth";
import { OPTION_INSTRUMENTS } from "@shared/utils/optionInstruments";
import { btnPrimary, btnMarino } from "../constants/sidebarButtons";
import { getOptionComplements } from "../constants/optionComplements";
import { useWelcomeMessage } from "../hooks/useWelcomeMessage";
import { useLogout } from "../hooks/useLogout";


const Home = () => {
  
  const [selectOptionMenu, setSelectOptionMenu] = useState("Lluvia");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { sitios, loading, error } = useSitio(selectOptionMenu);
  const { isLogin, getUsername, user } = useAuth();
  const { go } = useNavegation();

  const showWelcome = useWelcomeMessage(isLogin);
  const handleLogout = useLogout();
  const OPTION_COMPLEMENTS = getOptionComplements(go);
  const pointsMap = sitios;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      
      {/* Decoración de fondo sutil */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"></div>
      
      {/* Mensaje de bienvenida modernizado */}
      {showWelcome && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="backdrop-blur-xl bg-white/95 border border-blue-200/50 px-8 py-5 rounded-2xl shadow-2xl shadow-blue-500/10 flex items-center gap-4 min-w-[420px]">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 mb-0.5 tracking-wide uppercase">
                Sesión iniciada
              </p>
              <p className="text-lg font-bold text-slate-800">
                {getUsername()}
              </p>
            </div>
            <div className="h-12 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Sidebar modernizado estilo Google Cloud */}
      <aside className={`relative bg-white/95 backdrop-blur-xl border-r border-slate-200/60 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        
        {/* Botón de colapsar/expandir */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`absolute top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all duration-200 group ${
            sidebarCollapsed ? '-right-3' : '-right-3'
          }`}
          aria-label={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
          )}
        </button>
        
        {/* Header del sidebar con logo */}
        <div className={`px-6 py-6 border-b border-slate-200/60 transition-all duration-300 ${
          sidebarCollapsed ? 'px-2' : 'px-6'
        }`}>
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center justify-center mb-2">
                <img src={logoConicet} alt="Logo logoConicet" className="h-14 w-16 object-contain drop-shadow-sm" />
                <img src={logoUncoBariloche} alt="Logo UNCO" className="h-14 w-28 object-contain drop-shadow-sm" />
              </div>
              <h1 className="text-center text-xl font-semibold text-slate-600 tracking-tight">
                Sistema de Monitoreo
              </h1>
            </>
          ) : (
            <div className="flex justify-center">
              <img src={logoConicet} alt="Logo" className="h-10 w-10 object-contain drop-shadow-sm" />
            </div>
          )}
        </div>

        {/* Contenido scrolleable */}
        <div className={`flex-1 overflow-y-auto py-6 space-y-8 transition-all duration-300 ${sidebarCollapsed ? 'px-2' : 'px-6'}`}>
          
          {/* Sección Admin (si está logueado) */}
          {isLogin && (
            <div className="space-y-3">
              {!sidebarCollapsed ? (
                <button
                  onClick={go.dashboard}
                  className={`${btnPrimary} justify-start shadow-md`}
                >
                  <Wrench className="w-5 h-5" />
                  <span>Panel de Administración</span>
                </button>
              ) : (
                <button
                  onClick={go.dashboard}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                  title="Panel de Administración"
                >
                  <Wrench className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Sección Análisis */}
          {!sidebarCollapsed ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 mb-3 tracking-wider uppercase px-1">
                Tipo de Evento
              </h3>
              <ViewOptionMenu
                instruments={OPTION_INSTRUMENTS}
                selectedInstrument={selectOptionMenu}
                onSelectInstrument={setSelectOptionMenu}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => setSelectOptionMenu("Lluvia")}
                className={`w-full p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center ${
                  selectOptionMenu === "Lluvia" 
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" 
                    : "bg-white text-amber-700 hover:bg-amber-50"
                }`}
                title="Ver Pluviometros"
              >
                <Droplet className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectOptionMenu("Nieve")}
                className={`w-full p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center ${
                  selectOptionMenu === "Nieve" 
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" 
                    : "bg-white text-amber-700 hover:bg-amber-50"
                }`}
                title="Ver Reglas"
              >
                <Snowflake className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Divider sutil */}
          {!sidebarCollapsed && <div className="border-t border-slate-200/60"></div>}

          {/* Sección Visualización */}
          {!sidebarCollapsed ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 mb-3 tracking-wider uppercase px-1">
                Herramientas
              </h3>
              <ViewComplementMenu complements={OPTION_COMPLEMENTS} />
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={go.histograma.list}
                className="w-full p-3 rounded-xl bg-white text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                title="Ver Histograma"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={go.heatmap}
                className="w-full p-3 rounded-xl bg-white text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                title="Ver Mapa de Calor"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer del sidebar - Botón de sesión */}
        <div className={`py-5 border-t border-slate-200/60 bg-slate-50/50 transition-all duration-300 ${
          sidebarCollapsed ? 'px-2' : 'px-6'
        }`}>
          {isLogin ? (
            !sidebarCollapsed ? (
              <button
                onClick={handleLogout}
                className={`${btnMarino} justify-center shadow-md`}
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )
          ) : (
            !sidebarCollapsed ? (
              <button
                onClick={go.login}
                className={`${btnPrimary} justify-center shadow-md`}
              >
                <Lock className="w-5 h-5" />
                <span>Acceso Administrativo</span>
              </button>
            ) : (
              <button
                onClick={go.login}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                title="Acceso Administrativo"
              >
                <Lock className="w-5 h-5" />
              </button>
            )
          )}
        </div>
      </aside>

      {/* Contenedor principal del mapa */}
      <main className="flex-1 flex items-center justify-center relative">
        {error ? (
          <div className="max-w-lg w-full">
            <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertCircle className="w-7 h-7 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-900 mb-2">Error al cargar datos</h3>
                  <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Recargar página
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-hidden shadow-xl pl-3">
            <MapHTML position={pointsMap} loading={loading} userRole={user?.rol} />
          </div>
        )}
      </main>

    </div>
  );
};

export default Home;