import { useState } from "react";
import { getUser } from "../services/userService"; // 👈 agregar servicio
import useSitio from "../hooks/useSitio"
import MapHTML from "./MapHTML";
import useInstrument from "../hooks/useInstrument";
import Dashboard from "./Dashboard";
import Login  from "./Login";

const MapContent = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("nieve");
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [showAdminUI, setShowAdminUI] = useState(false);

  const sitios = useSitio(selectedInstrument)
  const optionMenu = useInstrument()

  // validar password contra backend
  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault(); // evitar refresh de página
    try {
      const data = await getUser(password);
      setUser(data.user);
      setShowLogin(false); // cerrar login al validar
      console.log("Usuario validado:", data.user);
    } catch (error) {
      alert("Contraseña inválida");
      console.error("Error al validar usuario:", error);
    }
  };

  return (
    <div className="flex h-screen">

      {showLogin ? (

        <Login handlePassword={handlePassword} password={password} setShowLogin={setShowLogin} setPassword={setPassword} ></Login>

      ) : (
        <>
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6">Herramientas</h2>

              {/* 🔹 Opción extra solo para admins */}
              {user?.rol === "admin" && (
                <button
                  className="w-full mt-4 p-2 rounded-lg bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowAdminUI(true)} // ejemplo: mostrar UI admin
                >
                  Panel Admin
                </button>
              )}

              {optionMenu.map((item, index) => (
                <button
                  key={index}
                  className={`w-full p-2 rounded-lg transition ${selectedInstrument === item.precipitacion
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
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            </div>
          </div>

          {showAdminUI ? (
            <Dashboard setShowAdminUI={setShowAdminUI}></Dashboard>
          ) : (
            <div className="flex-1">
              <MapHTML position={sitios} />
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default MapContent;
