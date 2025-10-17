import { useMemo, useState, useEffect } from "react";
import useSitio from "../hooks/useSitio";
import MapHTML from "./MapHTML";
import { useUserContext } from "../context/UserContext";
import useNavegation from "../hooks/useNavegation";
import ViewOptionMenu from "./Menu/ViewOptionMenu";
import ViewComplementMenu from "./Menu/ViewComplementMenu";
import { OPTION_INSTRUMENTS } from "../constants/optionInstruments";
import { LogIn, LogOut, Wrench, CheckCircle } from "lucide-react";
import img from "../assets/logo-CONICET_opt.png";

const Home = () => {
  const { goAHistograma } = useNavegation();
  const [selectOptionMenu, setSelectOptionMenu] = useState("lluvia");
  const sitios = useSitio(selectOptionMenu);
  const { isLogin, handleLogout, getUsername } = useUserContext();
  const { goLogin, goAdminUi, goHeatMap } = useNavegation();
  const [showWelcome, setShowWelcome] = useState(false);

  // Mostrar mensaje de bienvenida cuando el usuario inicia sesión
  useEffect(() => {
    if (isLogin) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLogin]);

  const handleLogoutClick = () => {
    handleLogout();
    goLogin();
  };

  const OPTION_COMPLEMENTS = [
    { option: "Ver Histograma", onClick: goAHistograma },
    { option: "Ver Mapa de Calor", onClick: goHeatMap },
  ];

  // 🧠 Memorizar los puntos para no cambiar referencia en cada render
  const pointsMap = useMemo(() => sitios, [sitios]);

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mensaje de bienvenida */}
     { /*showWelcome && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold text-lg">
              Has ingresado con el usuario: {getUsername()}
            </span>
          </div>
        </div>
      )*/}

      <aside className="w-96 bg-white border-r border-gray-200 flex flex-col justify-between text-[17px]">
        <div className="p-10">
          <div className="flex justify-center">
            <img src={img} alt="Logo Conicet" className="max-w-[180px] mb-6" />
          </div>

          <div className="mb-12">
            <h3 className="text-base font-semibold text-gray-500 mb-5 tracking-wider uppercase">
              Análisis
            </h3>

            {isLogin && (
              <button
                onClick={goAdminUi}
                className="flex items-center gap-3 w-full px-6 py-4 rounded-lg text-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition mb-4"
              >
                <Wrench className="w-6 h-6" />
                Panel Admin
              </button>
            )}

            <ViewOptionMenu
              instruments={OPTION_INSTRUMENTS}
              selectedInstrument={selectOptionMenu}
              onSelectInstrument={setSelectOptionMenu}
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-500 mb-5 tracking-wider uppercase">
              Visualización
            </h3>
            <ViewComplementMenu complements={OPTION_COMPLEMENTS} />
          </div>
        </div>

        <div className="p-10 border-t border-gray-200">
          {isLogin ? (
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-lg text-lg transition"
            >
              <LogOut className="w-6 h-6" />
              Cerrar Sesión
            </button>
          ) : (
            <button
              onClick={goLogin}
              className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg text-lg transition"
            >
              <LogIn className="w-6 h-6" />
              Login
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 flex items-center justify-center">
        <MapHTML position={pointsMap} />
      </main>
    </div>
  );
};

export default Home;