
// /home/richmond/Downloads/unimart-admin (1)/app/unimart-admin/src/pages/Dashboard/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { dashboardApi, ordersApi } from "../../services/api.ts";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const IC = {
  dollar: "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  orders: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
  users:  "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  box:    "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  up:     "M18 15l-6-6-6 6",
  down:   "M6 9l6 6 6-6",
  cal:    "M3 4h18v18H3z M3 9h18 M8 2v4 M16 2v4",
  eye:    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
  pending:"M12 8v4l3 3 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  active: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  trend:  "M22 12h-4l-3 9-4-18-3 9H2",
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  delivered:  { background: "#eafaf1", color: "#1a7a45" },
  shipped:    { background: "#e8f4fd", color: "#1a5a8a" },
  processing: { background: "#fff8e1", color: "#a07000" },
  cancelled:  { background: "#fff0f0", color: "#c0392b" },
  refunded:   { background: "#f3eeff", color: "#6a3db8" },
  pending:    { background: "#fff3e0", color: "#e65100" },
  active:     { background: "#e8f5e9", color: "#2e7d32" },
  rejected:   { background: "#ffebee", color: "#c62828" },
};

// ─── Shared style tokens ───────────────────────────────────────────────────────
const S = {
  page:  { padding: "1.25rem", display: "grid", gap: "1rem", background: "#f5f5f5", minHeight: "100vh" },
  card:  { background: "#fff", border: "0.5px solid #e8e0d8", borderRadius: "14px" },
  cardP: { background: "#fff", border: "0.5px solid #e8e0d8", borderRadius: "14px", padding: "1.25rem" },
  label: { fontSize: "12px", color: "#999", marginBottom: "2px" },
  val:   { fontSize: "24px", fontWeight: 500, color: "#1a1208", letterSpacing: "-0.5px" },
  h3:    { fontSize: "15px", fontWeight: 500, color: "#1a1208" },
  muted: { fontSize: "12px", color: "#aaa" },
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e8e0d8", borderRadius: "8px", padding: "8px 12px", fontSize: "12px" }}>
      <p style={{ color: "#aaa", marginBottom: "4px" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 500 }}>
          {p.name === "revenue" ? `GH₵${p.value.toLocaleString()}` : 
           p.name === "orders" ? `${p.value.toLocaleString()} orders` :
           p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ─── Sparkline (tiny inline chart) ───────────────────────────────────────────
function Sparkline({ data, color }) {
  if (!data || data.length === 0) return null;
  const w = 100, h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h * 0.75 - h * 0.1;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, delta, positive, iconD, iconColor, iconBg, spark, sparkColor, foot, onClick }) {
  return (
    <div style={{ ...S.cardP, display: "flex", flexDirection: "column", gap: "10px", cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={iconD} color={iconColor} size={18} />
        </div>
        {delta !== undefined && (
          <span style={{
            display: "flex", alignItems: "center", gap: 3,
            background: positive ? "#eafaf1" : "#fff0f0",
            color: positive ? "#1a7a45" : "#c0392b",
            borderRadius: 20, fontSize: 11, fontWeight: 500, padding: "3px 8px",
          }}>
            <Icon d={positive ? IC.up : IC.down} size={10} color={positive ? "#1a7a45" : "#c0392b"} />
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div>
        <div style={S.val}>{value}</div>
        <div style={S.label}>{title}</div>
      </div>
      {spark && <div style={{ height: 36 }}><Sparkline data={spark} color={sparkColor} /></div>}
      {foot && (
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.5px solid #f0ebe4", paddingTop: 8, fontSize: 12, color: "#aaa" }}>
          <span>vs last month</span>
          <span style={{ color: positive ? "#1a7a45" : "#c0392b", fontWeight: 500 }}>{foot}</span>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [chartType, setChartType] = useState("area");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30d");
  
  // Data states
  const [kpi, setKpi] = useState({
    revenue: 0,
    revenueTrend: 0,
    orders: 0,
    ordersTrend: 0,
    customers: 0,
    customersTrend: 0,
    products: 0,
    aov: 0,
    pendingApprovals: 0,
    activeListings: 0,
    conversionRate: 0
  });
  
  const [revenueData, setRevenueData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [listingsByStatus, setListingsByStatus] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all dashboard data in parallel
      const [
        kpiResult,
        salesTrendResult,
        categoriesResult,
        topProductsResult,
        geoResult,
        ordersResult
      ] = await Promise.allSettled([
        dashboardApi.getKPI(dateRange),
        dashboardApi.getSalesTrend(dateRange),
        dashboardApi.getCategoryPerformance(dateRange),
        dashboardApi.getTopProducts(dateRange),
        dashboardApi.getGeoDistribution(dateRange),
        dashboardApi.getRecentOrders()
      ]);

      // Handle KPI
      if (kpiResult.status === 'fulfilled') {
        setKpi(prev => ({
          ...prev,
          ...kpiResult.value,
          products: 1284, // Mock data - replace with real product count
          pendingApprovals: 12, // Mock data - replace with real pending count
          activeListings: 48 // Mock data - replace with real active count
        }));
      }

      // Handle sales trend data
      if (salesTrendResult.status === 'fulfilled') {
        setRevenueData(salesTrendResult.value);
      }

      // Handle categories
      if (categoriesResult.status === 'fulfilled') {
        const data = categoriesResult.value.map((cat, i) => ({
          ...cat,
          color: getCategoryColor(i)
        }));
        setCategoriesData(data);
      }

      // Handle top products
      if (topProductsResult.status === 'fulfilled') {
        const maxSales = Math.max(...topProductsResult.value.map(p => p.sold), 1);
        setTopProducts(topProductsResult.value.map(p => ({
          name: p.name,
          cat: p.category,
          sales: p.sold,
          revenue: p.revenue,
          pct: Math.round((p.sold / maxSales) * 100) || 100
        })));
      }

      // Handle geo data
      if (geoResult.status === 'fulfilled') {
        const maxPct = Math.max(...geoResult.value.map(g => g.percentage), 1);
        setGeoData(geoResult.value.map(g => ({
          flag: getCountryFlag(g.name),
          country: g.name,
          value: `${g.percentage}%`,
          pct: Math.round((g.percentage / maxPct) * 100)
        })));
      }

      // Handle recent orders
      if (ordersResult.status === 'fulfilled') {
        setRecentOrders(ordersResult.value.map(order => ({
          id: order.id,
          customer: order.customer,
          product: order.product || 'Product',
          amount: order.amount,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          date: formatDate(new Date())
        })));
      }

      // Mock activity feed (replace with real data later)
      setActivityFeed([
        { color: "#27ae60", text: "New order received", time: "2 min ago" },
        { color: "#f97316", text: "Product low stock alert", time: "18 min ago" },
        { color: "#2980b9", text: "New vendor registered", time: "42 min ago" },
        { color: "#e74c3c", text: "Payment failed", time: "1 hr ago" },
        { color: "#8e44ad", text: "New customer signup", time: "2 hr ago" },
      ]);

      // Mock listings by status (replace with real data)
      setListingsByStatus([
        { name: "Pending", value: 12, color: "#f97316" },
        { name: "Active", value: 48, color: "#27ae60" },
        { name: "Rejected", value: 8, color: "#e74c3c" },
        { name: "Sold", value: 32, color: "#2980b9" }
      ]);

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    setRevenueData(generateMockRevenueData());
    setCategoriesData(generateMockCategories());
    setTopProducts(generateMockTopProducts());
    setGeoData(generateMockGeoData());
    setRecentOrders(generateMockOrders());
    setActivityFeed(generateMockActivity());
    setListingsByStatus([
      { name: "Pending", value: 12, color: "#f97316" },
      { name: "Active", value: 48, color: "#27ae60" },
      { name: "Rejected", value: 8, color: "#e74c3c" },
      { name: "Sold", value: 32, color: "#2980b9" }
    ]);
  };

  const last6 = revenueData.slice(-6);

  if (loading && !revenueData.length) {
    return (
      <div style={S.page}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ ...S.card, height: 160, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={S.page}>
        <div style={{ ...S.cardP, textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#c0392b', marginBottom: '16px' }}>{error}</p>
          <button 
            onClick={fetchDashboardData}
            style={{
              background: '#f97316',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* Header with date range selector */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: "#1a1208" }}>Marketplace Dashboard</h2>
          <p style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
            Real-time analytics from your marketplace
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", background: "#fff", border: "0.5px solid #e0d0c0", borderRadius: 8, padding: "4px" }}>
          {["24h", "7d", "30d", "90d", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                background: dateRange === range ? "#f97316" : "transparent",
                color: dateRange === range ? "#fff" : "#666",
              }}
            >
              {range === "24h" ? "24 hours" : 
               range === "7d" ? "7 days" : 
               range === "30d" ? "30 days" : 
               range === "90d" ? "90 days" : "1 year"}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 }}>
        <StatCard 
          title="Total revenue" 
          value={`GH₵${(kpi.revenue / 1000).toFixed(1)}k`}
          delta={kpi.revenueTrend} 
          positive={kpi.revenueTrend > 0} 
          iconD={IC.dollar} 
          iconColor="#f97316" 
          iconBg="#fff3eb"
          spark={revenueData.slice(-6).map(d => d.revenue / 1000)} 
          sparkColor="#f97316" 
          foot={`+GH₵${(kpi.revenueTrend * 1000).toFixed(0)}`} 
        />
        <StatCard 
          title="Total orders" 
          value={kpi.orders.toLocaleString()} 
          delta={kpi.ordersTrend} 
          positive={kpi.ordersTrend > 0} 
          iconD={IC.orders} 
          iconColor="#2980b9" 
          iconBg="#e8f4fd"
          spark={revenueData.slice(-6).map(d => d.orders / 10)} 
          sparkColor="#2980b9" 
          foot={`+${Math.round(kpi.ordersTrend * 10)}`} 
        />
        <StatCard 
          title="Total products" 
          value={kpi.products.toLocaleString()} 
          iconD={IC.box} 
          iconColor="#27ae60" 
          iconBg="#eafaf1"
          spark={[980, 1020, 1100, 1150, 1200, 1284]} 
          sparkColor="#27ae60" 
        />
        <StatCard 
          title="Avg. order value" 
          value={`GH₵${kpi.aov.toFixed(0)}`} 
          delta={kpi.aovTrend} 
          positive={kpi.aovTrend > 0} 
          iconD={IC.trend} 
          iconColor="#8e44ad" 
          iconBg="#f3eeff"
          sparkColor="#8e44ad" 
        />
      </div>

      {/* Pending approvals alert */}
      {kpi.pendingApprovals > 0 && (
        <div style={{ ...S.cardP, background: "#fff3e0", border: "1px solid #f97316", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={IC.pending} color="white" size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#e65100" }}>{kpi.pendingApprovals} listing{kpi.pendingApprovals > 1 ? 's' : ''} pending approval</h3>
              <p style={{ fontSize: "13px", color: "#a07000" }}>Review and approve listings to make them live</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/admin/listings?status=pending'}
            style={{
              background: "#f97316",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Review now →
          </button>
        </div>
      )}

      {/* Revenue chart + Listings by status */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 12 }}>
        <div style={S.cardP}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <p style={S.h3}>Revenue overview</p>
              <p style={S.muted}>Performance over time</p>
            </div>
            <div style={{ display: "flex", gap: 4, background: "#f5f0eb", borderRadius: 8, padding: 3 }}>
              {["area", "bar"].map((t) => (
                <button key={t} onClick={() => setChartType(t)} style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer",
                  background: chartType === t ? "#f97316" : "transparent",
                  color: chartType === t ? "#fff" : "#888",
                }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            {chartType === "bar" ? (
              <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f0eb" />
                <XAxis dataKey="date" tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `GH₵${(v/1000).toFixed(0)}k`} width={52} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="revenue" name="revenue" fill="#f97316" radius={[5, 5, 0, 0]} opacity={0.85} />
              </BarChart>
            ) : (
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f0eb" />
                <XAxis dataKey="date" tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `GH₵${(v/1000).toFixed(0)}k`} width={52} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#f97316" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: "#f97316" }} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <div style={S.cardP}>
          <p style={S.h3}>Listings by status</p>
          <p style={S.muted}>Click to filter</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginBottom: 12 }}>
            {listingsByStatus.map((item) => (
              <span 
                key={item.name} 
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#555", cursor: "pointer" }}
                onClick={() => window.location.href = `/admin/listings?status=${item.name.toLowerCase()}`}
              >
                <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, display: "inline-block" }} />
                {item.name} {item.value}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie 
                data={listingsByStatus} 
                cx="50%" 
                cy="50%" 
                innerRadius={45} 
                outerRadius={70} 
                paddingAngle={3} 
                dataKey="value"
                onClick={(data) => window.location.href = `/admin/listings?status=${data.name.toLowerCase()}`}
                style={{ cursor: "pointer" }}
              >
                {listingsByStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v} listings`]} contentStyle={{ background: "#fff", border: "0.5px solid #e8e0d8", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders table + Right column */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 12, alignItems: "start" }}>
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 1.25rem 0.8rem", borderBottom: "0.5px solid #f0ebe4" }}>
            <div><p style={S.h3}>Recent orders</p><p style={S.muted}>Latest transactions</p></div>
            <button style={{ fontSize: 12, color: "#f97316", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
          </div>
          <div style={{ overflowX: "auto", padding: "0 1.25rem 1.25rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Order", "Customer", "Product", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} style={{ textAlign: "left", color: "#bbb", fontSize: 11, fontWeight: 500, padding: "0 0 10px", textTransform: "uppercase", letterSpacing: ".05em", borderBottom: "0.5px solid #f0ebe4", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={i}>
                    <td style={{ padding: "11px 0", color: "#f97316", fontFamily: "monospace", fontSize: 12, borderBottom: "0.5px solid #f8f3ef", whiteSpace: "nowrap" }}>{o.id}</td>
                    <td style={{ padding: "11px 12px 11px 0", color: "#333", borderBottom: "0.5px solid #f8f3ef", whiteSpace: "nowrap" }}>{o.customer}</td>
                    <td style={{ padding: "11px 12px 11px 0", color: "#888", fontSize: 12, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", borderBottom: "0.5px solid #f8f3ef" }}>{o.product}</td>
                    <td style={{ padding: "11px 12px 11px 0", fontWeight: 500, color: "#1a1208", borderBottom: "0.5px solid #f8f3ef", whiteSpace: "nowrap" }}>GH₵{o.amount}</td>
                    <td style={{ padding: "11px 12px 11px 0", borderBottom: "0.5px solid #f8f3ef" }}>
                      <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500, ...(STATUS_STYLES[o.status?.toLowerCase()] || STATUS_STYLES.processing) }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: "11px 0", color: "#bbb", fontSize: 12, borderBottom: i === recentOrders.length - 1 ? "none" : "0.5px solid #f8f3ef", whiteSpace: "nowrap" }}>{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {/* Top products */}
          <div style={S.cardP}>
            <p style={S.h3}>Top performing products</p>
            <p style={S.muted}>By revenue</p>
            {topProducts.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < topProducts.length - 1 ? "0.5px solid #f8f3ef" : "none" }}>
                <span style={{ width: 20, fontSize: 12, color: "#ccc", fontWeight: 500, textAlign: "center" }}>{i + 1}</span>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f5f0eb", border: "0.5px solid #e8e0d8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={IC.box} color="#f97316" size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: "#bbb", marginTop: 1 }}>{p.cat}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                    <div style={{ flex: 1, height: 4, background: "#f0ebe4", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${p.pct}%`, height: "100%", background: "#f97316", borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>{p.sales} sold</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Geo distribution */}
          <div style={S.cardP}>
            <p style={S.h3}>Top regions</p>
            <p style={S.muted}>By sales volume</p>
            {geoData.map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < geoData.length - 1 ? "0.5px solid #f8f3ef" : "none" }}>
                <span style={{ fontSize: 16 }}>{g.flag}</span>
                <span style={{ fontSize: 13, color: "#333", flex: 1 }}>{g.country}</span>
                <div style={{ width: 80, height: 4, background: "#f0ebe4", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${g.pct}%`, height: "100%", background: "#f97316", borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 12, color: "#888", fontWeight: 500, minWidth: 45, textAlign: "right" }}>{g.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dual chart + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 12 }}>
        <div style={S.cardP}>
          <p style={S.h3}>Revenue vs orders</p>
          <p style={S.muted}>Last 6 periods comparison</p>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={last6} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f0eb" />
              <XAxis dataKey="date" tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rev" tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `GH₵${(v/1000).toFixed(0)}k`} width={52} />
              <YAxis yAxisId="ord" orientation="right" tick={{ fill: "#2980b9", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<ChartTooltip />} />
              <Bar yAxisId="rev" dataKey="revenue" name="revenue" fill="#f97316" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Line yAxisId="ord" type="monotone" dataKey="orders" name="orders" stroke="#2980b9" strokeWidth={2} dot={{ r: 3, fill: "#2980b9" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div style={S.cardP}>
          <p style={S.h3}>Recent activity</p>
          <p style={S.muted}>Live store events</p>
          {activityFeed.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: i < activityFeed.length - 1 ? "0.5px solid #f8f3ef" : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, marginTop: 4 }} />
              <div>
                <p style={{ fontSize: 13, color: "#333" }}>{a.text}</p>
                <p style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getCategoryColor(index) {
  const colors = ["#f97316", "#2980b9", "#27ae60", "#8e44ad", "#e74c3c", "#f39c12"];
  return colors[index % colors.length];
}

function getCountryFlag(country) {
  const flags = {
    'Accra': '🇬🇭',
    'Kumasi': '🇬🇭',
    'Takoradi': '🇬🇭',
    'Tamale': '🇬🇭',
    'Cape Coast': '🇬🇭',
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Germany': '🇩🇪',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Other': '🌍'
  };
  return flags[country] || '🌍';
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Mock data generators (fallbacks)
function generateMockRevenueData() {
  const months = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];
  const revenue = [52000,58400,61200,55800,67400,72100,69800,76300,71200,79400,81900,84320];
  const orders = [2100,2340,2510,2290,2780,3010,2890,3200,2980,3420,3680,3842];
  
  return months.map((month, i) => ({
    date: month,
    revenue: revenue[i],
    orders: orders[i]
  }));
}

function generateMockCategories() {
  return [
    { name: "Electronics", value: 34, color: "#f97316" },
    { name: "Clothing", value: 26, color: "#2980b9" },
    { name: "Home", value: 20, color: "#27ae60" },
    { name: "Beauty", value: 12, color: "#8e44ad" },
    { name: "Other", value: 8, color: "#bbb" },
  ];
}

function generateMockTopProducts() {
  return [
    { name: "Wireless Earbuds Pro", cat: "Electronics", sales: 842, revenue: 245000, pct: 100 },
    { name: "Smart Watch Series 5", cat: "Electronics", sales: 714, revenue: 189000, pct: 85 },
    { name: "Running Shoes X2", cat: "Footwear", sales: 631, revenue: 168000, pct: 75 },
    { name: "Coffee Machine Deluxe", cat: "Home", sales: 528, revenue: 89000, pct: 63 },
    { name: "Skincare Bundle", cat: "Beauty", sales: 447, revenue: 76000, pct: 53 },
  ];
}

function generateMockGeoData() {
  return [
    { flag: "🇬🇭", country: "Accra", value: "35%", pct: 100 },
    { flag: "🇬🇭", country: "Kumasi", value: "25%", pct: 71 },
    { flag: "🇬🇭", country: "Takoradi", value: "15%", pct: 43 },
    { flag: "🇬🇭", country: "Tamale", value: "12%", pct: 34 },
    { flag: "🇬🇭", country: "Cape Coast", value: "8%", pct: 23 },
  ];
}

function generateMockOrders() {
  return [
    { id: "UM-4821", customer: "Sarah M.", product: "Wireless Earbuds Pro", amount: 129, status: "Delivered", date: "Mar 13" },
    { id: "UM-4820", customer: "James K.", product: "Smart Watch Series 5", amount: 299, status: "Shipped", date: "Mar 13" },
    { id: "UM-4819", customer: "Linda P.", product: "Running Shoes X2", amount: 89, status: "Processing", date: "Mar 12" },
    { id: "UM-4818", customer: "Omar F.", product: "Coffee Machine Deluxe", amount: 219, status: "Delivered", date: "Mar 12" },
    { id: "UM-4817", customer: "Chloe R.", product: "Skincare Bundle", amount: 64, status: "Shipped", date: "Mar 11" },
  ];
}

function generateMockActivity() {
  return [
    { color: "#27ae60", text: "New order #UM-4821 placed by Sarah M.", time: "2 min ago" },
    { color: "#f97316", text: "Product 'Wireless Earbuds Pro' low stock", time: "18 min ago" },
    { color: "#2980b9", text: "Order #UM-4818 shipped", time: "42 min ago" },
    { color: "#e74c3c", text: "Payment failed for order #UM-4816", time: "1 hr ago" },
    { color: "#8e44ad", text: "New vendor registration", time: "2 hr ago" },
  ];
}