
// src/services/api.js
// ─── Single source of truth for all backend API calls ─────────────────────

// Production backend URL
const BASE = "https://unimart-backend-2.onrender.com";

// ── Generic fetch wrapper ─────────────────────────────────────────────────────
async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: { 
        "Content-Type": "application/json",
        ...options.headers 
      },
      ...options,
    });

    if (res.status === 204) {
      return {};
    }

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`❌ API Error ${res.status}:`, json);
      throw new Error(json.error || `HTTP ${res.status}`);
    }
    return json;
  } catch (error) {
    console.error(`❌ Fetch failed: ${url}`, error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD API (Using real endpoints)
// ─────────────────────────────────────────────────────────────────────────────

export const dashboardApi = {
  /** Get KPI data from actual listings */
  getKpi: async () => {
    try {
      const listings = await listingsApi.getAll();
      
      const totalListings = listings.length;
      const pendingListings = listings.filter(l => l.status === 'pending').length;
      const activeListings = listings.filter(l => l.status === 'active').length;
      const soldListings = listings.filter(l => l.status === 'sold').length;
      const rejectedListings = listings.filter(l => l.status === 'rejected').length;
      const recentListings = listings.slice(0, 5);
      
      return {
        totalListings,
        pendingListings,
        activeListings,
        soldListings,
        rejectedListings,
        recentListings
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        totalListings: 0,
        pendingListings: 0,
        activeListings: 0,
        soldListings: 0,
        rejectedListings: 0,
        recentListings: []
      };
    }
  },

  /** Alias for getKpi */
  getKPI: function() {
    return this.getKpi();
  },

  /** Get sales trend (calculated from listing dates) */
  getSalesTrend: async (period = '30d') => {
    try {
      const listings = await listingsApi.getAll();
      const activeListings = listings.filter(l => l.status === 'active');
      
      const salesByDate = {};
      const now = new Date();
      const daysToSubtract = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const cutoffDate = new Date(now.setDate(now.getDate() - daysToSubtract));
      
      activeListings.forEach(listing => {
        const date = new Date(listing.createdAt);
        if (date >= cutoffDate) {
          const dateKey = date.toLocaleDateString();
          salesByDate[dateKey] = (salesByDate[dateKey] || 0) + listing.price;
        }
      });
      
      return Object.entries(salesByDate).map(([date, revenue]) => ({
        date,
        revenue,
        orders: 1
      }));
    } catch (error) {
      console.error('Error fetching sales trend:', error);
      return [];
    }
  },

  /** Get category performance */
  getCategoryPerformance: async () => {
    try {
      const listings = await listingsApi.getAll();
      const categoryMap = {};
      
      listings.forEach(listing => {
        const cat = listing.category || 'Other';
        if (!categoryMap[cat]) {
          categoryMap[cat] = { count: 0, revenue: 0 };
        }
        categoryMap[cat].count++;
        categoryMap[cat].revenue += listing.price;
      });
      
      const colors = ['#FF6A00', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B'];
      
      return Object.entries(categoryMap).map(([name, data], index) => ({
        name: name,
        value: data.count,
        count: data.count,
        revenue: data.revenue,
        color: colors[index % colors.length]
      }));
    } catch (error) {
      console.error('Error fetching category performance:', error);
      return [];
    }
  },

  /** Get top products */
  getTopProducts: async (limit = 5) => {
    try {
      const listings = await listingsApi.getAll();
      return listings
        .sort((a, b) => b.views - a.views)
        .slice(0, limit)
        .map(listing => ({
          name: listing.title,
          category: listing.category,
          price: listing.price,
          views: listing.views || 0,
          image: listing.imageUrls && listing.imageUrls[0] ? listing.imageUrls[0] : null
        }));
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  },

  /** Get geo distribution (from location data) */
  getGeoDistribution: async () => {
    try {
      const listings = await listingsApi.getAll();
      const locationMap = {};
      
      listings.forEach(listing => {
        if (listing.location) {
          const mainLocation = listing.location.split(',')[0].trim();
          locationMap[mainLocation] = (locationMap[mainLocation] || 0) + 1;
        }
      });
      
      return Object.entries(locationMap)
        .map(([name, count]) => ({ name: name, count: count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    } catch (error) {
      console.error('Error fetching geo distribution:', error);
      return [];
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LISTINGS API
// ─────────────────────────────────────────────────────────────────────────────

export const listingsApi = {
  /** All listings — optionally filter by status */
  getAll: async (status) => {
    try {
      const url = status ? `/api/listings?status=${status}` : "/api/listings";
      const data = await request(url);
      return data.data || [];
    } catch (error) {
      console.error('Error fetching listings:', error);
      return [];
    }
  },

  /** Get pending listings (for approval) */
  getPending: async function() {
    return this.getAll('pending');
  },

  /** Count of pending listings (for sidebar badge) */
  getPendingCount: async function() {
    const pending = await this.getAll('pending');
    return pending.length;
  },

  /** Single listing */
  getOne: function(id) {
    return request(`/api/listings/${id}`).then(function(r) {
      return r.data;
    });
  },

  /** Approve a listing → status becomes 'active' */
  approve: function(id) {
    return request(`/api/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "active" }),
    }).then(function(r) {
      return r.data;
    });
  },

  /** Reject a listing */
  reject: function(id, reason) {
    return request(`/api/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "rejected", reason: reason || "" }),
    }).then(function(r) {
      return r.data;
    });
  },

  /** Generic status update */
  updateStatus: function(id, status) {
    return request(`/api/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: status }),
    }).then(function(r) {
      return r.data;
    });
  },

  /** Delete listing */
  delete: function(id) {
    return request(`/api/listings/${id}`, { method: "DELETE" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS API
// ─────────────────────────────────────────────────────────────────────────────

export const notificationsApi = {
  /** Fetch all notifications (built from recent listings) */
  getAll: async () => {
    try {
      const listings = await listingsApi.getAll();
      const recentListings = listings.slice(0, 10);
      
      const notifications = recentListings.map(listing => ({
        id: listing._id,
        type: "order",
        message: `New listing "${listing.title}" submitted by ${listing.sellerName}`,
        time: new Date(listing.createdAt).toLocaleString(),
        read: false,
        listing: {
          id: listing._id,
          title: listing.title,
          price: listing.price,
          category: listing.category
        }
      }));
      
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  /** Mark a single notification read */
  markRead: async (id) => {
    console.log(`Marking notification ${id} as read`);
    return { success: true };
  },

  /** Mark all notifications as read */
  markAllRead: async () => {
    console.log('Marking all notifications as read');
    return { success: true };
  },

  /** Get unread count */
  getUnreadCount: async () => {
    const notifs = await notificationsApi.getAll();
    return notifs.filter(function(n) {
      return !n.read;
    }).length;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// USERS API (for future use)
// ─────────────────────────────────────────────────────────────────────────────

export const usersApi = {
  getAll: function() {
    return request("/api/users").then(function(r) {
      return r.data;
    });
  },
  
  getOne: function(id) {
    return request(`/api/users/${id}`).then(function(r) {
      return r.data;
    });
  }
};

export default {
  dashboardApi,
  listingsApi,
  notificationsApi,
  usersApi,
};