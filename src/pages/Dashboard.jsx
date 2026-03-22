
import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { dashboardApi } from "../services/api";

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
};

// ─── Static mock data (replace with API calls) ───────────────────────────────
const MONTHS = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];
const REVENUE_SERIES = [52000,58400,61200,55800,67400,72100,69800,76300,71200,79400,81900,84320];
const ORDERS_SERIES  = [2100,2340,2510,2290,2780,3010,2890,3200,2980,3420,3680,3842];

const revenueData = MONTHS.map((m, i) => ({
  month: m, revenue: REVENUE_SERIES[i], orders: ORDERS_SERIES[i],
}));

const categoriesData = [
  { name: "Electronics", value: 34, color: "#f97316" },
  { name: "Clothing",    value: 26, color: "#2980b9" },
  { name: "Home",        value: 20, color: "#27ae60" },
  { name: "Beauty",      value: 12, color: "#8e44ad" },
  { name: "Other",       value: 8,  color: "#bbb"    },
];

const topProducts = [
  { name: "Wireless Earbuds Pro",   cat: "Electronics", sales: 842, pct: 100 },
  { name: "Smart Watch Series 5",   cat: "Electronics", sales: 714, pct: 85  },
  { name: "Running Shoes X2",       cat: "Footwear",    sales: 631, pct: 75  },
  { name: "Coffee Machine Deluxe",  cat: "Home",        sales: 528, pct: 63  },
  { name: "Skincare Bundle",        cat: "Beauty",      sales: 447, pct: 53  },
];

const recentOrders = [
  { id: "ORD-8841", customer: "Sarah M.",  product: "Wireless Earbuds Pro",   amount: 129, status: "Delivered",  date: "Mar 13" },
  { id: "ORD-8840", customer: "James K.",  product: "Smart Watch Series 5",   amount: 299, status: "Shipped",    date: "Mar 13" },
  { id: "ORD-8839", customer: "Linda P.",  product: "Running Shoes X2",       amount: 89,  status: "Processing", date: "Mar 12" },
  { id: "ORD-8838", customer: "Omar F.",   product: "Coffee Machine Deluxe",  amount: 219, status: "Delivered",  date: "Mar 12" },
  { id: "ORD-8837", customer: "Chloe R.",  product: "Skincare Bundle",        amount: 64,  status: "Shipped",    date: "Mar 11" },
  { id: "ORD-8836", customer: "Ben T.",    product: "Gaming Headset RGB",     amount: 149, status: "Cancelled",  date: "Mar 11" },
  { id: "ORD-8835", customer: "Aisha N.",  product: "Yoga Mat Premium",       amount: 45,  status: "Delivered",  date: "Mar 10" },
  { id: "ORD-8834", customer: "David L.",  product: "Bluetooth Speaker",      amount: 79,  status: "Refunded",   date: "Mar 10" },
];

const geoData = [
  { flag: "🇺🇸", country: "United States", value: "$31,240", pct: 100 },
  { flag: "🇬🇧", country: "United Kingdom", value: "$14,820", pct: 47  },
  { flag: "🇩🇪", country: "Germany",        value: "$11,090", pct: 36  },
  { flag: "🇨🇦", country: "Canada",         value: "$8,640",  pct: 28  },
  { flag: "🇦🇺", country: "Australia",      value: "$6,110",  pct: 20  },
];

