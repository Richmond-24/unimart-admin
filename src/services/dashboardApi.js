
// /home/richmond/Downloads/unimart-admin (1)/app/unimart-admin/src/pages/Dashboard/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { dashboardApi } from "../../services/dashboardApi";

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
          <span>vs last period</span>
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
    conversionRate: 0,
    conversionTrend: 0,
    aov: 0,
    aovTrend: 0
  });
  
  const [revenueData, setRevenueData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [realtimeVisitors, setRealtimeVisitors] = useState(0);

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
      // Fetch all dashboard data in parallel using your real API
      const [
        kpiResult,
        salesTrendResult,
        categoriesResult,
        topProductsResult,
        geoResult,
        alertsResult,
        visitorsResult,
        activityResult
      ] = await Promise.allSettled([
        dashboardApi.getKPI(dateRange),
        dashboardApi.getSalesTrend(dateRange),
        dashboardApi.getCategoryPerformance(dateRange),
        dashboardApi.getTopProducts(dateRange, 5),
        dashboardApi.getGeoDistribution(dateRange),
        dashboardApi.getInventoryAlerts(),
        dashboardApi.getRealtimeVisitors(),
        dashboardApi.getActivityFeed(8)
      ]);

      // Handle KPI
      if (kpiResult.status === 'fulfilled') {
        setKpi(kpiResult.value);
      }

      // Handle sales trend
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
          image: p.image,
          price: p.price,
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

      // Handle inventory alerts
      if (alertsResult.status === 'fulfilled') {
        setInventoryAlerts(alertsResult.value);
      }

      // Handle realtime visitors
      if (visitorsResult.status === 'fulfilled') {
        setRealtimeVisitors(visitorsResult.value);
      }

      // Handle activity feed
      if (activityResult.status === 'fulfilled') {
        setActivityFeed(activityResult.value.map(activity => ({
          id: activity.id,
          color: activity.color,
          text: activity.description,
          time: activity.timeAgo || formatTimeAgo(activity.time),
          title: activity.title,
          icon: activity.icon
        })));
      }

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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
      {/* Header with date range selector and realtime visitors */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: "#1a1208" }}>Marketplace Dashboard</h2>
          <p style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
            Real-time analytics from your marketplace
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", padding: "8px 16px", borderRadius: 8, border: "0.5px solid #e0d0c0" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 13, color: "#666" }}>{realtimeVisitors} visitors now</span>
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
                {range === "24h" ? "24h" : 
                 range === "7d" ? "7d" : 
                 range === "30d" ? "30d" : 
                 range === "90d" ? "90d" : "1y"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards - using REAL data from your API */}
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
          foot={`${kpi.revenueTrend > 0 ? '+' : ''}${kpi.revenueTrend.toFixed(1)}%`} 
        />
        <StatCard 
          title="Total orders" 
          value={kpi.orders.toLocaleString()} 
          delta={kpi.ordersTrend} 
          positive={kpi.ordersTrend > 0} 
          iconD={IC.orders} 
          iconColor="#2980b9" 
          iconBg="#e8f4fd"
          spark={revenueData.slice(-6).map(d => d.orders)} 
          sparkColor="#2980b9" 
          foot={`${kpi.ordersTrend > 0 ? '+' : ''}${kpi.ordersTrend.toFixed(1)}%`} 
        />
        <StatCard 
          title="Customers" 
          value={kpi.customers.toLocaleString()} 
          delta={kpi.customersTrend} 
          positive={kpi.customersTrend > 0} 
          iconD={IC.users} 
          iconColor="#27ae60" 
          iconBg="#eafaf1"
          sparkColor="#27ae60" 
          foot={`${kpi.customersTrend > 0 ? '+' : ''}${kpi.customersTrend.toFixed(1)}%`} 
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
          foot={`${kpi.aovTrend > 0 ? '+' : ''}${kpi.aovTrend.toFixed(1)}%`} 
        />
      </div>

      {/* Revenue chart + Category donut - using REAL data */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 12 }}>
        <div style={S.cardP}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <p style={S.h3}>Revenue overview</p>
              <p style={S.muted}>Based on actual orders</p>
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
          <p style={S.h3}>Revenue by category</p>
          <p style={S.muted}>Based on actual sales</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginBottom: 12 }}>
            {categoriesData.map((c) => (
              <span key={c.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#555" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c.color, display: "inline-block" }} />
                {c.name} {c.value}%
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie 
                data={categoriesData} 
                cx="50%" 
                cy="50%" 
                innerRadius={45} 
                outerRadius={70} 
                paddingAngle={3} 
                dataKey="value"
              >
                {categoriesData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ background: "#fff", border: "0.5px solid #e8e0d8", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Alerts - from REAL data */}
      {inventoryAlerts.length > 0 && (
        <div style={S.cardP}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div>
              <p style={S.h3}>Low Stock Alerts</p>
              <p style={S.muted}>Products below threshold</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {inventoryAlerts.map((alert) => (
              <div key={alert.id} style={{ 
                padding: "1rem", 
                background: "#fff3e0", 
                borderRadius: 8,
                border: "1px solid #f97316"
              }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{alert.product}</p>
                <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>SKU: {alert.sku}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#e65100" }}>{alert.stock} left</span>
                  <span style={{ fontSize: 12, color: "#999" }}>Threshold: {alert.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products + Geo Distribution - from REAL data */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 12 }}>
        <div style={S.cardP}>
          <p style={S.h3}>Top performing products</p>
          <p style={S.muted}>By units sold</p>
          {topProducts.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < topProducts.length - 1 ? "0.5px solid #f8f3ef" : "none" }}>
              <span style={{ width: 20, fontSize: 12, color: "#ccc", fontWeight: 500, textAlign: "center" }}>{i + 1}</span>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f5f0eb", border: "0.5px solid #e8e0d8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {p.image || '📦'}
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

        <div style={S.cardP}>
          <p style={S.h3}>Customer locations</p>
          <p style={S.muted}>Geographic distribution</p>
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

      {/* Activity Feed - from REAL data */}
      <div style={S.cardP}>
        <p style={S.h3}>Recent activity</p>
        <p style={S.muted}>Live events from your store</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginTop: "1rem" }}>
          {activityFeed.map((activity) => (
            <div key={activity.id} style={{ 
              display: "flex", 
              alignItems: "flex-start", 
              gap: 12, 
              padding: "12px",
              background: "#fafafa",
              borderRadius: 8,
              border: "0.5px solid #f0ebe4"
            }}>
              <span style={{ fontSize: 20 }}>{activity.icon || '📌'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: "#333", marginBottom: 4 }}>{activity.text}</p>
                <p style={{ fontSize: 11, color: "#999" }}>{activity.time}</p>
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
  const colors = ["#f97316", "#2980b9", "#27ae60", "#8e44ad", "#e74c3c", "#f39c12", "#1abc9c", "#3498db"];
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
    'UK': '🇬🇧',
    'Germany': '🇩🇪',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Other': '🌍'
  };
  return flags[country] || '🌍';
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}