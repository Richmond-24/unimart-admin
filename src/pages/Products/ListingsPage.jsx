
// /home/richmond/Downloads/unimart-admin/app/unimart-admin/src/pages/Products/ListingsPage.jsx

import React, { useState, useEffect } from 'react';
import { listingApi } from '../../services/listingsApi.js';
import { format } from 'date-fns';

const COLORS = {
  primary: '#FF6A00',
  primaryLight: '#FFF1E6',
  primaryGradient: 'linear-gradient(135deg, #FF8A3C, #FF6A00)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  approved: '#8B5CF6',
  text: '#1B1B1F',
  subtext: '#6B7280',
  border: '#EEEEEE',
  surface: '#F8F9FA',
  background: '#FFFFFF',
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6',
};

// Enhanced category options with section mapping and descriptions
const CATEGORY_OPTIONS = [
  { 
    value: 'Tech Gadgets', 
    label: '💻 Tech Gadgets', 
    section: 'techGadgets', 
    color: '#6366F1', 
    description: 'Appears in Tech Gadgets section - Laptops, phones, headphones, accessories'
  },
  { 
    value: 'Food', 
    label: '🍔 Food & Dining', 
    section: 'food', 
    color: '#10B981', 
    description: 'Appears in Food & Dining section - Meals, groceries, restaurant deliveries'
  },
  { 
    value: 'Services', 
    label: '💼 Student Services', 
    section: 'services', 
    color: '#8B5CF6', 
    description: 'Appears in Student Services section - Tutoring, haircuts, printing, repairs'
  },
  { 
    value: 'Events', 
    label: '🎉 Campus Events', 
    section: 'events', 
    color: '#EF4444', 
    description: 'Appears in Campus Events section (upcoming) - Parties, workshops, seminars, sports'
  },
  { 
    value: 'Second Hand', 
    label: '🔄 Second Hand', 
    section: 'secondHand', 
    color: '#14B8A6', 
    description: 'Appears in Second Hand section - Used textbooks, furniture, electronics'
  },
  { 
    value: 'Home & Furniture', 
    label: '🏠 Home & Furniture', 
    section: 'homeFurniture', 
    color: '#6B7280', 
    description: 'Appears in Home & Furniture section - Furniture, decor, kitchen items'
  },
  { 
    value: 'Campus Life', 
    label: '🏫 Campus Life', 
    section: 'campusLife', 
    color: '#F97316', 
    description: 'Appears in Campus Life section - Clubs, organizations, activities'
  },
  { 
    value: 'Fashion', 
    label: '👕 Fashion', 
    section: 'fashion', 
    color: '#EC4899', 
    description: 'Appears in Fashion section - Clothing, shoes, accessories'
  },
  { 
    value: 'Electronics', 
    label: '📱 Electronics', 
    section: 'electronics', 
    color: '#3B82F6', 
    description: 'Appears in Electronics section - New electronics, gadgets'
  },
  { 
    value: 'Books', 
    label: '📚 Books', 
    section: 'books', 
    color: '#F59E0B', 
    description: 'Appears in Books section - Textbooks, novels, study materials'
  },
  { 
    value: 'Other', 
    label: '📦 Other', 
    section: 'other', 
    color: '#9CA3AF', 
    description: 'Appears in Other section - Miscellaneous items'
  },
];

// Section options for special features
const SECTION_OPTIONS = [
  { value: 'flashDeals', label: '⚡ Flash Deals', description: 'Requires discount > 0% - appears in Flash Deals section', requiresDiscount: true },
  { value: 'trending', label: '📈 Trending', description: 'Automatically appears based on views', auto: true },
  { value: 'featured', label: '⭐ Featured', description: 'Shows in featured sections across the app' },
];

// Category guide for admin reference
const CATEGORY_GUIDE = [
  { section: 'Tech Gadgets', category: 'Tech Gadgets', example: 'Laptops, phones, headphones, accessories' },
  { section: 'Food & Dining', category: 'Food', example: 'Meals, groceries, restaurant deliveries' },
  { section: 'Student Services', category: 'Services', example: 'Tutoring, haircuts, printing, repairs' },
  { section: 'Campus Events', category: 'Events', example: 'Parties, workshops, seminars, sports' },
  { section: 'Second Hand', category: 'Second Hand', example: 'Used textbooks, furniture, electronics' },
  { section: 'Home & Furniture', category: 'Home & Furniture', example: 'Furniture, decor, kitchen items' },
  { section: 'Campus Life', category: 'Campus Life', example: 'Clubs, organizations, activities' },
  { section: 'Fashion', category: 'Fashion', example: 'Clothing, shoes, accessories' },
  { section: 'Electronics', category: 'Electronics', example: 'New electronics, gadgets' },
  { section: 'Books', category: 'Books', example: 'Textbooks, novels, study materials' },
];

