import { useState } from "react";
import useNavegation from "../../hooks/useNavegation";
import BackButton from "../BackButton";
const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"menu" | "instrumentos">("menu");
  const { goHome, goReports, goConfigUsers, goBack, goAddZona } = useNavegation();

  return (
    <div className="min-h-screen  flex flex-col w-full ">
      <div className="p-10">
        <BackButton />
      </div>
     
      <div className="flex flex-1 items-center justify-center ">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 border border-blue-200 ">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-10 text-center tracking-tight drop-shadow-lg">
            Panel de Administración
          </h2>

          {currentView === "menu" && (
            <div className="flex flex-col gap-6">
              <button
                onClick={goReports}
                className="w-full py-4 px-6 bg-blue-100 text-blue-900 font-semibold rounded-full shadow-md hover:bg-blue-200 transition focus:outline-none focus:ring-4 focus:ring-blue-300 border border-blue-200"
              >
                Administrar Reportes
              </button>

              <button
                onClick={goConfigUsers}
                className="w-full py-4 px-6 bg-indigo-100 text-indigo-900 font-semibold rounded-full shadow-md hover:bg-indigo-200 transition focus:outline-none focus:ring-4 focus:ring-indigo-300 border border-indigo-200"
              >
                Gestión Usuarios
              </button>

              <button
                onClick={goAddZona}
                className="w-full py-4 px-6 bg-green-100 text-green-900 font-semibold rounded-full shadow-md hover:bg-green-200 transition focus:outline-none focus:ring-4 focus:ring-green-300 border border-green-200"
              >
                Agregar Zona
              </button>
            </div>
          )}

          <button
            onClick={goHome}
            className="w-full mt-10 py-4 px-6 bg-red-100 text-red-900 font-bold rounded-full shadow-lg hover:bg-red-200 transition focus:outline-none focus:ring-4 focus:ring-red-300 border border-red-200"
          >
            Cerrar Panel Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
