import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore, useIsAuth, useIsAdmin } from '../store/authStore';

/**
 * Yuqori navigatsiya paneli.
 * Auth holatiga qarab linklarni ko'rsatadi/yashiradi.
 */
export default function Navbar() {
  const isAuth = useIsAuth();
  const isAdmin = useIsAdmin();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-brand">
          MyShop
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Bosh sahifa
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Mahsulotlar
          </NavLink>

          {isAuth && (
            <NavLink to="/profile" className={linkClass}>
              Profil
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}

          {isAuth ? (
            <button
              onClick={handleLogout}
              className="ml-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Chiqish{user ? ` (${user.name})` : ''}
            </button>
          ) : (
            <NavLink
              to="/login"
              className="ml-2 rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Kirish
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
