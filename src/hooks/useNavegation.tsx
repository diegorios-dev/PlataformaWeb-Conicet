import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useCallback } from "react";

const useNavegation = () => {  
  const {handleSelectReport} = useUserContext();
  
  const navigate = useNavigate();

  // ⚡ Memorizar todas las funciones de navegación
  const goHome = useCallback(() => navigate("/"), [navigate]);

  const goAdminUi = useCallback(() => navigate("/dashboard"), [navigate]);

  const goLogin = useCallback(() => navigate("/login"), [navigate]);

  const goReports = useCallback(() => navigate("/dashboard/administration/report"), [navigate]);

  const goConfigUsers = useCallback(() => navigate("/dashboard/administration/user"), [navigate]);

  const goAddZona = useCallback(() => navigate("/dashboard/Zona/FormAddZona.tsx"), [navigate]);

  const goHeatMap = useCallback(() => navigate("/components/MapHeatView.tsx"), [navigate]);

  const goAHistograma = useCallback(() => navigate("/histograma"), [navigate]);

   const goAddSite = useCallback(() => navigate("/dashboard/site/add"), [navigate]);

   const goExportExcel = useCallback(() => navigate("/dashboard/export/excel"), [navigate]);

   const goImportExcel = useCallback(() => navigate("/dashboard/import/excel"), [navigate]);

   const goEstadisticas = () => navigate("/estadisticas")

   const goAddRotura = useCallback(() => navigate("/dashboard/administration/report/rotura/add"), [navigate]);

   const goResolveRotura = useCallback(() => navigate("/dashboard/administration/report/rotura/resolve"), [navigate]);


  const goEditReport = (report: any) => {
    handleSelectReport(report)
    navigate("/dashboard/administration/report/edit")
  } 

  const goAddUser = () => {
    navigate("/dashboard/administration/user/add")
  }
  
  const goBack = () => {
    const currentPath = window.location.pathname;
    
    // Usar las funciones go existentes de forma estática
    if (currentPath.includes("/dashboard/administration/report/edit")) {
      goReports();
    } else if (currentPath.includes("/dashboard/administration/user/add")) {
      goConfigUsers();
    } else if (currentPath.includes("/dashboard/administration/user") || 
               currentPath.includes("/dashboard/administration/report")) {
      goAdminUi();
    } else if (currentPath.includes("/estadisticas")) {
      goAdminUi(); // Estadísticas ahora vuelve al dashboard
    } else if (currentPath.includes("/dashboard/site/add")) {
      goAdminUi();
    } else if (currentPath.includes("/dashboard/Zona")) {
      goAdminUi();
    } else if (currentPath.includes("/dashboard/import/excel")) {
      goAdminUi();
    } else if (currentPath.includes("/dashboard/export/excel")) {
      goAdminUi();
    } else if (currentPath.includes("/dashboard")) {
      goHome();
    } else if (currentPath.includes("/histograma") || 
               currentPath.includes("/MapHeatView")) {
      goHome();
    } else if (currentPath.includes("/login")) {
      goHome();
    } else {
      goHome();
    }
  };


    return (
        {
            goHome , goAdminUi , goLogin , goReports , goConfigUsers , goEditReport , goAddUser , goBack, goAddZona , goAHistograma, goHeatMap, goAddSite, goEstadisticas , goExportExcel , goImportExcel, goAddRotura, goResolveRotura
        }
    )
}

export default useNavegation