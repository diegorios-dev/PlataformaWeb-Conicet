import { useEffect, useState } from "react";

export function useWelcomeMessage(isLogin: boolean) {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const isNewLogin = sessionStorage.getItem('newLogin');
    if (isLogin && isNewLogin === 'true') {
      setShowWelcome(true);
      sessionStorage.removeItem('newLogin');
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLogin]);

  return showWelcome;
}
