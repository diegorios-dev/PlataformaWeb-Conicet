import { useState } from "react";
import useSitio from "../hooks/useSitio";
import MapHTML from "./MapHTML";
import { useUserContext } from "../context/UserContext";
import useNavegation from "../hooks/useNavegation";
import ViewOptionMenu from "./ViewOptionMenu";
import { OPTION_INSTRUMENTS } from "../constants/optionInstruments";

const Home = () => {
  
  const [selectOptionMenu, setSelectOptionMenu] = useState("Lluvia");
  
  const pointsMap = useSitio(selectOptionMenu);
  const {isLogin} = useUserContext();
  const {goLogin , goAdminUi} = useNavegation()

  const handleSetOptionMenu = (option) => {
    setSelectOptionMenu(option)
  }

  return (

    <div className="flex  h-screen bg-gradient-to-br from-blue-50 to-green-100">

      <aside className="w-100 bg-gray-800 text-white p-8 flex flex-col justify-between shadow-2xl border-r border-gray-700">
      <div>
        <h2 className="text-3xl font-bold mb-10 tracking-tight border-b border-gray-700 pb-4">Herramientas</h2>
        <ViewOptionMenu 
        optionMenu={OPTION_INSTRUMENTS} 
        handleSetOptionMenu={handleSetOptionMenu} 
        selectedInstrument={selectOptionMenu}
        goAdminUi={goAdminUi}
        isLogin={isLogin} 
        />
      </div>

      <div className="mt-10">
        <button 
        className="w-full bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl font-semibold text-lg shadow-lg hover:from-green-500 hover:to-green-650 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={goLogin}
        >
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
