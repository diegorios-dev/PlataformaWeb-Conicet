import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente simple para proteger rutas con autenticación
 * Si el usuario NO está logueado, lo redirige al login
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLogin } = useAuth();

  // Si no está logueado, redirigir al login
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, mostrar el componente
  return <>{children}</>;
};

export default ProtectedRoute;
