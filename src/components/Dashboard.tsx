import { useState } from "react";
import ShowReport from "../components/ShowReport";
import FormEditReport from "./FormEditReport";
import useNavegation from "../hooks/useNavegation";
import ViewManagementUsers from "./ViewManagementUsers";

const Dashboard = () => {
  
  const [currentView, setCurrentView] = useState<"menu" | "reports" | "editReport" | "usuarios" | "instrumentos">("menu");
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const {goHome} = useNavegation()

  const handleShowEditFormReport = (reporte) => {
    setSelectedReport(reporte);
    setCurrentView("editReport");
  }

  return (
    <div className="flex-1 p-6 bg-gray-100 h-screen">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>

      {currentView === "menu" && (
        <>
          <button
            onClick={() => setCurrentView("reports")}
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Administrar Reportes
          </button> 

          <button
            onClick={() => setCurrentView("usuarios")}
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Gestion Usuarios
          </button>

          <button
            onClick={() => setCurrentView("instrumentos")}
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Agregar Instrumentos
          </button>
        </>
      )}

      {currentView === "reports" && (
        <ShowReport handleShowEditFormReport={handleShowEditFormReport} />
      )}

      {currentView === "editReport" && (
        <FormEditReport report={selectedReport} setCurrentView={setCurrentView}/>
      )}

      {currentView === "usuarios" && (
        <ViewManagementUsers/>
      )}

      {currentView === "instrumentos" && (
        <div>
          <h3 className="text-lg font-bold">Gestión de Instrumentos</h3>
          {/* Tu formulario de instrumentos */}
          <button onClick={() => setCurrentView("menu")} className="mt-4 p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Volver al Menú
          </button>
        </div>
      )}

      <button onClick={goHome} className="mt-6 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700" >
        Cerrar Panel Admin
      </button>
    </div>
  );
};

export default Dashboard;
