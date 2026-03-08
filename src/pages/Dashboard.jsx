import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { dashboardApi } from "../services/api";

const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d={d} />
  </svg>
);

const IC = {
  up: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  down: "M23 18l-9.5-9.5-5 5L1 6 M17 18h6v-6",
  dollar: "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  cart: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
  box: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
};

const STATUS_COLOR = {
  Delivered: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  Shipped: { bg: "bg-blue-500/10", text: "text-blue-400" },
  Processing: { bg: "bg-amber-500/10", text: "text-amber-400" },
  Cancelled: { bg: "bg-red-500/10", text: "text-red-400" },
  Refunded: { bg: "bg-purple-500/10", text: "text-purple-400" },
};

function Sparkline({ data, color }) {
  if (!data) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const w = 100, h = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h * 0.8 - h * 0.1;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ title, value, change, positive, iconD, color, spark }) {
  return (
    <div className="rounded-2xl p-5 border border-slate-800 relative overflow-hidden card-hover" style={{ background: "#131920" }}>
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle,${color},transparent)`, transform: "translate(35%,-35%)" }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon d={iconD} size={18} className={`text-[${color}]`} style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${positive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
          <Icon d={positive ? IC.up : IC.down} size={11} />
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-bold text-white font-sora">{value}</p>
      <div className="mt-3 opacity-80">
        <Sparkline data={spark} color={color} />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2.5 border border-slate-700 shadow-xl"
        style={{ background: "#1a2332" }}>
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name === "revenue" ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartType, setChartType] = useState("area");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getRevenueSeries(),
      dashboardApi.getCategories(),
      dashboardApi.getTopProducts(),
      dashboardApi.getRecentOrders(),
    ]).then(([s, r, c, tp, ro]) => {
      setStats(s);
      setRevenue(r);
      setCategories(c);
      setTopProducts(tp);
      setRecentOrders(ro);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-5 animate-pulse">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl h-40 border border-slate-800" style={{ background: "#131920" }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-2xl h-64 border border-slate-800" style={{ background: "#131920" }} />
          <div className="rounded-2xl h-64 border border-slate-800" style={{ background: "#131920" }} />
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: `$${(stats.revenue.value).toLocaleString()}`, ...stats.revenue, iconD: IC.dollar, color: "#6366f1" },
    { title: "Total Orders", value: stats.orders.value.toLocaleString(), ...stats.orders, iconD: IC.cart, color: "#06b6d4" },
    { title: "Products", value: stats.products.value.toLocaleString(), ...stats.products, iconD: IC.box, color: "#f59e0b" },
    { title: "Active Users", value: stats.users.value.toLocaleString(), ...stats.users, iconD: IC.users, color: "#ec4899" },
  ];

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Revenue + Categories */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 rounded-2xl p-5 border border-slate-800" style={{ background: "#131920" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-bold font-sora">Revenue Overview</h3>
              <p className="text-slate-500 text-xs mt-0.5">Monthly performance 2025</p>
            </div>
            <div className="flex gap-1.5">
              {["area", "bar"].map((t) => (
                <button key={t} onClick={() => setChartType(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors capitalize font-medium ${chartType === t ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-white"}`}
                  style={chartType !== t ? { background: "#1e2533" } : {}}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            {chartType === "area" ? (
              <AreaChart data={revenue} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3b" />
                <XAxis dataKey="month" tick={{ fill: "#4a5568", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a5568", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#6366f1" strokeWidth={2}
                  fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: "#6366f1" }} />
              </AreaChart>
            ) : (
              <BarChart data={revenue} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3b" />
                <XAxis dataKey="month" tick={{ fill: "#4a5568", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a5568", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="rounded-2xl p-5 border border-slate-800" style={{ background: "#131920" }}>
          <h3 className="text-white font-bold font-sora mb-1">Category Split</h3>
          <p className="text-slate-500 text-xs mb-4">By revenue share</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categories} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                paddingAngle={3} dataKey="value">
                {categories.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ background: "#1a2332", border: "1px solid #2a3241", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-2">
            {categories.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-slate-300">{c.name}</span>
                  </div>
                  <span className="text-slate-500 font-medium">{c.value}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.value}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-800 overflow-hidden" style={{ background: "#131920" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h3 className="text-white font-bold font-sora">Recent Orders</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Order ID", "Customer", "Product", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left text-xs text-slate-500 font-semibold px-5 py-3 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => {
                  const sc = STATUS_COLOR[o.status] || STATUS_COLOR.Processing;
                  return (
                    <tr key={i} className="table-row">
                      <td className="px-5 py-3.5 text-indigo-400 text-xs font-mono whitespace-nowrap">#{o.id}</td>
                      <td className="px-5 py-3.5 text-slate-300 text-sm whitespace-nowrap">{o.customer}</td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs max-w-[140px] truncate">{o.product}</td>
                      <td className="px-5 py-3.5 text-white text-sm font-semibold whitespace-nowrap">
                        ${o.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`status-badge ${sc.bg} ${sc.text}`}>{o.status}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{o.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl p-5 border border-slate-800" style={{ background: "#131920" }}>
          <h3 className="text-white font-bold font-sora mb-1">Top Products</h3>
          <p className="text-slate-500 text-xs mb-5">By sales volume</p>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-slate-600 text-xs font-bold w-5 flex-shrink-0 text-center">{i + 1}</span>
                <span className="text-lg flex-shrink-0">{p.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${p.pct}%`, background: `hsl(${240 + i * 22},70%,65%)` }} />
                    </div>
                    <span className="text-slate-500 text-xs flex-shrink-0 font-medium">{p.sales}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mini Order Stats */}
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
            {[
              { label: "Avg. Order Value", value: "$249", color: "#6366f1" },
              { label: "Return Rate", value: "2.4%", color: "#10b981" },
              { label: "Satisfaction", value: "4.8★", color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">{s.label}</span>
                <span className="text-sm font-semibold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
