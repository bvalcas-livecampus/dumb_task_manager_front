import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // For /admin route, check if user has admin role
  if (location.pathname === '/admin' && user?.role !== 'admin' && user?.role !== 'superAdmin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated (and authorized for admin), render child routes with header
  return (
        <Outlet />
  );
};

export default ProtectedRoutes;
