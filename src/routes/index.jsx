import { Navigate } from 'react-router';

export default function RedirectToLogin() {
  return <Navigate to="/login" replace />;
}

