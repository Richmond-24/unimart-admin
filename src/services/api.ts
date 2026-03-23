// src/services/api.ts
// ─── Single source of truth for all backend API calls ─────────────────────

// Use Create React App's environment variable
const BASE = process.env. NEXT_PUBLIC_API_URL|| "https://unimart-backend-2.onrender.com";

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

    // For responses without JSON body (like 204 No Content)
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

export interface KpiData {
  totalListings:    number;
  pendingListings:  number;
  activeListings:   number;
  soldListings:     number;
  rejectedListings: number;
  recentListings:   { _id: string; count: number }[];
  topCategories:    { _id: string; count: number }[];
  recentActivity:   Partial<Listing>[];
}

export interface Notification {
  id:      string;
  type:    "order" | "product" | "user";
  message: string;
  time:    string;
  read:    boolean;
  listing?: { id: string; title: string; price: number; category: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD API
// ─────────────────────────────────────────────────────────────────────────────

export const dashboardApi = {
  /** Get KPI data */
  getKpi: () =>
    request<{ success: boolean; data: KpiData }>("/api/dashboard/kpi")
      .then((r) => r.data),

  /** Alias for getKpi */
  getKPI: () =>
    request<{ success: boolean; data: KpiData }>("/api/dashboard/kpi")
      .then((r) => r.data),

  /** Get sales trend */
  getSalesTrend: (period: string = '30d') =>
    request<{ success: boolean; data: any[] }>(`/api/dashboard/sales-trend?period=${period}`)
      .then((r) => r.data),

  /** Get category performance */
  getCategoryPerformance: () =>
    request<{ success: boolean; data: any[] }>("/api/dashboard/categories")
      .then((r) => r.data),

  /** Get top products */
  getTopProducts: (limit: number = 5) =>
    request<{ success: boolean; data: any[] }>(`/api/dashboard/top-products?limit=${limit}`)
      .then((r) => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// LISTINGS API
// ─────────────────────────────────────────────────────────────────────────────

export const listingsApi = {
  /** All listings — optionally filter by status */
  getAll: (status?: string) =>
    request<{ success: boolean; data: Listing[] }>(
      `/api/listings${status ? `?status=${status}` : ""}`
    ).then((r) => r.data),

  /** Get listings with pagination */
  getPaginated: (page: number = 1, limit: number = 10, status?: string) =>
    request<{ success: boolean; data: Listing[]; pagination: any }>(
      `/api/listings?page=${page}&limit=${limit}${status ? `&status=${status}` : ""}`
    ).then((r) => r),

  /** Get pending listings (for approval) */
  getPending: () =>
    request<{ success: boolean; data: Listing[] }>("/api/listings?status=pending")
      .then((r) => r.data),

  /** Count of pending listings (for sidebar badge) */
  getPendingCount: async () => {
    const data = await request<{ success: boolean; data: Listing[] }>("/api/listings?status=pending");
    return data.data?.length || 0;
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
      const response = await request<{ success: boolean; data: Listing[] }>("/api/listings?limit=10");
      const listings = response.data || [];
      
      const notifications: Notification[] = listings.map(listing => ({
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