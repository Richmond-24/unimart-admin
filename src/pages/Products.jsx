
import React, { useState, useEffect } from "react";
import { productsApi } from "../services/api";

// ── Modern, Minimalist SVG Icons ──────────────────────────────────────────
const Icons = {
  // Modern cube/grid icon for Total Products (replaces old package)
  Products: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),

  // Modern pulse/heartbeat for Active products (replaces checkmark)
  Active: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 12H6L9 6L12 18L15 10L18 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2 2"/>
    </svg>
  ),

  // Modern gauge/speedometer for Low Stock (replaces warning triangle)
  LowStock: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 6V12L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <path d="M12 3V5M12 19V21M21 12H19M5 12H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),

  // Modern ban/slash circle for Out of Stock (replaces X)
  OutOfStock: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.3"/>
    </svg>
  ),

  // Modern wallet/card for Inventory Value (replaces bag)
  Value: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 12H16M7 9H9M15 9H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="18" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),

  // Modern team/people for Sellers (replaces old users)
  Sellers: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="8" cy="10" r="3" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M2 18V17C2 14.2 4.2 12 7 12H9C11.8 12 14 14.2 14 17V18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M14 16V15C14 12.8 15.8 11 18 11C20.2 11 22 12.8 22 15V16" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),

  // Modern chart/bar for Revenue (replaces dollar)
  Revenue: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21 21H3V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 15L10 10L13 12L18 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="19" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),

  // Modern arrow/trend for Growth (replaces old trending)
  Growth: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2 20L8 14L12 18L22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 8H22V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="6" r="1.5" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  ),

  // Modern sparkle/star for Featured
  Sparkle: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2L14 9H21L16 14L18 21L12 17L6 21L8 14L3 9H10L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  ),
};

// ── Soft, Modern Color Palette ────────────────────────────────────────────
const Colors = {
  bg: '#f8fafc',
  card: '#ffffff',
  cardHover: '#f1f5f9',
  primary: '#3b82f6',
  primaryLight: '#eff6ff',
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  text: '#0f172a',
  textLight: '#475569',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  
  // Modern accent colors
  purple: '#8b5cf6',
  purpleLight: '#ede9fe',
  pink: '#ec4899',
  pinkLight: '#fce7f3',
  teal: '#14b8a6',
  tealLight: '#ccfbf1',
  indigo: '#6366f1',
  indigoLight: '#e0e7ff',
};

// ── Stat Card Component with Modern Icons ─────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bgColor, trend, subtitle }) {
  return (
    <div className="rounded-xl p-6 border transition-all hover:shadow-md hover:scale-[1.02] duration-200"
         style={{ background: Colors.card, borderColor: Colors.border }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
             style={{ background: bgColor || `${color}10` }}>
          <Icon size={22} style={{ color: color }} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1
            ${trend >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: Colors.textMuted }}>{label}</p>
      <p className="text-2xl font-semibold tracking-tight" style={{ color: Colors.text }}>{value}</p>
      {subtitle && <p className="text-xs mt-2" style={{ color: Colors.textLight }}>{subtitle}</p>}
    </div>
  );
}

