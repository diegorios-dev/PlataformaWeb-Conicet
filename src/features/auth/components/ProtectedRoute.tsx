import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tokenService } from '@shared/services';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route component with JWT authentication
 * Redirects to login if user is not authenticated or JWT token is missing
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  
  const { isLogin, isCheckingAuth } = useAuth();
  const hasToken = tokenService.hasToken();

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated or no JWT token
  if (!isLogin || !hasToken) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and has token, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
