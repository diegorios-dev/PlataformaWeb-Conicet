import { useState } from "react";
import useSitio from "../hooks/useSitio";
import MapHTML from "./MapHTML";
import useInstrument from "../hooks/useInstrument";
import { useUserContext } from "../context/UserContext";
import useNavegation from "../hooks/useNavegation";
import ViewOptionMenu from "./viewOptionMenu";


const MapContent = () => {

  const [selectedInstrument, setSelectedInstrument] = useState("Lluvia");
  const sitios = useSitio(selectedInstrument);
  const optionMenu = useInstrument();
  const {user} = useUserContext();
  const {goLogin , goAdminUi} = useNavegation()


  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Herramientas</h2>

        {user?.rol === "admin" && (
          <button className="w-full mt-4 p-2 rounded-lg bg-purple-600 hover:bg-purple-700" onClick={goAdminUi}>
            Panel Admin
          </button>
        )}

        <ViewOptionMenu optionMenu={optionMenu} setSelectedInstrument={setSelectedInstrument} selectedInstrument={selectedInstrument}/>
        
      </div>

      <div className="mt-auto">
        <button className="w-full bg-green-600 p-2 rounded-lg hover:bg-green-700" onClick={goLogin}>
          Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
          {renderSidebar()}
          <div className="flex-1">
            <MapHTML position={sitios} />
          </div>
    </div>
  );
};

export default MapContent;
