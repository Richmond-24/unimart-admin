
import React, { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationsApi } from "../services/api";

// ── Uni-Mart Color Scheme ───────────────────────────────────────────────────
const COLORS = {
  primary: '#FF6A00',
  primaryLight: '#FFF1E6',
  primaryGradient: 'linear-gradient(135deg, #FF8A3C, #FF6A00)',
  primaryDark: '#CC5500',
  primaryDeep: '#B34700',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  cardBg: '#CC5500',
  cardBgDark: '#B34700',
  cardBgHover: '#E65C00',
  text: '#1B1B1F',
  textLight: '#FFFFFF',
  subtext: '#6B7280',
  border: '#EEEEEE',
  dark: '#232F3E',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  sidebarBg: '#FFFFFF',
  sidebarHover: '#FFF3EC',
  headerBg: '#FFFFFF',
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d={d} />
  </svg>
);

const IC = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  box: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  cog: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  chevronRight: "M9 18l6-6-6-6",
  order: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
  stock: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  user2: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  x: "M18 6L6 18 M6 6l12 12",
};

const notifTypeIcon = { order: IC.order, stock: IC.stock, user: IC.user2 };
const notifTypeColor = { order: COLORS.primary, stock: COLORS.warning, user: COLORS.success };

function NotificationDropdown({ onClose }) {
  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    notificationsApi.getAll().then(setNotifs);
  }, []);

  const markRead = (id) => {
    setNotifs((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
    notificationsApi.markRead(id);
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-in"
      style={{ background: COLORS.background, border: `1px solid ${COLORS.border}` }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
        <h3 className="font-semibold text-sm" style={{ color: COLORS.text }}>Notifications</h3>
        <button onClick={onClose} className="transition-colors" style={{ color: COLORS.subtext }}>
          <Icon d={IC.x} size={15} />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifs.map((n) => (
          <div key={n.id}
            className={`flex gap-3 px-4 py-3 border-b cursor-pointer transition-colors hover:bg-${COLORS.primaryLight}`}
            style={{ borderColor: COLORS.border, background: n.read ? 'transparent' : COLORS.primaryLight }}
            onClick={() => markRead(n.id)}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${notifTypeColor[n.type]}15` }}>
              <Icon d={notifTypeIcon[n.type]} size={14} style={{ color: notifTypeColor[n.type] }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-relaxed" style={{ color: n.read ? COLORS.subtext : COLORS.text }}>
                {n.message}
              </p>
              <p className="text-xs mt-0.5" style={{ color: COLORS.subtext }}>{n.time}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: COLORS.primary }} />}
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 text-center border-t" style={{ borderColor: COLORS.border }}>
        <button className="text-xs transition-colors hover:opacity-80" style={{ color: COLORS.primary }}>
          Mark all as read
        </button>
      </div>
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unread, setUnread] = useState(3);
  const [search, setSearch] = useState("");
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNotifToggle = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs) setUnread(0);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Updated navItems with new Listings route
  const navItems = [
    { path: "/", label: "Dashboard", icon: IC.home, exact: true },
    { path: "/products", label: "Products", icon: IC.box },
    { path: "/products/listings", label: "Listings", icon: IC.order }, // New listings page
    { path: "/products/pending", label: "Pending", icon: IC.order },
    { path: "/users", label: "Users", icon: IC.users },
    { path: "/settings", label: "Settings", icon: IC.cog },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  // Updated titles with new Listings title
  const titles = { 
    "/": "Dashboard", 
    "/products": "Products", 
    "/products/listings": "Product Listings", // New title
    "/products/pending": "Pending Approvals",
    "/users": "Users", 
    "/settings": "Settings" 
  };
  
  const currentTitle = titles[location.pathname] || "Dashboard";

  const breadcrumbs = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return null;
    return (
      <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: COLORS.subtext }}>
        <span>Uni-Mart</span>
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            <Icon d={IC.chevronRight} size={10} />
            <span className="capitalize" style={{ color: i === parts.length - 1 ? COLORS.primary : COLORS.subtext }}>
              {p}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: COLORS.surface }}>
      {/* ── Sidebar ── */}
      <aside
        className="h-screen flex flex-col border-r transition-all duration-300 flex-shrink-0"
        style={{ 
          background: COLORS.background, 
          borderColor: COLORS.border,
          width: collapsed ? 80 : 260 
        }}>
        
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: COLORS.border }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ background: COLORS.primaryGradient }}>
            U
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight flex-1" style={{ color: COLORS.text }}>
              Uni-Mart
            </span>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className="transition-colors ml-auto p-1 rounded-lg hover:bg-opacity-10"
            style={{ color: COLORS.subtext, hover: { background: COLORS.primaryLight } }}>
            <Icon d={IC.menu} size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-xs uppercase tracking-widest px-3 mb-3 font-semibold" style={{ color: COLORS.subtext }}>
              Main Menu
            </p>
          )}
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: navIsActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                  ${(navIsActive || active) ? 'font-medium' : ''}`
                }
                style={({ isActive: navIsActive }) => ({
                  background: (navIsActive || active) ? COLORS.primaryLight : 'transparent',
                  color: (navIsActive || active) ? COLORS.primary : COLORS.text,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                })}
                end={item.exact}>
                <Icon d={item.icon} size={18} className="flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
                {!collapsed && active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: COLORS.primary }} />
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap z-50
                    opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg"
                    style={{ 
                      background: COLORS.background, 
                      color: COLORS.text,
                      border: `1px solid ${COLORS.border}` 
                    }}>
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="px-3 py-3 border-t" style={{ borderColor: COLORS.border }}>
          {!collapsed ? (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-opacity-50"
              style={{ background: COLORS.surface }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: COLORS.primaryGradient }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: COLORS.text }}>{user?.name || 'Admin'}</p>
                <p className="text-xs truncate" style={{ color: COLORS.subtext }}>Administrator</p>
              </div>
              <button onClick={handleLogout}
                className="transition-colors p-1 rounded-lg hover:bg-opacity-10"
                style={{ color: COLORS.subtext, hover: { color: COLORS.error } }}
                title="Logout">
                <Icon d={IC.logout} size={15} />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout}
              className="w-full flex justify-center p-2.5 rounded-xl transition-colors"
              style={{ color: COLORS.subtext, hover: { color: COLORS.error, background: `${COLORS.error}10` } }}
              title="Logout">
              <Icon d={IC.logout} size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
          style={{ background: COLORS.background, borderColor: COLORS.border }}>
          
          <div>
            <h1 className="text-xl font-bold" style={{ color: COLORS.text }}>{currentTitle}</h1>
            {breadcrumbs()}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs ml-4">
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-opacity-20"
              style={{ 
                borderColor: COLORS.border, 
                background: COLORS.surface,
                ring: COLORS.primary
              }}>
              <Icon d={IC.search} size={15} style={{ color: COLORS.subtext }} />
              <input
                className="bg-transparent text-sm placeholder-transparent focus:outline-none flex-1"
                style={{ color: COLORS.text }}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleNotifToggle}
                className="relative p-2.5 rounded-xl transition-all"
                style={{ background: COLORS.surface, color: COLORS.subtext }}>
                <Icon d={IC.bell} size={18} />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs text-white flex items-center justify-center font-bold"
                    style={{ background: COLORS.primary }}>
                    {unread}
                  </span>
                )}
              </button>
              {showNotifs && <NotificationDropdown onClose={() => setShowNotifs(false)} />}
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2 pl-2 ml-1 border-l" style={{ borderColor: COLORS.border }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                style={{ background: COLORS.primaryGradient }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold leading-tight" style={{ color: COLORS.text }}>{user?.name || 'Admin'}</p>
                <p className="text-xs" style={{ color: COLORS.subtext }}>Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: COLORS.surface }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}