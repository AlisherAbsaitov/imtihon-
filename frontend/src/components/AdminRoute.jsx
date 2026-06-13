import { Navigate } from 'react-router-dom';
import { useIsAuth, useIsAdmin } from '../store/authStore';

/**
 * Faqat admin role uchun. Texnik topshiriq: admin dashboard faqat admin uchun.
 */
export default function AdminRoute({ children }) {
  const isAuth = useIsAuth();
  const isAdmin = useIsAdmin();

  if (!isAuth) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