// ── Main Products Component ───────────────────────────────────────────────
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 184,
    active: 142,
    lowStock: 23,
    outOfStock: 19,
    totalValue: 284500,
    totalSellers: 56,
    revenue: 45200,
    growth: 23.5
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(false);
      // const data = await productsApi.getStats();
      // setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  // Modern stats cards with new icons
  const statCards = [
    {
      icon: Icons.Products,
      label: "Total Products",
      value: stats.total.toLocaleString(),
      color: Colors.primary,
      bgColor: Colors.primaryLight,
      trend: 12.5,
      subtitle: "↑ 18 this month"
    },
    {
      icon: Icons.Active,
      label: "Active",
      value: stats.active.toLocaleString(),
      color: Colors.success,
      bgColor: Colors.successLight,
      trend: 8.2,
      subtitle: "77% of inventory"
    },
    {
      icon: Icons.LowStock,
      label: "Low Stock",
      value: stats.lowStock.toLocaleString(),
      color: Colors.warning,
      bgColor: Colors.warningLight,
      trend: -5.1,
      subtitle: "Need reorder soon"
    },
    {
      icon: Icons.OutOfStock,
      label: "Out of Stock",
      value: stats.outOfStock.toLocaleString(),
      color: Colors.danger,
      bgColor: Colors.dangerLight,
      trend: 2.3,
      subtitle: "Restock required"
    },
    {
      icon: Icons.Value,
      label: "Inventory Value",
      value: `$${(stats.totalValue / 1000).toFixed(1)}K`,
      color: Colors.indigo,
      bgColor: Colors.indigoLight,
      trend: 15.8,
      subtitle: "Avg. $1,546 per item"
    },
    {
      icon: Icons.Sellers,
      label: "Active Sellers",
      value: stats.totalSellers.toLocaleString(),
      color: Colors.purple,
      bgColor: Colors.purpleLight,
      trend: 22.4,
      subtitle: "12 new this month"
    },
    {
      icon: Icons.Revenue,
      label: "Monthly Revenue",
      value: `$${(stats.revenue / 1000).toFixed(1)}K`,
      color: Colors.pink,
      bgColor: Colors.pinkLight,
      trend: 18.3,
      subtitle: "↑ 8.2% vs last month"
    },
    {
      icon: Icons.Growth,
      label: "Growth Rate",
      value: `${stats.growth}%`,
      color: Colors.teal,
      bgColor: Colors.tealLight,
      trend: 23.5,
      subtitle: "Year over year"
    }
  ];

  if (loading) {
    return (
      <div className="p-8" style={{ background: Colors.bg, minHeight: '100vh' }}>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl p-6 border animate-pulse"
                 style={{ background: Colors.card, borderColor: Colors.border }}>
              <div className="w-12 h-12 rounded-xl mb-4" style={{ background: Colors.border }}></div>
              <div className="w-20 h-4 mb-2 rounded" style={{ background: Colors.border }}></div>
              <div className="w-16 h-6 rounded" style={{ background: Colors.border }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8" style={{ background: Colors.bg, minHeight: '100vh' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: Colors.text }}>Products</h1>
          <p className="text-sm mt-2" style={{ color: Colors.textLight }}>
            Monitor your product performance and inventory levels
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md"
                style={{ background: Colors.primary, color: 'white' }}>
          <Icons.Sparkle size={18} />
          Add Product
        </button>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Insights Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Category Distribution */}
        <div className="rounded-xl p-6 border col-span-1" style={{ background: Colors.card, borderColor: Colors.border }}>
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: Colors.text }}>
            <Icons.Products size={18} style={{ color: Colors.primary }} />
            Top Categories
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Electronics', count: 64, percentage: 35 },
              { name: 'Fashion', count: 48, percentage: 26 },
              { name: 'Home & Living', count: 32, percentage: 17 },
              { name: 'Sports', count: 24, percentage: 13 },
              { name: 'Books', count: 16, percentage: 9 },
            ].map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span style={{ color: Colors.textLight }}>{cat.name}</span>
                  <span className="font-medium" style={{ color: Colors.text }}>{cat.count}</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: Colors.border }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${cat.percentage}%`, background: Colors.primary }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl p-6 border col-span-1" style={{ background: Colors.card, borderColor: Colors.border }}>
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: Colors.text }}>
            <Icons.Growth size={18} style={{ color: Colors.teal }} />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: 'New product added', item: 'MacBook Pro M3', time: '5 min ago', icon: Icons.Sparkle },
              { action: 'Stock updated', item: 'AirPods Pro', time: '15 min ago', icon: Icons.Value },
              { action: 'Low stock alert', item: 'iPhone 15 Case', time: '1 hour ago', icon: Icons.LowStock },
              { action: 'Product sold out', item: 'Sony Headphones', time: '3 hours ago', icon: Icons.OutOfStock },
            ].map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                       style={{ background: `${Colors.primary}10` }}>
                    <Icon size={14} style={{ color: Colors.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: Colors.text }}>{activity.action}</p>
                    <p className="text-xs mt-0.5" style={{ color: Colors.textLight }}>{activity.item}</p>
                  </div>
                  <span className="text-xs" style={{ color: Colors.textMuted }}>{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="rounded-xl p-6 border col-span-1" style={{ background: Colors.card, borderColor: Colors.border }}>
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: Colors.text }}>
            <Icons.Revenue size={18} style={{ color: Colors.pink }} />
            Key Metrics
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Conversion Rate', value: '3.2%', change: '+0.8%', icon: Icons.Active },
              { label: 'Avg. Order Value', value: '$189', change: '+$12', icon: Icons.Value },
              { label: 'Return Rate', value: '1.4%', change: '-0.3%', icon: Icons.OutOfStock },
              { label: 'Customer Rating', value: '4.8★', change: '+0.2★', icon: Icons.Sparkle },
            ].map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={14} style={{ color: Colors.textMuted }} />
                    <span className="text-sm" style={{ color: Colors.textLight }}>{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: Colors.text }}>{metric.value}</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {metric.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}