const activityFeed = [
  { color: "#27ae60", text: "New order #ORD-8841 placed by Sarah M.", time: "2 min ago"  },
  { color: "#f97316", text: "Product 'Wireless Earbuds Pro' low stock (12 left)", time: "18 min ago" },
  { color: "#2980b9", text: "Order #ORD-8838 shipped via FedEx", time: "42 min ago" },
  { color: "#e74c3c", text: "Refund processed for #ORD-8834 — $79", time: "1 hr ago"  },
  { color: "#8e44ad", text: "New customer signup: David L. from AU", time: "2 hr ago"  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Delivered:  { background: "#eafaf1", color: "#1a7a45" },
  Shipped:    { background: "#e8f4fd", color: "#1a5a8a" },
  Processing: { background: "#fff8e1", color: "#a07000" },
  Cancelled:  { background: "#fff0f0", color: "#c0392b" },
  Refunded:   { background: "#f3eeff", color: "#6a3db8" },
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
          {p.name === "revenue" ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ─── Sparkline (tiny inline chart) ───────────────────────────────────────────
function Sparkline({ data, color }) {
  const w = 100, h = 36;
  const max = Math.max(...data), min = Math.min(...data);
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
function StatCard({ title, value, delta, positive, iconD, iconColor, iconBg, spark, sparkColor, foot }) {
  return (
    <div style={{ ...S.cardP, display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={iconD} color={iconColor} size={18} />
        </div>
        <span style={{
          display: "flex", alignItems: "center", gap: 3,
          background: positive ? "#eafaf1" : "#fff0f0",
          color: positive ? "#1a7a45" : "#c0392b",
          borderRadius: 20, fontSize: 11, fontWeight: 500, padding: "3px 8px",
        }}>
          <Icon d={positive ? IC.up : IC.down} size={10} color={positive ? "#1a7a45" : "#c0392b"} />
          {Math.abs(delta)}%
        </span>
      </div>
      <div>
        <div style={S.val}>{value}</div>
        <div style={S.label}>{title}</div>
      </div>
      <div style={{ height: 36 }}><Sparkline data={spark} color={sparkColor} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.5px solid #f0ebe4", paddingTop: 8, fontSize: 12, color: "#aaa" }}>
        <span>vs last month</span>
        <span style={{ color: positive ? "#1a7a45" : "#c0392b", fontWeight: 500 }}>{foot}</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [chartType, setChartType] = useState("area");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Replace with your actual API calls:
    // dashboardApi.getStats().then(s => { setStats(s); setLoading(false); });
    setTimeout(() => { setStats({}); setLoading(false); }, 400);
  }, []);

  if (loading) {
    return (
      <div style={{ ...S.page }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ ...S.card, height: 160, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </div>
    );
  }

  const last6 = revenueData.slice(-6);

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: "#1a1208" }}>Store dashboard</h2>
          <p style={{ fontSize: 13, color: "#888", marginTop: 2 }}>Welcome back, Alex — here's what's happening today</p>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #e0d0c0", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "#666", display: "flex", alignItems: "center", gap: 7 }}>
          <Icon d={IC.cal} color="#f97316" size={14} />
          Mar 13, 2026
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 }}>
        <StatCard title="Total revenue" value="$84,320" delta={12.4} positive iconD={IC.dollar} iconColor="#f97316" iconBg="#fff3eb"
          spark={[52,58,61,55,67,72,69,76,71,79,82,84]} sparkColor="#f97316" foot="+$9,320" />
        <StatCard title="Total orders" value="3,842" delta={8.1} positive iconD={IC.orders} iconColor="#2980b9" iconBg="#e8f4fd"
          spark={[21,23,25,22,27,30,28,32,29,34,36,38]} sparkColor="#2980b9" foot="+287" />
        <StatCard title="Active customers" value="12,540" delta={5.3} positive iconD={IC.users} iconColor="#27ae60" iconBg="#eafaf1"
          spark={[89,94,100,96,105,112,108,118,114,122,128,125]} sparkColor="#27ae60" foot="+631" />
        <StatCard title="Products in stock" value="1,284" delta={3.2} positive={false} iconD={IC.box} iconColor="#e74c3c" iconBg="#fff0f0"
          spark={[135,131,128,133,126,129,124,127,121,125,122,128]} sparkColor="#e74c3c" foot="−42" />
      </div>

      {/* Revenue chart + Category donut */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 12 }}>
        <div style={S.cardP}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <p style={S.h3}>Revenue overview</p>
              <p style={S.muted}>Monthly performance · 2025–2026</p>
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
                <XAxis dataKey="month" tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} width={42} />
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
                <XAxis dataKey="month" tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} width={42} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#f97316" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: "#f97316" }} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <div style={S.cardP}>
          <p style={{ ...S.h3, marginBottom: 2 }}>Category split</p>
          <p style={{ ...S.muted, marginBottom: 12 }}>By revenue share</p>
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
              <Pie data={categoriesData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoriesData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ background: "#fff", border: "0.5px solid #e8e0d8", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders table + Right column */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 12, alignItems: "start" }}>
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 1.25rem 0.8rem", borderBottom: "0.5px solid #f0ebe4" }}>
            <div><p style={S.h3}>Recent orders</p><p style={S.muted}>Last 8 transactions</p></div>
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
                    <td style={{ padding: "11px 12px 11px 0", fontWeight: 500, color: "#1a1208", borderBottom: "0.5px solid #f8f3ef", whiteSpace: "nowrap" }}>${o.amount}</td>
                    <td style={{ padding: "11px 12px 11px 0", borderBottom: "0.5px solid #f8f3ef" }}>
                      <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500, ...(STATUS_STYLES[o.status] || STATUS_STYLES.Processing) }}>
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
            <p style={{ ...S.h3, marginBottom: 2 }}>Top products</p>
            <p style={{ ...S.muted, marginBottom: 14 }}>By sales volume</p>
            {topProducts.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < topProducts.length - 1 ? "0.5px solid #f8f3ef" : "none" }}>
                <span style={{ width: 20, fontSize: 12, color: "#ccc", fontWeight: 500, textAlign: "center", flexShrink: 0 }}>{i + 1}</span>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f5f0eb", border: "0.5px solid #e8e0d8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon d={IC.box} color="#f97316" size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: "#bbb", marginTop: 1 }}>{p.cat}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                    <div style={{ flex: 1, height: 4, background: "#f0ebe4", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${p.pct}%`, height: "100%", background: "#f97316", borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#888", fontWeight: 500, flexShrink: 0 }}>{p.sales}</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "0.5px solid #f0ebe4" }}>
              {[["Avg. order value", "$249", "#f97316"], ["Return rate", "2.4%", "#27ae60"], ["Satisfaction", "4.8 / 5", "#f59e0b"]].map(([l, v, c]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: l !== "Satisfaction" ? "0.5px solid #f8f3ef" : "none" }}>
                  <span style={{ fontSize: 12, color: "#aaa" }}>{l}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: c }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geo */}
          <div style={S.cardP}>
            <p style={{ ...S.h3, marginBottom: 2 }}>Top regions</p>
            <p style={{ ...S.muted, marginBottom: 12 }}>By order volume</p>
            {geoData.map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < geoData.length - 1 ? "0.5px solid #f8f3ef" : "none" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{g.flag}</span>
                <span style={{ fontSize: 13, color: "#333", flex: 1 }}>{g.country}</span>
                <div style={{ width: 80, height: 4, background: "#f0ebe4", borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ width: `${g.pct}%`, height: "100%", background: "#f97316", borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 12, color: "#888", fontWeight: 500, minWidth: 52, textAlign: "right", flexShrink: 0 }}>{g.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dual chart + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 12 }}>
        <div style={S.cardP}>
          <p style={{ ...S.h3, marginBottom: 2 }}>Revenue vs orders</p>
          <p style={{ ...S.muted, marginBottom: "1rem" }}>Last 6 months comparison</p>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={last6} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f0eb" />
              <XAxis dataKey="month" tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rev" tick={{ fill: "#bbb", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} width={42} />
              <YAxis yAxisId="ord" orientation="right" tick={{ fill: "#2980b9", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<ChartTooltip />} />
              <Bar yAxisId="rev" dataKey="revenue" name="revenue" fill="#f97316" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Line yAxisId="ord" type="monotone" dataKey="orders" name="orders" stroke="#2980b9" strokeWidth={2} dot={{ r: 3, fill: "#2980b9" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div style={S.cardP}>
          <p style={{ ...S.h3, marginBottom: 2 }}>Recent activity</p>
          <p style={{ ...S.muted, marginBottom: 14 }}>Live store events</p>
          {activityFeed.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: i < activityFeed.length - 1 ? "0.5px solid #f8f3ef" : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, marginTop: 4, flexShrink: 0 }} />
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