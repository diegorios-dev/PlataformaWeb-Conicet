import { useMemo, useState, useEffect, useCallback } from "react";
import useSitio from "../hooks/useSitio";
import MapHTML from "./MapHTML";
import { useUserContext } from "../context/UserContext";
import useNavegation from "../hooks/useNavegation";
import ViewOptionMenu from "./Menu/ViewOptionMenu";
import ViewComplementMenu from "./Menu/ViewComplementMenu";
import { OPTION_INSTRUMENTS } from "../constants/optionInstruments";
import { LogIn, LogOut, Wrench, CheckCircle, AlertCircle } from "lucide-react";
import img from "../assets/logo-CONICET_opt.png";

const Home = () => {
  const { goAHistograma} = useNavegation();

  const [selectOptionMenu, setSelectOptionMenu] = useState("Lluvia");

  const { sitios, loading, error } = useSitio(selectOptionMenu);
  
  const { isLogin, handleLogout, getUsername } = useUserContext();
  const { goLogin, goAdminUi, goHeatMap } = useNavegation();
  const [showWelcome, setShowWelcome] = useState(false);

  // Mostrar mensaje de bienvenida SOLO cuando el usuario acaba de iniciar sesión
  useEffect(() => {
    // Verificar si es un login nuevo (marcado desde el componente Login)
    const isNewLogin = sessionStorage.getItem('newLogin');
    
    if (isLogin && isNewLogin === 'true') {
      setShowWelcome(true);
      
      // Limpiar la marca de nuevo login
      sessionStorage.removeItem('newLogin');
      
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLogin]);

  // ⚡ Memorizar función de logout para evitar re-renders
  const handleLogoutClick = useCallback(() => {
    handleLogout();
    goLogin();
  }, [handleLogout, goLogin]);

  useEffect(() => {
    console.log("Instrumento seleccionado:", selectOptionMenu);
    console.log("Sitios cargados:", sitios);
  }, [selectOptionMenu, sitios]);

  // ⚡ Memorizar opciones de menú complement
  const OPTION_COMPLEMENTS = useMemo(() => [
    { option: "Ver Histograma", onClick: goAHistograma },
    { option: "Ver Mapa de Calor", onClick: goHeatMap },
  ], [goAHistograma, goHeatMap]);

  // 🧠 Memorizar los puntos para no cambiar referencia en cada render
  const pointsMap = useMemo(() => sitios, [sitios]);

  // Estilos modernos tipo Google Cloud/Data Studio
  const btnBase =
    "group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const btnPrimary =
    `${btnBase} bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md active:scale-[0.98]`;
  
  const btnWarn =
    `${btnBase} bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 focus:ring-amber-500 shadow-sm hover:shadow-md active:scale-[0.98]`;
  
  const btnGhost =
    `${btnBase} bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-300`;

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
      <aside className="w-80 bg-white/95 backdrop-blur-xl border-r border-slate-200/60  flex flex-col">
        
        {/* Header del sidebar con logo */}
        <div className="px-6 py-6 border-b border-slate-200/60">
          <div className="flex items-center justify-center mb-2">
            <img src={img} alt="Logo CONICET" className="h-14 w-auto object-contain drop-shadow-sm" />
          </div>
          <h1 className="text-center text-sm font-semibold text-slate-600 tracking-tight">
            Sistema de Monitoreo
          </h1>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          
          {/* Sección Admin (si está logueado) */}
          {isLogin && (
            <div className="space-y-3">
              <button
                onClick={goAdminUi}
                className={`${btnPrimary} justify-start shadow-md`}
              >
                <Wrench className="w-5 h-5" />
                <span>Panel de Administración</span>
              </button>
            </div>
          )}

          {/* Sección Análisis */}
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

          {/* Divider sutil */}
          <div className="border-t border-slate-200/60"></div>

          {/* Sección Visualización */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 mb-3 tracking-wider uppercase px-1">
              Herramientas
            </h3>
            <ViewComplementMenu complements={OPTION_COMPLEMENTS} />
          </div>
        </div>

        {/* Footer del sidebar - Botón de sesión */}
        <div className="px-6 py-5 border-t border-slate-200/60 bg-slate-50/50">
          {isLogin ? (
            <button
              onClick={handleLogoutClick}
              className={`${btnWarn} justify-center shadow-md`}
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          ) : (
            <button
              onClick={goLogin}
              className={`${btnPrimary} justify-center shadow-md`}
            >
              <LogIn className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </button>
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
          <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200/60 bg-white">
            <MapHTML position={pointsMap} loading={loading} />
          </div>
        )}
      </main>

    </div>
  );
};

export default Home;