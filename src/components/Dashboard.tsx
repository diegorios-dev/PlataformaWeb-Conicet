import { useState } from "react";
import ShowReport from "../components/ShowReport";
import FormEditReport from "./FormEditReport";
// Importar los otros formularios cuando los tengas

const Dashboard = ({ setShowAdminUI }: any) => {
  const [currentView, setCurrentView] = useState<"menu" | "reportes" | "editReporte" | "usuarios" | "instrumentos">("menu");

  const handleShowEditFormReport = (reporte) => {
    setCurrentView("editReporte")

  }

  return (
    <div className="flex-1 p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>

      {currentView === "menu" && (
        <>
          <button
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ver usuario
          </button>

          <button
            onClick={() => setCurrentView("reportes")}
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Administrar Reportes
          </button>

          <button
            onClick={() => setCurrentView("usuarios")}
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Agregar usuarios
          </button>

          <button
            onClick={() => setCurrentView("instrumentos")}
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Agregar Instrumentos
          </button>
        </>
      )}

      {currentView === "reportes" && (
        <ShowReport handleShowEditFormReport={handleShowEditFormReport} />
      )}

      {currentView === "editReporte" && (
        <FormEditReport setCurrentView={setCurrentView}></FormEditReport>
      )}

      {currentView === "usuarios" && (
        <div>
          <h3 className="text-lg font-bold">Gestión de Usuarios</h3>
          {/* Tu formulario de usuarios */}
          <button
            onClick={() => setCurrentView("menu")}
            className="mt-4 p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Volver al Menú
          </button>
        </div>
      )}

      {currentView === "instrumentos" && (
        <div>
          <h3 className="text-lg font-bold">Gestión de Instrumentos</h3>
          {/* Tu formulario de instrumentos */}
          <button
            onClick={() => setCurrentView("menu")}
            className="mt-4 p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Volver al Menú
          </button>
        </div>
      )}

      <button
        onClick={() => setShowAdminUI(false)}
        className="mt-6 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Cerrar Panel Admin
      </button>
    </div>
  );
};

export default Dashboard;
