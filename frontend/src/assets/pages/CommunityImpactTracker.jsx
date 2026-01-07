import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { 
  FiTrendingUp, 
  FiDroplet, 
  FiThermometer, 
  FiUsers, 
  FiMapPin,
  FiAward,
  FiStar,
  FiHeart,
  FiTarget,
  FiBarChart,
  FiCalendar,
  FiShare2,
  FiDownload,
  FiGift,
  FiCheckCircle,
  FiAlertCircle,
  FiZap,
  FiGlobe,
  FiSun
} from 'react-icons/fi';

const CommunityImpactTracker = () => {
  const [overview, setOverview] = useState({ totalUsers: 0, roles: {} });
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [ovr, products] = await Promise.all([
          api.get('/admin/overview-public'),
          api.get('/product/all'),
        ]);
        setOverview({
          totalUsers: ovr.data?.data?.totalUsers || 0,
          roles: ovr.data?.data?.roles || {},
        });
        setProductCount(Array.isArray(products.data) ? products.data.length : (products.data?.data?.length || 0));
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load live impact');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const roles = overview.roles || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            🌍 Community Impact Tracker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Track your environmental impact, support local farmers, and earn sustainability badges
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm mb-6">{error}</div>
        )}

        {/* Impact Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {loading ? '—' : overview.totalUsers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Platform members</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FiBarChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Products Listed</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {loading ? '—' : productCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Marketplace items</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <FiTarget className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Role Breakdown</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Admins</span><span>{loading ? '—' : (roles.admin || 0)}</span></div>
              <div className="flex justify-between"><span>Farmers</span><span>{loading ? '—' : (roles.farmer || 0)}</span></div>
              <div className="flex justify-between"><span>Consumers</span><span>{loading ? '—' : (roles.consumer || 0)}</span></div>
              <div className="flex justify-between"><span>Restaurants</span><span>{loading ? '—' : (roles.restaurant || 0)}</span></div>
            </div>
          </div>
        </div>
        {/* No mock charts/badges; only live platform metrics shown */}
      </div>
    </div>
  );
};

export default CommunityImpactTracker;
