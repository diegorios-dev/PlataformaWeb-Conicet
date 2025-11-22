import { useCallback } from "react";
import { useUserContext } from "../../../context/UserContext";
import useNavegation from "../../../hooks/useNavegation";

export function useLogout() {
  const { handleLogout } = useUserContext();
  const { go } = useNavegation();

  return useCallback(() => {
    handleLogout();
    go.login();
  }, [handleLogout, go.login]);
}
