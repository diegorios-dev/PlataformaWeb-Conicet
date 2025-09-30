import { useState } from "react";
import useNavegation from "../../hooks/useNavegation";

const Dashboard = () => {
  
  const [currentView, setCurrentView] = useState<"menu" | "instrumentos">("menu");

  const {goHome , goReports , goConfigUsers, goBack} = useNavegation()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="p-4">
        <button
          onClick={goBack}
           className="px-6 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-950 transition font-semibold text-base"
        >
          Volver
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center tracking-tight">
            Panel de Administración
          </h2>

          {currentView === "menu" && (
            <div className="flex flex-col gap-4">
              <button
                onClick={goReports}
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Administrar Reportes
              </button>

              <button
                onClick={goConfigUsers}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Gestión Usuarios
              </button>

              <button
                onClick={() => setCurrentView("instrumentos")}
                className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Agregar una zona
              </button>
            </div>
          )}

          <button
            onClick={goHome}
            className="w-full mt-8 py-3 px-4 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Cerrar Panel Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
