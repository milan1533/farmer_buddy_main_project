import { useEffect, useState } from 'react';
import api from '../assets/api/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data?.data || []);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Users</h2>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm">{error}</div>
      )}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">Manage platform users here.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-4 text-gray-500" colSpan={4}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td className="py-4 text-gray-500" colSpan={4}>No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-t border-gray-200 dark:border-gray-800">
                    <td className="py-2 pr-4">{u.name}</td>
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4">{u.role}</td>
                    <td className="py-2 pr-4">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
