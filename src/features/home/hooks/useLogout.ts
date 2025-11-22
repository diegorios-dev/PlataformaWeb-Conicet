import { useCallback } from "react";
import { useAuth } from "@context/AuthContext";
import useNavegation from "@hooks/useNavegation";

export function useLogout() {
  const { handleLogout } = useAuth();
  const { go } = useNavegation();

  return useCallback(() => {
    handleLogout();
    go.login();
  }, [handleLogout, go.login]);
}
