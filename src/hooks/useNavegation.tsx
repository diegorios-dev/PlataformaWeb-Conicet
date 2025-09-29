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

  const goEditReport = (report) => {
    handleSelectReport(report)
    navigate("/dashboard/administration/report/edit")
  } 


    return (
        {
            goHome , goAdminUi , goLogin , goReports , goConfigUsers , goEditReport
        }
    )
}

export default useNavegation