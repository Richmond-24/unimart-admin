// admin-site/src/pages/Dashboard/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import {listingApi} from '../../services/listingsApi.ts';
import { Link } from 'react-router-dom';

const COLORS = {
  primary: '#FF6A00',
  primaryLight: '#FFF1E6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  text: '#1B1B1F',
  subtext: '#6B7280',
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await listingApi.getStats();
      setStats(response.data.stats);
      setRecentListings(response.data.recentActivity || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primary }}></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>Dashboard Overview</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.subtext }}>
        Welcome back! Here's what's happening with your marketplace.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Listings"
          value={stats?.total || 0}
          change="+12%"
          icon="📦"
        />
        <StatCard
          title="Active Listings"
          value={stats?.active || 0}
          change="+5%"
          icon="✅"
        />
        <StatCard
          title="Sold Items"
          value={stats?.sold || 0}
          change="+23%"
          icon="💰"
        />
        <StatCard
          title="Total Value"
          value={`GH₵${(stats?.totalValue || 0).toFixed(2)}`}
          change="+18%"
          icon="💵"
        />
      </div>

      {/* Recent Listings */}
      <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: '#EEEEEE' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>Recent Listings</h2>
        <div className="space-y-3">
          {recentListings.map((listing) => (
            <Link
              key={listing._id}
              to="/products"
              className="block p-4 hover:bg-gray-50 rounded-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium" style={{ color: COLORS.text }}>{listing.title}</h3>
                  <p className="text-sm" style={{ color: COLORS.subtext }}>
                    by {listing.sellerName} · GH₵{listing.price.toFixed(2)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {listing.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: '#EEEEEE' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {change && (
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>{value}</p>
    </div>
  );
}