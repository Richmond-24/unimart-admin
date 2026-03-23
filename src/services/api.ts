
// src/services/api.ts
// ─── Single source of truth for all backend API calls ─────────────────────

// Production backend URL
const BASE = "https://unimart-backend-2.onrender.com";

// ── Generic fetch wrapper ─────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
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
      return {} as T;
    }

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`❌ API Error ${res.status}:`, json);
      throw new Error(json.error || `HTTP ${res.status}`);
    }
    return json as T;
  } catch (error) {
    console.error(`❌ Fetch failed: ${url}`, error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface Listing {
  _id:               string;
  title:             string;
  description:       string;
  category:          string;
  brand?:            string;
  condition:         string;
  conditionNotes?:   string;
  price:             number;
  discount?:         number;
  edition?:          string;
  sellerName:        string;
  sellerEmail:       string;
  sellerPhone?:      string;
  location?:         string;
  userType:          "student" | "vendor";
  deliveryType:      "self" | "unimart";
  paymentMethod:     string;
  tags:              string[];
  imageUrls:         string[];
  status:            "pending" | "active" | "sold" | "archived" | "rejected";
  isActive:          boolean;
  views:             number;
  sales:             number;
  confidence?:       number;
  authenticityScore?: number;
  isFake?:           boolean;
  fakeDetectionNotes?: string;
  createdAt:         string;
  updatedAt:         string;
}

export interface DashboardData {
  totalListings:    number;
  pendingListings:  number;
  activeListings:   number;
  soldListings:     number;
  rejectedListings: number;
  recentListings:   Listing[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD API (Using real endpoints)
// ─────────────────────────────────────────────────────────────────────────────

export const dashboardApi = {
  /** Get KPI data from actual listings */
  getKpi: async (): Promise<DashboardData> => {
    try {
      // Fetch all listings
      const listings = await listingsApi.getAll();
      
      // Calculate KPIs from the data
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
  getKPI: () => dashboardApi.getKpi(),

  /** Get sales trend (calculated from listing dates) */
  getSalesTrend: async (period: string = '30d'): Promise<any[]> => {
    try {
      const listings = await listingsApi.getAll();
      const activeListings = listings.filter(l => l.status === 'active');
      
      // Group by date
      const salesByDate: Record<string, number> = {};
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
  getCategoryPerformance: async (): Promise<any[]> => {
    try {
      const listings = await listingsApi.getAll();
      const categoryMap: Record<string, { count: number; revenue: number }> = {};
      
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
        name,
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
  getTopProducts: async (limit: number = 5): Promise<any[]> => {
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
          image: listing.imageUrls?.[0] || null
        }));
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  },

  /** Get geo distribution (from location data) */
  getGeoDistribution: async (): Promise<any[]> => {
    try {
      const listings = await listingsApi.getAll();
      const locationMap: Record<string, number> = {};
      
      listings.forEach(listing => {
        if (listing.location) {
          const mainLocation = listing.location.split(',')[0].trim();
          locationMap[mainLocation] = (locationMap[mainLocation] || 0) + 1;
        }
      });
      
      return Object.entries(locationMap)
        .map(([name, count]) => ({ name, count }))
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
  getAll: async (status?: string): Promise<Listing[]> => {
    try {
      const data = await request<{ success: boolean; data: Listing[] }>(
        `/api/listings${status ? `?status=${status}` : ""}`
      );
      return data.data || [];
    } catch (error) {
      console.error('Error fetching listings:', error);
      return [];
    }
  },

  /** Get pending listings (for approval) */
  getPending: async (): Promise<Listing[]> => {
    return listingsApi.getAll('pending');
  },

  /** Count of pending listings (for sidebar badge) */
  getPendingCount: async (): Promise<number> => {
    const pending = await listingsApi.getAll('pending');
    return pending.length;
  },

  /** Single listing */
  getOne: (id: string) =>
    request<{ success: boolean; data: Listing }>(`/api/listings/${id}`)
      .then((r) => r.data),

  /** Approve a listing → status becomes 'active' */
  approve: (id: string) =>
    request<{ success: boolean; data: Listing }>(`/api/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "active" }),
    }).then((r) => r.data),

  /** Reject a listing */
  reject: (id: string, reason?: string) =>
    request<{ success: boolean; data: Listing }>(`/api/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "rejected", reason: reason || "" }),
    }).then((r) => r.data),

  /** Generic status update */
  updateStatus: (id: string, status: Listing["status"]) =>
    request<{ success: boolean; data: Listing }>(`/api/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }).then((r) => r.data),

  /** Delete listing */
  delete: (id: string) =>
    request<{ success: boolean }>(`/api/listings/${id}`, { method: "DELETE" }),
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
  markRead: async (id: string) => {
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
    return notifs.filter((n) => !n.read).length;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// USERS API (for future use)
// ─────────────────────────────────────────────────────────────────────────────

export const usersApi = {
  getAll: () =>
    request<{ success: boolean; data: any[] }>("/api/users").then((r) => r.data),
  
  getOne: (id: string) =>
    request<{ success: boolean; data: any }>(`/api/users/${id}`).then((r) => r.data),
};

export default {
  dashboardApi,
  listingsApi,
  notificationsApi,
  usersApi,
};