import { useState } from "react";
import useSitio from "../hooks/useSitio";
import MapHTML from "./MapHTML";
import { useUserContext } from "../context/UserContext";
import useNavegation from "../hooks/useNavegation";
import ViewOptionMenu from "./ViewOptionMenu";
import { OPTION_INSTRUMENTS } from "../constants/optionInstruments";
import { LogIn, Wrench} from "lucide-react"; 

const Home = () => {
  const [selectOptionMenu, setSelectOptionMenu] = useState("Lluvia");
  const pointsMap = useSitio(selectOptionMenu);
  const { isLogin } = useUserContext();
  const { goLogin, goAdminUi, goHeatMap } = useNavegation();

  const handleSetOptionMenu = (option) => {
    setSelectOptionMenu(option);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <aside className="w-96 min-w-[24rem] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-10 flex flex-col justify-between shadow-2xl  border-gray-700  backdrop-blur-lg">
        <div>
          <h2 className="flex items-center gap-3 text-4xl font-extrabold mb-12 tracking-tight border-b-2 border-gray-600 pb-6 drop-shadow-lg">
            <Wrench className="w-8 h-8" />
            Herramientas
          </h2>
          <ViewOptionMenu
            optionMenu={OPTION_INSTRUMENTS}
            handleSetOptionMenu={handleSetOptionMenu}
            selectedInstrument={selectOptionMenu}
            goAdminUi={goAdminUi}
            isLogin={isLogin}
          />
        </div>
        <div className="flex flex-col gap-4 p-6">
          <button
            className="`w-full py-3 px-5 rounded-full font-semibold transition duration-200 shadow-sm border bg-gray-200  bg-gradient-to-r from-gray-100 to-gray-300 text-blue-700  ring-blue-300"
            onClick={goHeatMap}
          >
            Ver Mapa de Calor
          </button>
        </div>
        <div className="mt-12">
            <button
            className="w-full rounded-full bg-green-700 p-5 font-bold text-xl shadow-xl hover:bg-green-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400/60 border border-green-700 flex items-center justify-center gap-3"
            onClick={goLogin}
            >
            <LogIn className="w-6 h-6" />
            Login
            </button>
        </div>
      </aside>
      <main className="flex-1 flex items-center justify-center p-3">
        <div className="w-full h-full rounded-3xl shadow-xl overflow-hidden bg-white/80 backdrop-blur-md">
          
          <MapHTML position={pointsMap} />
        </div>
      </main>
    </div>
  );
};

export default Home;