// ==================== IMAGE GALLERY COMPONENT ====================
function ImageGallery({ images, listing }) {
  const [selectedImage, setSelectedImage] = useState(images?.[0] || null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No images uploaded</span>
      </div>
    );
  }

  const handleImageError = (url) => {
    setImageErrors(prev => ({ ...prev, [url]: true }));
  };

  const getOptimizedUrl = (url, width = 400) => {
    if (!url) return '';
    // Check if it's a Cloudinary URL
    if (url.includes('cloudinary.com')) {
      // Add optimization parameters
      return url.replace('/upload/', `/upload/w_${width},c_fill,q_auto,f_auto/`);
    }
    return url;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-medium" style={{ color: COLORS.subtext }}>
          Product Images ({images.length})
        </label>
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            Click to enlarge
          </span>
          {images.some(url => url.includes('cloudinary.com')) && (
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              ☁️ Cloudinary CDN
            </span>
          )}
        </div>
      </div>
      
      {/* Main image */}
      <div 
        className="mb-3 border rounded-lg overflow-hidden bg-gray-50 cursor-pointer group relative"
        style={{ borderColor: COLORS.border, aspectRatio: '16/9' }}
        onClick={() => setFullscreenImage(selectedImage || images[0])}
      >
        <img 
          src={getOptimizedUrl(selectedImage || images[0], 800)} 
          alt={listing?.title || "Product"}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/800x450?text=Image+Not+Available';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
            🔍 Click to enlarge
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((url, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(url)}
            className={`
              relative border-2 rounded-lg overflow-hidden aspect-square transition-all
              ${selectedImage === url ? 'ring-2 ring-offset-2' : 'hover:opacity-80'}
            `}
            style={{ 
              borderColor: selectedImage === url ? COLORS.primary : 'transparent',
              ringColor: COLORS.primary 
            }}
          >
            <img 
              src={getOptimizedUrl(url, 100)} 
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/100x100?text=Error';
              }}
            />
            {index === 0 && (
              <span className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1 rounded">
                Main
              </span>
            )}
            {imageErrors[url] && (
              <span className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center text-white text-xs">
                Error
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img 
              src={getOptimizedUrl(fullscreenImage, 1200)} 
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImage(null);
              }}
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Category Guide Component
function CategoryGuide() {
  const [showGuide, setShowGuide] = useState(false);
  
  return (
    <div className="mb-4">
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800"
      >
        <span>📋 Category Guide</span>
        <span>{showGuide ? '▼' : '▶'}</span>
      </button>
      
      {showGuide && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-medium text-blue-800 mb-2">
            Select the category that matches where you want the product to appear:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {CATEGORY_GUIDE.map((item) => (
              <div key={item.category} className="flex items-start gap-1">
                <span className="text-blue-600">•</span>
                <div>
                  <span className="font-medium text-blue-900">{item.section}:</span>
                  <span className="text-blue-700 ml-1">"{item.category}"</span>
                  <span className="text-gray-600 block text-xs mt-0.5">{item.example}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: For Flash Deals, also set a discount percentage
          </p>
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    sold: 0,
    archived: 0,
    totalValue: 0,
    students: 0,
    vendors: 0,
    events: 0,
    flashDeals: 0,
    techGadgets: 0,
    food: 0,
    services: 0,
    secondHand: 0,
    homeFurniture: 0,
    campusLife: 0,
    fashion: 0,
    electronics: 0,
    books: 0,
    other: 0,
  });

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

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
    setStats({
      total: data.length,
      pending: data.filter(l => l.status === 'pending' || (!l.status && !l.isActive)).length,
      active: data.filter(l => l.status === 'active' || l.isActive).length,
      sold: data.filter(l => l.status === 'sold').length,
      archived: data.filter(l => l.status === 'archived').length,
      totalValue: data.reduce((sum, l) => sum + (l.price || 0), 0),
      students: data.filter(l => l.userType === 'student').length,
      vendors: data.filter(l => l.userType === 'vendor').length,
      events: data.filter(l => l.category === 'Events').length,
      flashDeals: data.filter(l => l.discount > 0).length,
      techGadgets: data.filter(l => l.category === 'Tech Gadgets').length,
      food: data.filter(l => l.category === 'Food').length,
      services: data.filter(l => l.category === 'Services').length,
      secondHand: data.filter(l => l.category === 'Second Hand').length,
      homeFurniture: data.filter(l => l.category === 'Home & Furniture').length,
      campusLife: data.filter(l => l.category === 'Campus Life').length,
      fashion: data.filter(l => l.category === 'Fashion').length,
      electronics: data.filter(l => l.category === 'Electronics').length,
      books: data.filter(l => l.category === 'Books').length,
      other: data.filter(l => l.category === 'Other' || !l.category).length,
    });
  };

  // ✅ APPROVE with category and section assignment
  const handleApprove = async (id, category, sectionData = {}) => {
    setApprovingId(id);
    try {
      const response = await listingApi.approveListing(id, {
        category,
        isFlashDeal: sectionData.isFlashDeal || false,
        isFeatured: sectionData.isFeatured || false,
        eventDate: sectionData.eventDate,
        eventLocation: sectionData.eventLocation,
        maxAttendees: sectionData.maxAttendees,
        discount: sectionData.discount || 0,
        preparationTime: sectionData.preparationTime,
        deliveryFee: sectionData.deliveryFee,
        chef: sectionData.chef,
        cuisine: sectionData.cuisine,
        isVegetarian: sectionData.isVegetarian,
        isVegan: sectionData.isVegan,
        spicyLevel: sectionData.spicyLevel,
        providerName: sectionData.providerName,
        serviceAvailability: sectionData.serviceAvailability,
        serviceDuration: sectionData.serviceDuration,
        onlineAvailable: sectionData.onlineAvailable,
        qualifications: sectionData.qualifications,
        specs: sectionData.specs,
        usageDuration: sectionData.usageDuration,
        hasOriginalBox: sectionData.hasOriginalBox,
        hasReceipt: sectionData.hasReceipt,
        dimensions: sectionData.dimensions,
        material: sectionData.material,
        requiresAssembly: sectionData.requiresAssembly,
        color: sectionData.color,
        organizer: sectionData.organizer,
        contactEmail: sectionData.contactEmail,
        contactPhone: sectionData.contactPhone,
        website: sectionData.website,
        adminNotes: sectionData.adminNotes,
      });
      
      if (response.success) {
        // Update local state
        setListings(listings.map(l =>
          l._id === id ? { 
            ...l, 
            status: 'active', 
            isActive: true,
            category,
            ...sectionData,
            approvedAt: new Date().toISOString()
          } : l
        ));
        
        if (selectedListing?._id === id) {
          setSelectedListing(prev => ({ 
            ...prev, 
            status: 'active', 
            isActive: true,
            category,
            ...sectionData,
            approvedAt: new Date().toISOString()
          }));
        }
        
        // Show success message
        setSuccessMessage('✅ Listing approved and published to mobile app!');
        
        // Refresh listings to get updated data
        setTimeout(() => {
          fetchListings();
        }, 500);
        
      } else {
        alert('Failed to approve listing');
      }
    } catch (error) {
      console.error('Error approving listing:', error);
      alert('Failed to approve listing: ' + (error.response?.data?.error || error.message));
    } finally {
      setApprovingId(null);
    }
  };

  // ❌ REJECT
  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):');
    if (reason === null) return;
    try {
      const response = await listingApi.rejectListing(id, reason);
      if (response.success) {
        setListings(listings.map(l =>
          l._id === id ? { ...l, status: 'rejected', isActive: false } : l
        ));
        if (selectedListing?._id === id) {
          setSelectedListing(prev => ({ ...prev, status: 'rejected', isActive: false }));
        }
        setSuccessMessage('❌ Listing rejected');
      } else {
        alert('Failed to reject listing');
      }
    } catch (error) {
      console.error('Error rejecting listing:', error);
      alert('Failed to reject listing');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await listingApi.updateStatus(id, newStatus);
      if (response.success) {
        setListings(listings.map(listing =>
          listing._id === id ? { ...listing, status: newStatus } : listing
        ));
        setSuccessMessage(`📊 Status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const response = await listingApi.deleteListing(id);
      if (response.success) {
        setListings(listings.filter(listing => listing._id !== id));
        if (selectedListing?._id === id) setSelectedListing(null);
        setSuccessMessage('🗑️ Listing deleted');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchListings();
  };

  const handleRefresh = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchListings();
    setSuccessMessage('🔄 Listings refreshed');
  };

  const getStatusBadge = (listing) => {
    const status = listing.status;
    if (status === 'active' || listing.isActive) {
      return { label: 'Active ✓', bg: '#D1FAE5', color: '#065F46' };
    } else if (status === 'sold') {
      return { label: 'Sold', bg: '#DBEAFE', color: '#1E40AF' };
    } else if (status === 'rejected') {
      return { label: 'Rejected', bg: '#FEE2E2', color: '#991B1B' };
    } else {
      return { label: 'Pending', bg: '#FEF3C7', color: '#92400E' };
    }
  };

  const isPending = (listing) => {
    return listing.status === 'pending' || (!listing.isActive && listing.status !== 'sold' && listing.status !== 'rejected');
  };

  const getCategoryColor = (category) => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === category);
    return cat?.color || COLORS.subtext;
  };

  const getCategoryLabel = (category) => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === category);
    return cat?.label || category || 'Uncategorized';
  };

  const getCategorySection = (category) => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === category);
    return cat?.section || 'other';
  };

  const categories = ['all', ...CATEGORY_OPTIONS.map(c => c.value)];
  const userTypes = ['all', 'student', 'vendor'];

  return (
    <div className="p-6" style={{ background: COLORS.surface, minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Product Listings</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.subtext }}>
            Approve listings and assign categories to make them visible in the mobile app
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stats.pending > 0 && (
            <div className="px-4 py-2 rounded-lg text-sm font-medium animate-pulse"
              style={{ background: '#FEF3C7', color: '#92400E' }}>
              ⏳ {stats.pending} pending approval
            </div>
          )}
          <button
            onClick={handleRefresh}
            className="px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
            style={{ borderColor: COLORS.border }}
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm animate-fade-in">
          {successMessage}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <StatCard title="Total" value={stats.total} color={COLORS.primary} icon="📦" subtitle="all listings" />
        <StatCard title="Pending" value={stats.pending} color={COLORS.warning} icon="⏳" subtitle="awaiting approval" />
        <StatCard title="Live in App" value={stats.active} color={COLORS.success} icon="✅" subtitle="approved & visible" />
        <StatCard title="Flash Deals" value={stats.flashDeals} color={COLORS.approved} icon="⚡" subtitle="with discounts" />
        <StatCard title="Events" value={stats.events} color={COLORS.error} icon="🎉" subtitle="upcoming events" />
        <StatCard title="Sellers" value={`${stats.students + stats.vendors}`} color={COLORS.text} icon="👥"
          subtitle={`${stats.students} students · ${stats.vendors} vendors`} />
      </div>

      {/* Category Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        <CategoryStat label="Tech Gadgets" value={stats.techGadgets} color="#6366F1" icon="💻" />
        <CategoryStat label="Food" value={stats.food} color="#10B981" icon="🍔" />
        <CategoryStat label="Services" value={stats.services} color="#8B5CF6" icon="💼" />
        <CategoryStat label="Second Hand" value={stats.secondHand} color="#14B8A6" icon="🔄" />
        <CategoryStat label="Home & Furniture" value={stats.homeFurniture} color="#6B7280" icon="🏠" />
        <CategoryStat label="Campus Life" value={stats.campusLife} color="#F97316" icon="🏫" />
        <CategoryStat label="Fashion" value={stats.fashion} color="#EC4899" icon="👕" />
        <CategoryStat label="Electronics" value={stats.electronics} color="#3B82F6" icon="📱" />
        <CategoryStat label="Books" value={stats.books} color="#F59E0B" icon="📚" />
        <CategoryStat label="Other" value={stats.other} color="#9CA3AF" icon="📦" />
      </div>

      {/* Approval Flow Banner */}
      <div className="rounded-xl p-4 mb-6 flex items-center gap-3"
        style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
        <span className="text-2xl">📱</span>
        <div>
          <p className="text-sm font-medium" style={{ color: '#1E40AF' }}>
            Mobile App Visibility by Category
          </p>
          <p className="text-xs" style={{ color: '#3B82F6' }}>
            When approving a listing, select its category. It will automatically appear in the corresponding section:
            <strong> Food → Food section, Events → Events section, Services → Services section, etc.</strong>
          </p>
        </div>
      </div>

      {/* Category Guide */}
      <CategoryGuide />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button onClick={handleRefresh} className="mt-2 text-sm text-red-600 hover:text-red-800">
            Try Again
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border mb-6 p-4" style={{ borderColor: COLORS.border }}>
        <div className="flex flex-wrap gap-4">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{ borderColor: COLORS.border }}>
            <option value="all">All Status</option>
            <option value="pending">Pending Approval</option>
            <option value="active">Active (In App)</option>
            <option value="sold">Sold</option>
            <option value="rejected">Rejected</option>
          </select>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{ borderColor: COLORS.border }}>
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select value={userTypeFilter} onChange={(e) => setUserTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{ borderColor: COLORS.border }}>
            {userTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Sellers' : type === 'student' ? 'Students' : 'Vendors'}
              </option>
            ))}
          </select>

          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input type="text" placeholder="Search by title, seller, or email..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ borderColor: COLORS.border }} />
            <button type="submit"
              className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ background: COLORS.primary }}>
              Search
            </button>
          </form>
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
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.subtext }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                  {listings.map((listing) => {
                    const badge = getStatusBadge(listing);
                    const pending = isPending(listing);
                    return (
                      <tr key={listing._id}
                        className="hover:bg-gray-50 transition-colors"
                        style={pending ? { background: '#FFFBEB' } : {}}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {listing.imageUrls?.[0] && (
                              <img 
                                src={listing.imageUrls[0].includes('cloudinary.com') 
                                  ? listing.imageUrls[0].replace('/upload/', '/upload/w_80,h_80,c_fill/')
                                  : listing.imageUrls[0]
                                } 
                                alt={listing.title}
                                className="w-10 h-10 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                }} 
                              />
                            )}
                            <div>
                              <div className="font-medium flex items-center gap-2" style={{ color: COLORS.text }}>
                                {listing.title}
                                {pending && (
                                  <span className="text-xs px-1.5 py-0.5 rounded font-medium"
                                    style={{ background: '#FEF3C7', color: '#92400E' }}>
                                    NEW
                                  </span>
                                )}
                              </div>
                              <div className="text-sm" style={{ color: COLORS.subtext }}>
                                {listing.brand && `${listing.brand} · `}{listing.condition}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {listing.category ? (
                            <div>
                              <span className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{ 
                                  background: `${getCategoryColor(listing.category)}20`,
                                  color: getCategoryColor(listing.category)
                                }}>
                                {getCategoryLabel(listing.category)}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                → {getCategorySection(listing.category)} section
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Not set</span>
                          )}
                          {listing.discount > 0 && (
                            <span className="mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                              🔥 -{listing.discount}%
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium" style={{ color: COLORS.text }}>{listing.sellerName}</div>
                          <div className="text-sm" style={{ color: COLORS.subtext }}>{listing.sellerEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium" style={{ color: COLORS.primary }}>
                            GH₵{listing.price?.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ background: badge.bg, color: badge.color }}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full
                            ${listing.userType === 'student' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                            {listing.userType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: COLORS.subtext }}>
                          {format(new Date(listing.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {pending && (
                              <>
                                <button
                                  onClick={() => setSelectedListing(listing)}
                                  className="text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                  style={{ color: COLORS.primary, border: `1px solid ${COLORS.primary}` }}>
                                  Review
                                </button>
                                <button
                                  onClick={() => handleReject(listing._id)}
                                  className="text-xs px-3 py-1.5 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                                  style={{ background: COLORS.error }}>
                                  Reject
                                </button>
                              </>
                            )}
                            {!pending && (
                              <button
                                onClick={() => setSelectedListing(listing)}
                                className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                                style={{ color: COLORS.primary }}>
                                View
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {listings.length === 0 && !loading && (
              <div className="text-center py-12" style={{ color: COLORS.subtext }}>
                No listings found
              </div>
            )}

            {pagination.pages > 1 && (
              <div className="px-6 py-3 border-t flex items-center justify-between"
                style={{ borderColor: COLORS.border, background: COLORS.surface }}>
                <div className="text-sm" style={{ color: COLORS.subtext }}>
                  Showing page {pagination.page} of {pagination.pages}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    style={{ borderColor: COLORS.border }}>
                    Previous
                  </button>
                  <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    style={{ borderColor: COLORS.border }}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          approvingId={approvingId}
          categoryOptions={CATEGORY_OPTIONS}
          sectionOptions={SECTION_OPTIONS}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, color, icon, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-medium" style={{ color: COLORS.subtext }}>{title}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {subtitle && <p className="text-xs mt-1" style={{ color: COLORS.subtext }}>{subtitle}</p>}
    </div>
  );
}

function CategoryStat({ label, value, color, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-2" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between">
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <p className="text-lg font-bold mt-1" style={{ color }}>{value}</p>
    </div>
  );
}

function ListingDetailsModal({ listing, onClose, onApprove, onReject, onDelete, approvingId, categoryOptions, sectionOptions }) {
  const isPending = listing.status === 'pending' || (!listing.isActive && listing.status !== 'sold' && listing.status !== 'rejected');
  const isActive = listing.status === 'active' || listing.isActive;
  
  const [selectedCategory, setSelectedCategory] = useState(listing.category || '');
  const [isFlashDeal, setIsFlashDeal] = useState(listing.discount > 0);
  const [discount, setDiscount] = useState(listing.discount || 0);
  const [isFeatured, setIsFeatured] = useState(listing.featured || false);
  const [eventDate, setEventDate] = useState(listing.eventDate || '');
  const [eventLocation, setEventLocation] = useState(listing.eventLocation || '');
  const [maxAttendees, setMaxAttendees] = useState(listing.maxAttendees || '');
  
  // Food & Dining fields
  const [preparationTime, setPreparationTime] = useState(listing.preparationTime || '');
  const [deliveryFee, setDeliveryFee] = useState(listing.deliveryFee || '');
  const [chef, setChef] = useState(listing.chef || '');
  const [cuisine, setCuisine] = useState(listing.cuisine || '');
  const [isVegetarian, setIsVegetarian] = useState(listing.isVegetarian || false);
  const [isVegan, setIsVegan] = useState(listing.isVegan || false);
  const [spicyLevel, setSpicyLevel] = useState(listing.spicyLevel || '');
  
  // Services fields
  const [providerName, setProviderName] = useState(listing.providerName || '');
  const [serviceAvailability, setServiceAvailability] = useState(listing.serviceAvailability || '');
  const [serviceDuration, setServiceDuration] = useState(listing.serviceDuration || '');
  const [onlineAvailable, setOnlineAvailable] = useState(listing.onlineAvailable || false);
  const [qualifications, setQualifications] = useState(listing.qualifications?.join(', ') || '');
  
  // Tech Gadgets fields
  const [processor, setProcessor] = useState(listing.specs?.processor || '');
  const [ram, setRam] = useState(listing.specs?.ram || '');
  const [storage, setStorage] = useState(listing.specs?.storage || '');
  const [screenSize, setScreenSize] = useState(listing.specs?.screenSize || '');
  const [batteryLife, setBatteryLife] = useState(listing.specs?.batteryLife || '');
  const [warranty, setWarranty] = useState(listing.specs?.warranty || '');
  
  // Second Hand fields
  const [usageDuration, setUsageDuration] = useState(listing.usageDuration || '');
  const [hasOriginalBox, setHasOriginalBox] = useState(listing.hasOriginalBox || false);
  const [hasReceipt, setHasReceipt] = useState(listing.hasReceipt || false);
  const [originalPurchaseDate, setOriginalPurchaseDate] = useState(listing.originalPurchaseDate?.split('T')[0] || '');
  
  // Home & Furniture fields
  const [width, setWidth] = useState(listing.dimensions?.width || '');
  const [height, setHeight] = useState(listing.dimensions?.height || '');
  const [depth, setDepth] = useState(listing.dimensions?.depth || '');
  const [dimensionUnit, setDimensionUnit] = useState(listing.dimensions?.unit || 'cm');
  const [material, setMaterial] = useState(listing.material || '');
  const [requiresAssembly, setRequiresAssembly] = useState(listing.requiresAssembly || false);
  const [color, setColor] = useState(listing.color || '');
  
  // Campus Life fields
  const [organizer, setOrganizer] = useState(listing.organizer || '');
  const [contactEmail, setContactEmail] = useState(listing.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(listing.contactPhone || '');
  const [website, setWebsite] = useState(listing.website || '');
  
  const [adminNotes, setAdminNotes] = useState('');

  const handleApprove = () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    const sectionData = {
      isFlashDeal,
      isFeatured,
      discount: isFlashDeal ? discount : 0,
      adminNotes,
      eventDate,
      eventLocation,
      maxAttendees,
      preparationTime,
      deliveryFee,
      chef,
      cuisine,
      isVegetarian,
      isVegan,
      spicyLevel,
      providerName,
      serviceAvailability,
      serviceDuration,
      onlineAvailable,
      qualifications: qualifications ? qualifications.split(',').map(q => q.trim()) : [],
      specs: {
        processor,
        ram,
        storage,
        screenSize,
        batteryLife,
        warranty,
      },
      usageDuration,
      hasOriginalBox,
      hasReceipt,
      originalPurchaseDate,
      dimensions: {
        width: width ? parseFloat(width) : undefined,
        height: height ? parseFloat(height) : undefined,
        depth: depth ? parseFloat(depth) : undefined,
        unit: dimensionUnit,
      },
      material,
      requiresAssembly,
      color,
      organizer,
      contactEmail,
      contactPhone,
      website,
    };

    onApprove(listing._id, selectedCategory, sectionData);
  };

  const getCategoryColor = (category) => {
    const cat = categoryOptions.find(c => c.value === category);
    return cat?.color || COLORS.subtext;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>Review Listing</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {isActive ? '📱 Visible in app' : '🔒 Hidden from app'}
                </span>
                {listing.category && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                    Current: {listing.category}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          {/* ========== IMAGE REVIEW PANEL ========== */}
          {isPending && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2" style={{ color: '#1E40AF' }}>
                  <span>📸</span>
                  <span>Image Review Checklist</span>
                </h3>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {listing.imageUrls?.length || 0} images
                </span>
              </div>

              {/* Image Quality Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-start gap-2 p-2 bg-white rounded-lg">
                  <div className="text-xl">{listing.imageUrls?.length > 0 ? '✅' : '❌'}</div>
                  <div>
                    <div className="text-sm font-medium">Images Present</div>
                    <div className="text-xs text-gray-500">{listing.imageUrls?.length || 0} images uploaded</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 bg-white rounded-lg">
                  <div className="text-xl">{listing.imageUrls?.length >= 3 ? '✅' : '⚠️'}</div>
                  <div>
                    <div className="text-sm font-medium">Minimum Required</div>
                    <div className="text-xs text-gray-500">At least 3 images recommended</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 bg-white rounded-lg col-span-2">
                  <div className="text-xl">📝</div>
                  <div>
                    <div className="text-sm font-medium">Quick Tips</div>
                    <div className="text-xs text-gray-500">
                      • Check image quality and relevance<br/>
                      • Ensure main image is clear and well-lit<br/>
                      • Verify images match the product description
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              <div className="grid grid-cols-4 gap-2">
                {listing.imageUrls?.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url.includes('cloudinary.com') 
                        ? url.replace('/upload/', '/upload/w_100,h_100,c_fill/')
                        : url
                      } 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border-2 border-white shadow-sm cursor-pointer"
                      onClick={() => window.open(url, '_blank')}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                      }}
                    />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {index + 1}
                    </span>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approval Form - shown prominently for pending items */}
          {isPending && (
            <div className="mb-6 p-4 rounded-xl border-2 border-dashed"
              style={{ borderColor: COLORS.warning, background: '#FFFBEB' }}>
              <p className="text-sm font-medium mb-3" style={{ color: '#92400E' }}>
                ⏳ This listing is pending approval — configure how it will appear in the mobile app
              </p>
              
              {/* Category Selection with Icons and Descriptions */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2" style={{ color: COLORS.subtext }}>
                  Select Category * (Determines which section it appears in)
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}>
                  {categoryOptions.map((cat) => (
                    <label
                      key={cat.value}
                      className={`
                        flex items-start p-3 rounded-lg cursor-pointer transition-all
                        ${selectedCategory === cat.value 
                          ? 'border-2 shadow-md' 
                          : 'border hover:shadow-sm'
                        }
                      `}
                      style={{
                        borderColor: selectedCategory === cat.value ? cat.color : COLORS.border,
                        backgroundColor: selectedCategory === cat.value ? `${cat.color}10` : 'white'
                      }}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={selectedCategory === cat.value}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mt-1 mr-2 flex-shrink-0"
                        style={{ accentColor: cat.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{cat.label}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" 
                            style={{ background: `${cat.color}20`, color: cat.color }}>
                            {cat.section}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Event-specific fields */}
              {selectedCategory === 'Events' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium mb-2 text-blue-700">📅 Event Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Event Date *</label>
                      <input
                        type="datetime-local"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        required={selectedCategory === 'Events'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Max Attendees</label>
                      <input
                        type="number"
                        value={maxAttendees}
                        onChange={(e) => setMaxAttendees(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs mb-1 text-gray-600">Location *</label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Event location"
                      required={selectedCategory === 'Events'}
                    />
                  </div>
                </div>
              )}

              {/* Food & Dining fields */}
              {selectedCategory === 'Food' && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs font-medium mb-2 text-green-700">🍔 Food & Dining Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Preparation Time</label>
                      <input
                        type="text"
                        value={preparationTime}
                        onChange={(e) => setPreparationTime(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., 30-45 min"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Delivery Fee (GH₵)</label>
                      <input
                        type="number"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Chef/Cook</label>
                      <input
                        type="text"
                        value={chef}
                        onChange={(e) => setChef(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Chef name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Cuisine</label>
                      <input
                        type="text"
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., Ghanaian, Chinese"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={isVegetarian}
                        onChange={(e) => setIsVegetarian(e.target.checked)}
                      />
                      <span>Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={isVegan}
                        onChange={(e) => setIsVegan(e.target.checked)}
                      />
                      <span>Vegan</span>
                    </label>
                    <div>
                      <select
                        value={spicyLevel}
                        onChange={(e) => setSpicyLevel(e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="">Spice Level</option>
                        <option value="mild">Mild</option>
                        <option value="medium">Medium</option>
                        <option value="hot">Hot</option>
                        <option value="extra hot">Extra Hot</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Services fields */}
              {selectedCategory === 'Services' && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs font-medium mb-2 text-purple-700">💼 Service Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Provider Name</label>
                      <input
                        type="text"
                        value={providerName}
                        onChange={(e) => setProviderName(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Provider name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Availability</label>
                      <input
                        type="text"
                        value={serviceAvailability}
                        onChange={(e) => setServiceAvailability(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., Weekdays 9am-5pm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Duration</label>
                      <input
                        type="text"
                        value={serviceDuration}
                        onChange={(e) => setServiceDuration(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., 1 hour"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Qualifications</label>
                      <input
                        type="text"
                        value={qualifications}
                        onChange={(e) => setQualifications(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Comma separated"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-1 text-sm mt-2">
                    <input
                      type="checkbox"
                      checked={onlineAvailable}
                      onChange={(e) => setOnlineAvailable(e.target.checked)}
                    />
                    <span>Available Online</span>
                  </label>
                </div>
              )}

              {/* Tech Gadgets fields */}
              {selectedCategory === 'Tech Gadgets' && (
                <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs font-medium mb-2 text-indigo-700">💻 Tech Specifications</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Processor</label>
                      <input
                        type="text"
                        value={processor}
                        onChange={(e) => setProcessor(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., Intel i7"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">RAM</label>
                      <input
                        type="text"
                        value={ram}
                        onChange={(e) => setRam(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., 16GB"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Storage</label>
                      <input
                        type="text"
                        value={storage}
                        onChange={(e) => setStorage(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., 512GB SSD"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Screen Size</label>
                      <input
                        type="text"
                        value={screenSize}
                        onChange={(e) => setScreenSize(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., 15.6 inches"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Battery Life</label>
                      <input
                        type="text"
                        value={batteryLife}
                        onChange={(e) => setBatteryLife(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., 10 hours"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Warranty</label>
                      <input
                        type="text"
                        value={warranty}
                        onChange={(e) => setWarranty(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., 1 year"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Second Hand fields */}
              {selectedCategory === 'Second Hand' && (
                <div className="mb-4 p-3 bg-teal-50 rounded-lg">
                  <p className="text-xs font-medium mb-2 text-teal-700">🔄 Second Hand Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Usage Duration</label>
                      <input
                        type="text"
                        value={usageDuration}
                        onChange={(e) => setUsageDuration(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="e.g., 6 months"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Original Purchase Date</label>
                      <input
                        type="date"
                        value={originalPurchaseDate}
                        onChange={(e) => setOriginalPurchaseDate(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={hasOriginalBox}
                        onChange={(e) => setHasOriginalBox(e.target.checked)}
                      />
                      <span>Original Box</span>
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={hasReceipt}
                        onChange={(e) => setHasReceipt(e.target.checked)}
                      />
                      <span>Receipt</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Home & Furniture fields */}
              {selectedCategory === 'Home & Furniture' && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium mb-2 text-gray-700">🏠 Home & Furniture Details</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Width</label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Height</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Height"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Depth</label>
                      <input
                        type="number"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Depth"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <select
                        value={dimensionUnit}
                        onChange={(e) => setDimensionUnit(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Material"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={requiresAssembly}
                        onChange={(e) => setRequiresAssembly(e.target.checked)}
                      />
                      <span>Requires Assembly</span>
                    </label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                      placeholder="Color"
                    />
                  </div>
                </div>
              )}

              {/* Campus Life fields */}
              {selectedCategory === 'Campus Life' && (
                <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs font-medium mb-2 text-orange-700">🏫 Campus Life Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Organizer</label>
                      <input
                        type="text"
                        value={organizer}
                        onChange={(e) => setOrganizer(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Organizer name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Contact Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Contact Phone</label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-600">Website</label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Flash Deal Option */}
              <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="flashDeal"
                    checked={isFlashDeal}
                    onChange={(e) => setIsFlashDeal(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="flashDeal" className="text-sm font-medium flex items-center gap-1">
                    <span>⚡ Mark as Flash Deal</span>
                    <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                      Appears in Flash Deals section
                    </span>
                  </label>
                </div>
                
                {isFlashDeal && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs mb-1 text-gray-600">Discount Percentage *</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-32 px-2 py-1 border rounded text-sm"
                      min="1"
                      max="99"
                      required={isFlashDeal}
                      placeholder="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Products with discount automatically appear in Flash Deals
                    </p>
                  </div>
                )}
              </div>

              {/* Featured Option */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium flex items-center gap-1">
                    <span>⭐ Mark as Featured</span>
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                      Appears in featured sections
                    </span>
                  </label>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1" style={{ color: COLORS.subtext }}>
                  Admin Notes (optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  rows="2"
                  placeholder="Add internal notes about this listing..."
                  style={{ borderColor: COLORS.border }}
                />
              </div>

              {/* Category Preview - Shows where it will appear */}
              {selectedCategory && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                    <span>📱 Preview:</span>
                    <span className="px-2 py-1 rounded-full text-xs"
                      style={{ 
                        background: `${getCategoryColor(selectedCategory)}20`,
                        color: getCategoryColor(selectedCategory)
                      }}>
                      {categoryOptions.find(c => c.value === selectedCategory)?.label}
                    </span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {categoryOptions.find(c => c.value === selectedCategory)?.section} section
                    </span>
                  </p>
                  {isFlashDeal && (
                    <p className="text-xs text-green-600 mt-1">
                      ⚡ Also appears in Flash Deals section with {discount}% discount
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={approvingId === listing._id}
                  className="flex-1 px-4 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: COLORS.success }}>
                  {approvingId === listing._id ? (
                    <><span className="animate-spin">⟳</span> Approving...</>
                  ) : (
                    <>✓ Approve — Publish to App</>
                  )}
                </button>
                <button
                  onClick={() => onReject(listing._id)}
                  className="flex-1 px-4 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  style={{ background: COLORS.error }}>
                  ✕ Reject Listing
                </button>
              </div>
            </div>
          )}

          {/* Already active notice */}
          {isActive && (
            <div className="mb-6 p-3 rounded-lg flex items-center gap-2"
              style={{ background: '#D1FAE5' }}>
              <span>✅</span>
              <p className="text-sm font-medium" style={{ color: '#065F46' }}>
                This listing is live and visible in the {listing.category || 'general'} section of the mobile app
              </p>
            </div>
          )}

          {/* Product Images with Gallery */}
          {listing.imageUrls?.length > 0 ? (
            <ImageGallery images={listing.imageUrls} listing={listing} />
          ) : (
            <div className="mb-6 p-8 bg-gray-50 rounded-lg text-center">
              <span className="text-4xl mb-2 block">📷</span>
              <p className="text-gray-500">No images uploaded for this listing</p>
              <p className="text-xs text-gray-400 mt-1">Images will appear here once uploaded</p>
            </div>
          )}

          {/* Product Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Title" value={listing.title} />
            <DetailField label="Price" value={`GH₵${listing.price?.toFixed(2)}`} highlight />
            <DetailField label="Current Category" value={listing.category || 'Not set'} />
            <DetailField label="Subcategory" value={listing.subcategory} />
            <DetailField label="Brand" value={listing.brand} />
            <DetailField label="Condition" value={listing.condition} />
            <DetailField label="Location" value={listing.location} />
            <DetailField label="Delivery" value={listing.deliveryType === 'self' ? 'Self Pickup' : 'Uni-Mart Riders'} />
            <DetailField label="Payment" value={listing.paymentMethod === 'mtn' ? 'MTN MoMo' : 'Telecel Cash'} />
            <div className="col-span-2">
              <label className="text-xs font-medium" style={{ color: COLORS.subtext }}>Description</label>
              <p className="mt-1 text-sm p-3 bg-gray-50 rounded-lg" style={{ color: COLORS.text }}>
                {listing.description}
              </p>
            </div>
            {listing.tags?.length > 0 && (
              <DetailField label="Tags" value={listing.tags.join(', ')} fullWidth />
            )}
          </div>

          {/* Seller Information */}
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

          {/* Metadata */}
          <div className="mt-4 text-xs text-right" style={{ color: COLORS.subtext }}>
            Created: {format(new Date(listing.createdAt), 'PPP p')}
            {listing.updatedAt && listing.updatedAt !== listing.createdAt && (
              <> · Updated: {format(new Date(listing.updatedAt), 'PPP p')}</>
            )}
            {listing.approvedAt && (
              <> · Approved: {format(new Date(listing.approvedAt), 'PPP p')}</>
            )}
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