import { useState } from "react";
import useNavegation from "../../hooks/useNavegation";

const Dashboard = () => {
  
  const [currentView, setCurrentView] = useState<"menu" | "instrumentos">("menu");
  
  const {goHome , goReports , goConfigUsers} = useNavegation()

  // const handleShowEditFormReport = (reporte) => {
  //   setSelectedReport(reporte);
  //   setCurrentView("editReport");
  // }

  return (
    <div className="flex-1 p-6 bg-gray-100 h-screen">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>

      {currentView === "menu" && (
        <>
          <button
            onClick={goReports}
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Administrar Reportes
          </button> 

          <button
            onClick={goConfigUsers}
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Gestion Usuarios
          </button>

          <button
            onClick={() => setCurrentView("instrumentos")}
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Agregar una zona
          </button>
        </>
      )}


      <button onClick={goHome} className="mt-6 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700" >
        Cerrar Panel Admin
      </button>
    </div>
  );
};

export default Dashboard;
