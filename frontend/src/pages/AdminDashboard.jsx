import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';

/**
 * Admin dashboard — statistika + foydalanuvchilar.
 * Faqat admin role ko'ra oladi (AdminRoute guard orqali).
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // Ikkala so'rovni parallel yuboramiz (tezroq)
        const [statsRes, usersRes] = await Promise.all([
          api.get('/stats'),
          api.get('/users'),
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader label="Dashboard yuklanmoqda..." />;

  if (error) {
    return (
      <p className="rounded-md bg-red-50 px-4 py-3 text-red-700" role="alert">
        {error}
      </p>
    );
  }

  const cards = [
    { label: 'Foydalanuvchilar', value: stats.users },
    { label: 'Mahsulotlar', value: stats.products },
    { label: 'Buyurtmalar', value: stats.orders },
    { label: 'Tushum', value: `${stats.revenue.toLocaleString()} so'm` },
  ];

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Admin Dashboard</h1>

      {/* Statistika kartalari */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Foydalanuvchilar jadvali */}
      <h2 className="mb-3 mt-10 text-lg font-semibold text-slate-900">
        Foydalanuvchilar
      </h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Ism</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      u.role === 'admin'
                        ? 'bg-brand/10 text-brand'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
