import { useEffect, useState } from "react";
import { storageService } from '@shared/services';

export function useWelcomeMessage(isLogin: boolean) {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const isNewLogin = storageService.getNewLogin();
    if (isLogin && isNewLogin) {
      setShowWelcome(true);
      storageService.removeNewLogin();
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLogin]);

  return showWelcome;
}
