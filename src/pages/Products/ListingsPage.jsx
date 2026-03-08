
// /home/richmond/Downloads/unimart-admin (1)/app/unimart-admin/src/pages/Products/ListingPage.jsx

import React, { useState, useEffect } from 'react';
import { listingApi } from '../../services/listingsApi.ts';
import { format } from 'date-fns';

const COLORS = {
  primary: '#FF6A00',
  primaryLight: '#FFF1E6',
  primaryGradient: 'linear-gradient(135deg, #FF8A3C, #FF6A00)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  text: '#1B1B1F',
  subtext: '#6B7280',
  border: '#EEEEEE',
  surface: '#F8F9FA',
  background: '#FFFFFF',
};

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    sold: 0,
    archived: 0,
    totalValue: 0,
    students: 0,
    vendors: 0
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchListings();
  }, [filter, categoryFilter, userTypeFilter, pagination.page]);

  useEffect(() => {
    calculateStats(listings);
  }, [listings]);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (filter !== 'all') params.status = filter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (userTypeFilter !== 'all') params.userType = userTypeFilter;
      if (search) params.search = search;
      
      console.log('Fetching with params:', params);
      const response = await listingApi.getListings(params);
      
      if (response.success) {
        setListings(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || response.data?.length || 0,
          pages: response.pagination?.pages || 1
        }));
      } else {
        setError(response.error || 'Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(error.message || 'Network error - is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      active: data.filter(l => l.status === 'active').length,
      sold: data.filter(l => l.status === 'sold').length,
      archived: data.filter(l => l.status === 'archived').length,
      totalValue: data.reduce((sum, l) => sum + (l.price || 0), 0),
      students: data.filter(l => l.userType === 'student').length,
      vendors: data.filter(l => l.userType === 'vendor').length
    };
    setStats(stats);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await listingApi.updateStatus(id, newStatus);
      if (response.success) {
        // Update local state
        setListings(listings.map(listing => 
          listing._id === id ? { ...listing, status: newStatus } : listing
        ));
        // Show success message (you can add a toast notification here)
        console.log('Status updated successfully');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const response = await listingApi.deleteListing(id);
      if (response.success) {
        setListings(listings.filter(listing => listing._id !== id));
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchListings();
  };

  const handleRefresh = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchListings();
  };

  const categories = ['all', 'Electronics', 'Fashion', 'Books', 'Home & Furniture', 'Other'];
  const userTypes = ['all', 'student', 'vendor'];

  return (
    <div className="p-6" style={{ background: COLORS.surface, minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Product Listings</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.subtext }}>
          Manage all product listings from the marketplace
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Listings" 
          value={stats.total} 
          color={COLORS.primary}
          icon="📦"
          subtitle={`${stats.active} active · ${stats.sold} sold`}
        />
        <StatCard 
          title="Active" 
          value={stats.active} 
          color={COLORS.success}
          icon="✅"
          subtitle={`GH₵${stats.totalValue.toFixed(2)} value`}
        />
        <StatCard 
          title="Sold" 
          value={stats.sold} 
          color={COLORS.warning}
          icon="💰"
          subtitle={`${stats.archived} archived`}
        />
        <StatCard 
          title="Sellers" 
          value={`${stats.students} · ${stats.vendors}`} 
          color={COLORS.text}
          icon="👥"
          subtitle={`${stats.students} students · ${stats.vendors} vendors`}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border mb-6 p-4" style={{ borderColor: COLORS.border }}>
        <div className="flex flex-wrap gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{ borderColor: COLORS.border }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{ borderColor: COLORS.border }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{ borderColor: COLORS.border }}
          >
            {userTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Sellers' : type === 'student' ? 'Students' : 'Vendors'}
              </option>
            ))}
          </select>

          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search by title, seller, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ borderColor: COLORS.border }}
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ background: COLORS.primary }}
            >
              Search
            </button>
          </form>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            style={{ borderColor: COLORS.border }}
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: COLORS.border }}>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: COLORS.primary }}></div>
            <p className="mt-2" style={{ color: COLORS.subtext }}>Loading listings...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                  {listings.map((listing) => (
                    <tr key={listing._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {listing.imageUrls?.[0] && (
                            <img
                              src={listing.imageUrls[0]}
                              alt={listing.title}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          <div>
                            <div className="font-medium" style={{ color: COLORS.text }}>
                              {listing.title}
                            </div>
                            <div className="text-sm" style={{ color: COLORS.subtext }}>
                              {listing.category} {listing.brand && `· ${listing.brand}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium" style={{ color: COLORS.text }}>
                          {listing.sellerName}
                        </div>
                        <div className="text-sm" style={{ color: COLORS.subtext }}>
                          {listing.sellerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium" style={{ color: COLORS.primary }}>
                          GH₵{listing.price?.toFixed(2)}
                        </div>
                        {listing.discount > 0 && (
                          <div className="text-xs text-green-600">
                            {listing.discount}% off
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={listing.status}
                          onChange={(e) => handleStatusChange(listing._id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer
                            ${listing.status === 'active' ? 'bg-green-100 text-green-700' : 
                              listing.status === 'sold' ? 'bg-blue-100 text-blue-700' : 
                              'bg-gray-100 text-gray-700'}`}
                        >
                          <option value="active">Active</option>
                          <option value="sold">Sold</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full
                          ${listing.userType === 'student' ? 'bg-purple-100 text-purple-700' : 
                            'bg-orange-100 text-orange-700'}`}>
                          {listing.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: COLORS.subtext }}>
                        {format(new Date(listing.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedListing(listing)}
                          className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 mr-2 transition-colors"
                          style={{ color: COLORS.primary }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: COLORS.error }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {listings.length === 0 && !loading && (
              <div className="text-center py-12" style={{ color: COLORS.subtext }}>
                No listings found
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-3 border-t flex items-center justify-between"
                style={{ borderColor: COLORS.border, background: COLORS.surface }}>
                <div className="text-sm" style={{ color: COLORS.subtext }}>
                  Showing page {pagination.page} of {pagination.pages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    style={{ borderColor: COLORS.border }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    style={{ borderColor: COLORS.border }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, color, icon, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium" style={{ color: COLORS.subtext }}>{title}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {subtitle && (
        <p className="text-xs mt-1" style={{ color: COLORS.subtext }}>{subtitle}</p>
      )}
    </div>
  );
}

function ListingDetailsModal({ listing, onClose, onStatusChange, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>Listing Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          {/* Product Images */}
          {listing.imageUrls?.length > 0 && (
            <div className="mb-6">
              <label className="text-xs font-medium block mb-2" style={{ color: COLORS.subtext }}>
                Product Images
              </label>
              <div className="grid grid-cols-4 gap-2">
                {listing.imageUrls.map((url, i) => (
                  <img key={i} src={url} alt={`Product ${i+1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                    style={{ borderColor: COLORS.border }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Title" value={listing.title} />
            <DetailField label="Price" value={`GH₵${listing.price?.toFixed(2)}`} highlight />
            <DetailField label="Category" value={listing.category} />
            <DetailField label="Subcategory" value={listing.subcategory} />
            <DetailField label="Brand" value={listing.brand} />
            <DetailField label="Condition" value={listing.condition} />
            <DetailField label="Condition Notes" value={listing.conditionNotes} fullWidth />
            <DetailField label="Location" value={listing.location} />
            <DetailField label="Delivery" value={listing.deliveryType === 'self' ? 'Self Pickup' : 'Uni-Mart Riders'} />
            <DetailField label="Payment" value={listing.paymentMethod === 'mtn' ? 'MTN MoMo' : 'Telecel Cash'} />
            <div className="col-span-2">
              <label className="text-xs font-medium" style={{ color: COLORS.subtext }}>Description</label>
              <p className="mt-1 text-sm p-3 bg-gray-50 rounded-lg" style={{ color: COLORS.text }}>
                {listing.description}
              </p>
            </div>
            <DetailField label="Tags" value={listing.tags?.join(', ')} fullWidth />
            {listing.edition && <DetailField label="Edition" value={listing.edition} />}
            {listing.confidence && (
              <DetailField 
                label="AI Confidence" 
                value={`${Math.round(listing.confidence * 100)}%`}
                color={listing.confidence > 0.7 ? COLORS.success : COLORS.warning}
              />
            )}
          </div>

          {/* Seller Info */}
          <div className="mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
            <h3 className="font-medium mb-3" style={{ color: COLORS.text }}>Seller Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Name" value={listing.sellerName} />
              <DetailField label="Email" value={listing.sellerEmail} />
              <DetailField label="Phone" value={listing.sellerPhone} />
              <DetailField label="Business" value={listing.businessName} />
              <DetailField label="Type" value={listing.userType} />
              <DetailField label="Location" value={listing.location} />
            </div>
          </div>

          {/* Admin Notes */}
          {listing.adminNotes && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
              <h3 className="font-medium mb-2" style={{ color: COLORS.text }}>Admin Notes</h3>
              <p className="text-sm p-3 bg-yellow-50 rounded-lg">{listing.adminNotes}</p>
            </div>
          )}

          {/* Admin Actions */}
          <div className="mt-6 pt-4 border-t flex gap-2" style={{ borderColor: COLORS.border }}>
            {listing.status === 'active' && (
              <button
                onClick={() => {
                  onStatusChange(listing._id, 'sold');
                  onClose();
                }}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: COLORS.success }}
              >
                Mark as Sold
              </button>
            )}
            {listing.status !== 'archived' && (
              <button
                onClick={() => {
                  onStatusChange(listing._id, 'archived');
                  onClose();
                }}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: COLORS.warning }}
              >
                Archive
              </button>
            )}
            <button
              onClick={() => {
                onDelete(listing._id);
                onClose();
              }}
              className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ background: COLORS.error }}
            >
              Delete Permanently
            </button>
          </div>

          {/* Metadata */}
          <div className="mt-4 text-xs text-right" style={{ color: COLORS.subtext }}>
            Created: {format(new Date(listing.createdAt), 'PPP p')}
            {listing.updatedAt && listing.updatedAt !== listing.createdAt && (
              <> · Updated: {format(new Date(listing.updatedAt), 'PPP p')}</>
            )}
            {listing.featured && <span className="ml-2 text-yellow-600">⭐ Featured</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, fullWidth, highlight, color }) {
  if (!value && value !== 0) return null;
  
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="text-xs font-medium" style={{ color: COLORS.subtext }}>{label}</label>
      <p className="mt-1 text-sm" style={{ 
        color: color || (highlight ? COLORS.primary : COLORS.text),
        fontWeight: highlight ? '500' : 'normal'
      }}>
        {value}
      </p>
    </div>
  );
}