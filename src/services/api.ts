
// src/services/api.ts
// ─── Single source of truth for all backend API calls ─────────────────────

const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

// ── Generic fetch wrapper ─────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || `HTTP ${res.status}`);
  }
  return json as T;
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
  getKpi: () =>
    request<{ success: boolean; data: KpiData }>("/api/dashboard/kpi")
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

  /** Only pending listings */
  getPending: () =>
    request<{ success: boolean; data: Listing[] }>("/api/listings/pending")
      .then((r) => r.data),

  /** Count of pending listings (for sidebar badge) */
  getPendingCount: () =>
    request<{ success: boolean; count: number }>("/api/listings/pending/count")
      .then((r) => r.count),

  /** Single listing */
  getOne: (id: string) =>
    request<{ success: boolean; data: Listing }>(`/api/listings/${id}`)
      .then((r) => r.data),

  /** Approve a listing → status becomes 'active' */
  approve: (id: string) =>
    request<{ success: boolean; data: Listing }>(`/api/listings/${id}/approve`, {
      method: "PATCH",
    }).then((r) => r.data),

  /** Reject a listing */
  reject: (id: string, reason?: string) =>
    request<{ success: boolean; data: Listing }>(`/api/listings/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason: reason || "" }),
    }).then((r) => r.data),

  /** Generic status update */
  updateStatus: (id: string, status: Listing["status"]) =>
    request<{ success: boolean; data: Listing }>(`/api/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }).then((r) => r.data),

  /** Delete */
  delete: (id: string) =>
    request<{ success: boolean }>(`/api/listings/${id}`, { method: "DELETE" }),
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS API
// ─────────────────────────────────────────────────────────────────────────────

export const notificationsApi = {
  /** Fetch all notifications (built from listing events) */
  getAll: () =>
    request<{ success: boolean; data: Notification[] }>("/api/notifications")
      .then((r) => r.data),

  /** Mark a single notification read (optimistic — real state is frontend) */
  markRead: (id: string) =>
    request<{ success: boolean }>(`/api/notifications/${id}/read`, {
      method: "PATCH",
    }),

  /** Unread count — derived from getAll */
  getUnreadCount: async () => {
    const notifs = await notificationsApi.getAll();
    return notifs.filter((n) => !n.read).length;
  },
};