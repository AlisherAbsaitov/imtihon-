import { Link } from 'react-router-dom';

/**
 * 404 sahifa.
 */
export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-xl font-semibold text-slate-900">
        Sahifa topilmadi
      </h1>
      <p className="mt-2 text-slate-500">
        Siz qidirgan sahifa mavjud emas yoki ko'chirilgan.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-brand px-5 py-2.5 font-medium text-white hover:bg-brand-dark"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
