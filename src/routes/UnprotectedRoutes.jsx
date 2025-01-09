import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../auth/AuthContext';

const UnprotectedRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default UnprotectedRoutes;
