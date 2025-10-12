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

  const goAHistograma = () => navigate("/histograma")


  const goEditReport = (report: any) => {
    handleSelectReport(report)
    navigate("/dashboard/administration/report/edit")
  } 

  const goAddUser = () => {
    navigate("/dashboard/administration/user/add")
  }
   const goBack = () => navigate(-1);


    return (
        {
            goHome , goAdminUi , goLogin , goReports , goConfigUsers , goEditReport , goAddUser , goBack, goAddZona , goAHistograma
        }
    )
}

export default useNavegation