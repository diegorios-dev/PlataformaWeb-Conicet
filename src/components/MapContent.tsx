import { useState } from "react";
import useSitio from "../hooks/useSitio";
import MapHTML from "./MapHTML";
import useInstrument from "../hooks/useInstrument";
import Dashboard from "./Dashboard";
import Login from "./Login";
import useUser from "../hooks/useUser";

const MapContent = () => {

  const [selectedInstrument, setSelectedInstrument] = useState("Lluvia");
  const [password, setPassword] = useState("");
  const [showAdminUI, setShowAdminUI] = useState(false);

  const sitios = useSitio(selectedInstrument);
  const optionMenu = useInstrument();
  
  const { handlePassword, user, showLogin, showLoginForm, hideLoginForm } = useUser(password);

  const handleSavePassword = (e) => setPassword(e.target.value);

  // 🔹 UI auxiliar
  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Herramientas</h2>

        {user?.rol === "admin" && (
          <button
            className="w-full mt-4 p-2 rounded-lg bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowAdminUI(true)}
          >
            Panel Admin
          </button>
        )}

        {optionMenu.map((item, index) => (
          <button
            key={index}
            className={`w-full p-2 rounded-lg transition ${
              selectedInstrument === item.precipitacion
                ? "bg-blue-600"
                : "hover:bg-blue-700"
            }`}
            onClick={() => setSelectedInstrument(item.precipitacion)}
          >
            Ver {item.instrumento}
          </button>
        ))}
        
      </div>

      <div className="mt-auto">
        <button
          className="w-full bg-green-600 p-2 rounded-lg hover:bg-green-700"
          onClick={showLoginForm}
        >
          Login
        </button>
      </div>
    </div>
  );

  const renderMainContent = () =>
    showAdminUI ? (
      <Dashboard setShowAdminUI={setShowAdminUI} />
    ) : (
      <div className="flex-1">
        <MapHTML position={sitios} />
      </div>
    );

  return (
    <div className="flex h-screen">
      {showLogin ? (
        <Login
          handlePassword={handlePassword}
          password={password}
          hideLoginForm={hideLoginForm}
          handleSavePassword={handleSavePassword}
        />
      ) : (
        <>
          {renderSidebar()}
          {renderMainContent()}
        </>
      )}
    </div>
  );
};

export default MapContent;
