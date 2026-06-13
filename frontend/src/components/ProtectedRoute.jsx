import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuth } from '../store/authStore';

/**
 * Faqat tizimga kirgan foydalanuvchilar uchun.
 * Kirmagan bo'lsa — /login ga yo'naltiradi (qaytib kelish uchun joyni eslab qoladi).
 */
export default function ProtectedRoute({ children }) {
  const isAuth = useIsAuth();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
