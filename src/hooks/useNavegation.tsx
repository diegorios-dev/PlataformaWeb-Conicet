import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const useNavegation = () => {  
  const {handleSelectReport} = useUserContext();
  
  const navigate = useNavigate();

  const goHome = () => navigate("/")

  const goAdminUi = () => navigate("/dashboard")

  const goLogin = () => navigate("/login") 

  const goReports = () => navigate("/dashboard/administration/report") 

  const goConfigUsers = () => navigate("/dashboard/administration/user")

  const goAddZona = () => navigate("/dashboard/Zona/FormAddZona.tsx")

  const goHeatMap = () => navigate("/components/MapHeatView.tsx")

  const goAHistograma = () => navigate("/histograma")

   const goAddSite = () => navigate("/dashboard/site/add");

   const goExcelImport = () => navigate("/dashboard/import/excel");

   const goEstadisticas = () => navigate("/estadisticas")

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
    } else if (currentPath.includes("/dashboard/site/add")) {
      goAdminUi();
    } else if (currentPath.includes("/dashboard/Zona")) {
      goAdminUi();
    } else if (currentPath.includes("/dashboard/import/excel")) {
      goAdminUi();
    } else if (currentPath.includes("/dashboard")) {
      goHome();
    } else if (currentPath.includes("/histograma") || 
               currentPath.includes("/estadisticas") || 
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
            goHome , goAdminUi , goLogin , goReports , goConfigUsers , goEditReport , goAddUser , goBack, goAddZona , goAHistograma, goHeatMap, goAddSite, goEstadisticas , goExcelImport 
        }
    )
}

export default useNavegation