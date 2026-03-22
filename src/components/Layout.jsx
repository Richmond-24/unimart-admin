
import React, { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listingsApi, notificationsApi, dashboardApi } from "../services/api.ts";

// ── Uni-Mart Brand Colors ─────────────────────────────────────────────────────
const C = {
  orange:      "#FF6A00",
  orangeLight: "#FFF1E6",
  orangeDark:  "#CC5500",
  white:       "#FFFFFF",
  surface:     "#F8F9FA",
  text:        "#1B1B1F",
  subtext:     "#6B7280",
  border:      "#EEEEEE",
  success:     "#10B981",
  warning:     "#F59E0B",
  error:       "#EF4444",
};

// ── Professionally Drawn SVG Icons ───────────────────────────────────────────
// Each icon is hand-crafted with clear, human-readable paths

function IconHome({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 3l9 9" />
      <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  );
}

function IconBox({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="17" />
      <line x1="9.5" y1="14.5" x2="14.5" y2="14.5" />
    </svg>
  );
}

function IconClock({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 15.5" />
    </svg>
  );
}

function IconUsers({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <path d="M16 3.13a4 4 0 010 7.75" />
      <path d="M21 21v-2a4 4 0 00-3-3.87" />
    </svg>
  );
}

function IconBell({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function IconSearch({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconMenu({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconLogout({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconChevronRight({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconShoppingBag({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function IconUser({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconTag({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function IconCheck({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── Notification Dropdown ─────────────────────────────────────────────────────
function NotificationDropdown({ onClose, onMarkAll }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsApi.getAll()
      .then(setNotifs)
      .finally(() => setLoading(false));
  }, []);

  const markRead = (id) => {
    setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
    notificationsApi.markRead(id); // fire and forget
  };

  const markAll = () => {
    setNotifs(n => n.map(x => ({ ...x, read: true })));
    onMarkAll?.();
  };

  const typeConfig = {
    order:   { icon: <IconShoppingBag size={14} />, color: C.orange   },
    user:    { icon: <IconUser size={14} />,        color: C.success   },
    product: { icon: <IconTag size={14} />,         color: C.warning   },
  };

  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
      style={{ background: C.white, border: `1px solid ${C.border}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: C.border }}>
        <div>
          <h3 className="font-bold text-sm" style={{ color: C.text }}>Notifications</h3>
          <p className="text-[11px] mt-0.5" style={{ color: C.subtext }}>
            {notifs.filter(n => !n.read).length} unread
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: C.subtext }}>
          <IconX size={16} />
        </button>
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : notifs.length === 0 ? (
          <div className="py-10 text-center">
            <IconBell size={28} color={C.subtext} />
            <p className="text-sm mt-2" style={{ color: C.subtext }}>No notifications yet</p>
          </div>
        ) : notifs.map(n => {
          const cfg = typeConfig[n.type] || typeConfig.order;
          return (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className="w-full flex gap-3 px-4 py-3 border-b text-left transition-colors hover:bg-orange-50"
              style={{ borderColor: C.border, background: n.read ? "transparent" : "#FFF8F4" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${cfg.color}18`, color: cfg.color }}
              >
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed" style={{ color: n.read ? C.subtext : C.text }}>
                  {n.message}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: C.subtext }}>{n.time}</p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: C.orange }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
        <button onClick={markAll} className="text-xs font-semibold transition-colors hover:opacity-70" style={{ color: C.orange }}>
          Mark all as read
        </button>
        <span className="text-[10px]" style={{ color: C.subtext }}>{notifs.length} total</span>
      </div>
    </div>
  );
}

// ── Pending Badge Dot ─────────────────────────────────────────────────────────
function PendingBadge({ count }) {
  if (!count) return null;
  return (
    <span
      className="ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
      style={{ background: C.orange, color: C.white }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [collapsed, setCollapsed]       = useState(false);
  const [showNotifs, setShowNotifs]     = useState(false);
  const [unreadCount, setUnreadCount]   = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [search, setSearch]             = useState("");

  const notifRef = useRef(null);

  // Fetch initial unread notification count
  useEffect(() => {
    notificationsApi.getUnreadCount()
      .then(setUnreadCount)
      .catch(() => setUnreadCount(0));
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Fetch live pending count for sidebar badge
  useEffect(() => {
    listingsApi.getPendingCount()
      .then(setPendingCount)
      .catch(() => setPendingCount(0));
  }, []);

  const handleNotifToggle = () => {
    setShowNotifs(v => !v);
    if (!showNotifs) setUnreadCount(0);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigation items — no Listings, no Settings
  const navItems = [
    { path: "/",               label: "Dashboard",       Icon: IconHome,  exact: true },
    { path: "/products",       label: "Products",        Icon: IconBox                },
    { path: "/products/pending", label: "Pending Approval", Icon: IconClock, badge: pendingCount },
    { path: "/users",          label: "Users",           Icon: IconUsers              },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const pageTitles = {
    "/":                  "Dashboard",
    "/products":          "Products",
    "/products/pending":  "Pending Approvals",
    "/users":             "Users",
  };
  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  const breadcrumbs = location.pathname.split("/").filter(Boolean);

  // ── Sidebar content (shared between desktop + mobile drawer) ────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b flex-shrink-0"
        style={{ borderColor: C.border }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
          style={{ background: `linear-gradient(135deg, #FF8A3C, ${C.orange})` }}
        >
          U
        </div>
        {(!collapsed || sidebarOpen) && (
          <div className="flex-1 min-w-0">
            <span className="font-black text-base tracking-tight block" style={{ color: C.text }}>Uni-Mart</span>
            <span className="text-[10px] font-semibold" style={{ color: C.subtext }}>Admin Panel</span>
          </div>
        )}
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="hidden lg:flex p-1.5 rounded-lg transition-colors hover:bg-orange-50 ml-auto flex-shrink-0"
          style={{ color: C.subtext }}
        >
          <IconMenu size={16} />
        </button>
        {/* Close drawer — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg transition-colors hover:bg-orange-50 ml-auto flex-shrink-0"
          style={{ color: C.subtext }}
        >
          <IconX size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {(!collapsed || sidebarOpen) && (
          <p
            className="text-[10px] uppercase tracking-[0.12em] px-3 mb-3 font-black"
            style={{ color: C.subtext }}
          >
            Main Menu
          </p>
        )}
        {navItems.map(({ path, label, Icon: NavIcon, exact, badge }) => {
          const active = isActive(path, exact);
          const showLabel = !collapsed || sidebarOpen;
          return (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 relative group"
              style={({ isActive: navActive }) => ({
                background: (navActive || active) ? C.orangeLight : "transparent",
                color:      (navActive || active) ? C.orange : C.text,
                justifyContent: !showLabel ? "center" : "flex-start",
              })}
            >
              <NavIcon size={18} color={(isActive(path, exact)) ? C.orange : C.text} />
              {showLabel && (
                <>
                  <span className="text-sm font-semibold flex-1">{label}</span>
                  {badge > 0 && <PendingBadge count={badge} />}
                  {active && !badge && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.orange }} />
                  )}
                </>
              )}
              {/* Tooltip when collapsed on desktop */}
              {!showLabel && (
                <div
                  className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg"
                  style={{ background: C.text, color: C.white }}
                >
                  {label}
                  {badge > 0 && ` (${badge})`}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-3 border-t flex-shrink-0" style={{ borderColor: C.border }}>
        {(!collapsed || sidebarOpen) ? (
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: C.surface }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
              style={{ background: `linear-gradient(135deg, #FF8A3C, ${C.orange})` }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" style={{ color: C.text }}>{user?.name || "Admin"}</p>
              <p className="text-[10px] truncate" style={{ color: C.subtext }}>Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
              style={{ color: C.subtext }}
              title="Sign out"
            >
              <IconLogout size={15} color={C.subtext} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-2.5 rounded-xl transition-colors hover:bg-red-50"
            style={{ color: C.subtext }}
            title="Sign out"
          >
            <IconLogout size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: C.surface }}>

      {/* ── Mobile Sidebar Overlay ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar — Desktop (collapsible) ───────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col h-screen border-r flex-shrink-0 transition-all duration-300"
        style={{
          background:   C.white,
          borderColor:  C.border,
          width:        collapsed ? 72 : 248,
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Sidebar — Mobile (drawer) ──────────────────────────────────────── */}
      <aside
        className="fixed top-0 left-0 z-50 h-full flex flex-col lg:hidden border-r transition-transform duration-300"
        style={{
          background:  C.white,
          borderColor: C.border,
          width:       280,
          transform:   sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header
          className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b flex-shrink-0"
          style={{ background: C.white, borderColor: C.border }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl transition-colors hover:bg-orange-50 flex-shrink-0"
            style={{ color: C.subtext }}
          >
            <IconMenu size={20} />
          </button>

          {/* Title + Breadcrumb */}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black truncate" style={{ color: C.text }}>
              {currentTitle}
            </h1>
            {breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] mt-0.5 flex-wrap" style={{ color: C.subtext }}>
                <span>Home</span>
                {breadcrumbs.map((p, i) => (
                  <React.Fragment key={i}>
                    <IconChevronRight size={10} color={C.subtext} />
                    <span
                      className="capitalize"
                      style={{ color: i === breadcrumbs.length - 1 ? C.orange : C.subtext }}
                    >
                      {p.replace("-", " ")}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Search — hidden on very small screens */}
          <div className="hidden sm:flex flex-1 max-w-xs ml-2">
            <div
              className="flex items-center gap-2 border rounded-xl px-3 py-2 w-full transition-colors focus-within:border-orange-300"
              style={{ borderColor: C.border, background: C.surface }}
            >
              <IconSearch size={15} color={C.subtext} />
              <input
                className="bg-transparent text-sm placeholder-gray-400 focus:outline-none flex-1 min-w-0"
                style={{ color: C.text }}
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleNotifToggle}
                className="relative p-2.5 rounded-xl transition-colors hover:bg-orange-50"
                style={{ color: C.subtext }}
                aria-label="Notifications"
              >
                <IconBell size={20} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center font-black"
                    style={{ background: C.orange }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <NotificationDropdown
                  onClose={() => setShowNotifs(false)}
                  onMarkAll={() => setUnreadCount(0)}
                />
              )}
            </div>

            {/* User avatar */}
            <div
              className="flex items-center gap-2 pl-2 ml-1 border-l"
              style={{ borderColor: C.border }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                style={{ background: `linear-gradient(135deg, #FF8A3C, ${C.orange})` }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold leading-tight" style={{ color: C.text }}>
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px]" style={{ color: C.subtext }}>Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          style={{ background: C.surface }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ── Pending Approvals Page ────────────────────────────────────────────────────
// Drop this in /pages/PendingApprovals.tsx or wherever your router expects it.
// It connects to your existing products API — replace the fetch logic with your real endpoint.

export function PendingApprovalsPage() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const loadPending = () => {
    setLoading(true);
    listingsApi.getPending()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const filtered = items.filter(item => {
    if (filter === "all") return true;
    const d = new Date(item.createdAt);
    const now = new Date();
    if (filter === "today") return d.toDateString() === now.toDateString();
    if (filter === "week")  return (now.getTime() - d.getTime()) < 7 * 86400000;
    return true;
  });

  const approve = async (id) => {
    setActionLoading(id + "_approve");
    try {
      await listingsApi.approve(id);
      setItems(p => p.filter(x => x._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async (id) => {
    setActionLoading(id + "_reject");
    try {
      await listingsApi.reject(id);
      setItems(p => p.filter(x => x._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const StatusBadge = ({ label, color }) => (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full"
      style={{ background: `${color}18`, color }}
    >
      {label}
    </span>
  );

  return (
    <div className="space-y-5 max-w-full">

      {/* Page header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h2 className="text-xl font-black" style={{ color: C.text }}>Pending Approvals</h2>
          <p className="text-sm mt-0.5" style={{ color: C.subtext }}>
            {loading ? "Loading…" : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} waiting for review`}
          </p>
        </div>
        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {["all", "today", "week"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors"
              style={{
                background: filter === f ? C.orange : C.surface,
                color:      filter === f ? C.white  : C.subtext,
                border:     `1px solid ${filter === f ? C.orange : C.border}`,
              }}
            >
              {f === "all" ? "All time" : f === "today" ? "Today" : "This week"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Pending",  value: items.length,                                   color: C.orange  },
          { label: "Today",    value: items.filter(i => { const d = new Date(i.createdAt); return d.toDateString() === new Date().toDateString(); }).length, color: C.warning },
          { label: "This Week",value: items.filter(i => (Date.now() - new Date(i.createdAt).getTime()) < 7*86400000).length, color: C.success },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border p-4 flex items-center gap-3" style={{ borderColor: C.border }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
              <IconClock size={18} color={color} />
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color }}>{value}</p>
              <p className="text-xs font-semibold" style={{ color: C.subtext }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content: list + detail panel */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* List */}
        <div className="flex-1 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
          {/* Table header — hidden on mobile */}
          <div
            className="hidden sm:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b text-[10px] font-black uppercase tracking-widest"
            style={{ borderColor: C.border, color: C.subtext, background: C.surface }}
          >
            <span>Product</span>
            <span>Seller</span>
            <span>Submitted</span>
            <span>Action</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: C.orangeLight }}>
                <IconCheck size={24} color={C.orange} />
              </div>
              <p className="font-black text-gray-800 mb-1">All caught up!</p>
              <p className="text-sm" style={{ color: C.subtext }}>No pending items for this filter.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.border }}>
              {filtered.map(item => (
                <div
                  key={item._id}
                  onClick={() => setSelected(item)}
                  className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 sm:gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-orange-50"
                  style={{ background: selected?._id === item._id ? "#FFF8F4" : undefined }}
                >
                  {/* Product */}
                  <div className="flex items-center gap-3 min-w-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border" style={{ borderColor: C.border }} />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.orangeLight }}>
                        <IconBox size={16} color={C.orange} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: C.text }}>{item.title}</p>
                      <p className="text-xs truncate" style={{ color: C.subtext }}>{item.category}</p>
                    </div>
                  </div>

                  {/* Seller */}
                  <div className="flex items-center gap-2 min-w-0 sm:self-center">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-black flex-shrink-0" style={{ background: C.orange }}>
                      {item.sellerName?.charAt(0) || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: C.text }}>{item.sellerName || "Unknown"}</p>
                      <p className="text-[10px] truncate" style={{ color: C.subtext }}>{item.sellerEmail}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="sm:self-center">
                    <p className="text-xs" style={{ color: C.subtext }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </p>
                    <p className="text-[10px]" style={{ color: C.subtext }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 sm:self-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => approve(item._id)}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors hover:opacity-85 disabled:opacity-50"
                      style={{ background: `${C.success}15`, color: C.success }}
                    >
                      {actionLoading === item._id + "_approve"
                        ? <span className="w-3 h-3 border border-green-400 border-t-green-600 rounded-full animate-spin" />
                        : <IconCheck size={13} color={C.success} />
                      } Approve
                    </button>
                    <button
                      onClick={() => reject(item._id)}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors hover:opacity-85 disabled:opacity-50"
                      style={{ background: `${C.error}12`, color: C.error }}
                    >
                      {actionLoading === item._id + "_reject"
                        ? <span className="w-3 h-3 border border-red-300 border-t-red-500 rounded-full animate-spin" />
                        : <IconX size={13} color={C.error} />
                      } Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel — slides in when item selected */}
        {selected && (
          <div
            className="w-full lg:w-72 xl:w-80 bg-white rounded-2xl border flex flex-col flex-shrink-0 overflow-hidden"
            style={{ borderColor: C.border }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
              <span className="font-black text-sm" style={{ color: C.text }}>Item Detail</span>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: C.subtext }}>
                <IconX size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Image */}
              {selected.imageUrl ? (
                <img src={selected.imageUrl} alt={selected.title} className="w-full h-40 object-cover rounded-xl border" style={{ borderColor: C.border }} />
              ) : (
                <div className="w-full h-40 rounded-xl flex items-center justify-center" style={{ background: C.orangeLight }}>
                  <IconBox size={32} color={C.orange} />
                </div>
              )}

              {/* Title & price */}
              <div>
                <h3 className="font-black text-base" style={{ color: C.text }}>{selected.title}</h3>
                <p className="text-xs mt-1" style={{ color: C.subtext }}>{selected.category}</p>
                <p className="text-2xl font-black mt-2" style={{ color: C.orange }}>GH₵{Number(selected.price || 0).toFixed(2)}</p>
              </div>

              {/* Details */}
              <div className="space-y-2.5">
                {[
                  { label: "Seller",    value: selected.sellerName  },
                  { label: "Email",     value: selected.sellerEmail },
                  { label: "Phone",     value: selected.sellerPhone || "—" },
                  { label: "Condition", value: selected.condition   },
                  { label: "Location",  value: selected.location || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-3">
                    <span className="text-xs flex-shrink-0" style={{ color: C.subtext }}>{label}</span>
                    <span className="text-xs font-semibold text-right truncate" style={{ color: C.text }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              {selected.description && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: C.subtext }}>Description</p>
                  <p className="text-xs leading-relaxed" style={{ color: C.text }}>{selected.description}</p>
                </div>
              )}

              {/* AI scores */}
              {selected.authenticityScore != null && (
                <div className="rounded-xl p-3 border space-y-2" style={{ borderColor: C.border, background: C.surface }}>
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: C.subtext }}>AI Analysis</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: C.subtext }}>Authenticity</span>
                    <span className="text-xs font-black" style={{ color: selected.authenticityScore > 0.7 ? C.success : C.error }}>
                      {Math.round(selected.authenticityScore * 100)}%
                    </span>
                  </div>
                  {selected.isFake && (
                    <div className="text-[11px] rounded-lg p-2" style={{ background: `${C.error}12`, color: C.error }}>
                      ⚠ Fake product detected — {selected.fakeDetectionNotes}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Panel actions */}
            <div className="px-5 py-4 border-t flex gap-3" style={{ borderColor: C.border }}>
              <button
                onClick={() => approve(selected._id)}
                disabled={!!actionLoading}
                className="flex-1 py-3 rounded-xl font-black text-sm text-white transition-colors hover:opacity-85 disabled:opacity-50"
                style={{ background: C.success }}
              >
                {actionLoading === selected._id + "_approve"
                  ? "Approving…"
                  : "Approve"
                }
              </button>
              <button
                onClick={() => reject(selected._id)}
                disabled={!!actionLoading}
                className="flex-1 py-3 rounded-xl font-black text-sm transition-colors hover:opacity-85 disabled:opacity-50"
                style={{ background: `${C.error}15`, color: C.error }}
              >
                {actionLoading === selected._id + "_reject"
                  ? "Rejecting…"
                  : "Reject"
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}