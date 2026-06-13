import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';

/**
 * Mahsulotlar ro'yxati.
 * - loading / error / empty holatlari to'liq qayta ishlangan
 * - real-time: har 15 soniyada polling qiladi (Texnik topshiriq Frontend: real-time)
 */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data.products);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(true);
    // Polling — background'da jim yangilanadi
    const interval = setInterval(() => fetchProducts(false), 15000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  if (loading) return <Loader label="Mahsulotlar yuklanmoqda..." />;

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => fetchProducts(true)}
          className="mt-3 rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-slate-500">
        Hozircha mahsulotlar yo'q.
      </p>
    );
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Mahsulotlar</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li
            key={p._id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow"
          >
            <h2 className="font-semibold text-slate-900">{p.name}</h2>
            {p.description && (
              <p className="mt-1 text-sm text-slate-500">{p.description}</p>
            )}
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-brand">
                {p.price.toLocaleString()} so'm
              </span>
              <span
                className={`text-xs ${
                  p.stock > 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {p.stock > 0 ? `Zaxira: ${p.stock}` : 'Tugagan'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
