import { useCallback } from "react";
import { useAuth } from "@features/auth";
import { useNavegation } from "@shared/hooks";
import { storageService } from "@shared/services";

export function useLogout() {
  const { handleLogout, getUsername } = useAuth();
  const { go } = useNavegation();

  return useCallback(() => {
    // Guardar nombre de usuario antes de hacer logout
    const username = getUsername();
    sessionStorage.setItem('logoutUsername', username);
    
    // Marcar que debe mostrar notificación
    storageService.setShowLogoutNotif();
    
    handleLogout();
    go.login();
  }, [handleLogout, getUsername, go]);
}
