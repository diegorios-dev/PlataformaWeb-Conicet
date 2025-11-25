import { useCallback } from "react";
import { useAuth } from "@features/auth";
import { useNavegation } from "@shared/hooks";

export function useLogout() {
  const { handleLogout } = useAuth();
  const { go } = useNavegation();

  return useCallback(() => {
    handleLogout();
    go.login();
  }, [handleLogout, go.login]);
}
