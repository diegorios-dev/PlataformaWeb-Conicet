import { useNavigate } from "react-router-dom";

const useNavegation = () => {
  const navigate = useNavigate();

  const goHome = () => navigate("/")

  const goAdminUi = () => navigate("/dashboard")

  const goLogin = () => navigate("/login") 
    
    return (
        {
            goHome , goAdminUi , goLogin
        }
    )
}

export default useNavegation