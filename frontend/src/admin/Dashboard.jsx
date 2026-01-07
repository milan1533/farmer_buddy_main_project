import { useEffect, useState } from 'react';
import api from '../assets/api/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ totalUsers: 0, roles: {} });
  const [productCount, setProductCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [ovr, products] = await Promise.all([
          api.get('/admin/overview'),
          api.get('/product/all'),
        ]);
        setOverview({
          totalUsers: ovr.data?.data?.totalUsers || 0,
          roles: ovr.data?.data?.roles || {},
        });
        setProductCount(Array.isArray(products.data) ? products.data.length : (products.data?.data?.length || 0));
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm">{error}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <div className="text-sm text-gray-500 dark:text-gray-400">Users</div>
          <div className="mt-2 text-2xl font-bold">{loading ? '—' : overview.totalUsers}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <div className="text-sm text-gray-500 dark:text-gray-400">Products</div>
          <div className="mt-2 text-2xl font-bold">{loading ? '—' : productCount}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <div className="text-sm text-gray-500 dark:text-gray-400">Admins</div>
          <div className="mt-2 text-2xl font-bold">{loading ? '—' : (overview.roles?.admin || 0)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <div className="text-sm text-gray-500 dark:text-gray-400">Farmers</div>
          <div className="mt-2 text-2xl font-bold">{loading ? '—' : (overview.roles?.farmer || 0)}</div>
        </div>
      </div>
    </div>
  );
}
