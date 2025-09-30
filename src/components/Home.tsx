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

    <div className="flex h-screen">

      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Herramientas</h2>
          <ViewOptionMenu 
            optionMenu={OPTION_INSTRUMENTS} 
            handleSetOptionMenu={handleSetOptionMenu} 
            selectedInstrument={selectOptionMenu}
            goAdminUi={goAdminUi}
            isLogin={isLogin} 
          />
        </div>

        <div className="mt-auto">
          <button className="w-full bg-green-600 p-2 rounded-lg hover:bg-green-700" onClick={goLogin}>
            Login
          </button>
        </div>
        
      </div>

      <div className="flex-1">
        <MapHTML position={pointsMap} />
      </div>

    </div>
  );
};

export default Home;
