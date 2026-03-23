
// src/pages/Dashboard.tsx (or wherever your Dashboard component is)
import React, { useState, useEffect } from 'react';
import { dashboardApi, listingsApi } from '../services/api';

export default function Dashboard() {
  const [kpi, setKpi] = useState({
    totalListings: 0,
    pendingListings: 0,
    activeListings: 0,
    soldListings: 0,
    rejectedListings: 0
  });
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get all listings
      const allListings = await listingsApi.getAll();
      
      // Calculate KPIs
      const totalListings = allListings.length;
      const pendingListings = allListings.filter(l => l.status === 'pending').length;
      const activeListings = allListings.filter(l => l.status === 'active').length;
      const soldListings = allListings.filter(l => l.status === 'sold').length;
      const rejectedListings = allListings.filter(l => l.status === 'rejected').length;
      
      setKpi({
        totalListings,
        pendingListings,
        activeListings,
        soldListings,
        rejectedListings
      });
      
      // Get recent listings (last 5)
      const recent = allListings
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentListings(recent);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" style={{ borderColor: '#FF6A00' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl p-5 border" style={{ background: 'white', borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Listings</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#FF6A00' }}>{kpi.totalListings}</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#FFF1E6' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2">
                <path d="M20 7h-4.18A3 3 0 0013 4h-2a3 3 0 00-2.82 2H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M12 11a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl p-5 border" style={{ background: 'white', borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#F59E0B' }}>{kpi.pendingListings}</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <path d="M12 8v4l3 3 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl p-5 border" style={{ background: 'white', borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#10B981' }}>{kpi.activeListings}</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#D1FAE5' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl p-5 border" style={{ background: 'white', borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sold</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#8B5CF6' }}>{kpi.soldListings}</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#EDE9FE' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Listings */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#E2E8F0' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#E2E8F0' }}>
          <h3 className="font-semibold">Recent Listings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E2E8F0' }}>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Product</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Seller</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Price</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentListings.map((listing) => (
                <tr key={listing._id} className="border-b hover:bg-gray-50" style={{ borderColor: '#E2E8F0' }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {listing.imageUrls?.[0] ? (
                        <img src={listing.imageUrls[0]} alt={listing.title} className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2">
                            <path d="M20 7h-4.18A3 3 0 0013 4h-2a3 3 0 00-2.82 2H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M12 11a2 2 0 100 4 2 2 0 000-4z" />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm truncate max-w-[150px]">{listing.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{listing.sellerName}</td>
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: '#FF6A00' }}>GH₵{listing.price}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      listing.status === 'active' ? 'bg-green-100 text-green-800' :
                      listing.status === 'sold' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}