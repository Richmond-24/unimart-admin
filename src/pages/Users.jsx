import React, { useState, useEffect } from "react";
import { usersApi } from "../services/api";

const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d={d} />
  </svg>
);

const IC = {
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  plus: "M12 5v14 M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  x: "M18 6L6 18 M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
  ban: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
  unlock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M17 11V7a5 5 0 00-9.9-1",
};

const ROLE_STYLE = {
  Customer: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Vendor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Admin: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const STATUS_DOT = { Active: "bg-emerald-400", Inactive: "bg-slate-500", Suspended: "bg-red-400" };
const STATUS_TEXT = { Active: "text-emerald-400", Inactive: "text-slate-400", Suspended: "text-red-400" };

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}

function UserModal({ user, onClose, onSave }) {
  const isEdit = !!user?.id;
  const [form, setForm] = useState({
    name: "", email: "", phone: "", role: "Customer", status: "Active", location: "",
    ...(user || {}),
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (isEdit) await usersApi.update(form.id, form);
      else {
        const initials = form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
        await usersApi.create({ ...form, avatar: initials });
      }
      onSave();
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg font-sora">{isEdit ? "Edit User" : "Add New User"}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
            <Icon d={IC.x} size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Full Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-dark" placeholder="John Doe" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input-dark" placeholder="john@email.com" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="input-dark" placeholder="+1 (555) 000-1234" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Location</label>
              <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="input-dark" placeholder="City, State" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Role</label>
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="input-dark">
                {["Customer", "Vendor", "Admin"].map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="input-dark">
                {["Active", "Inactive", "Suspended"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <Spinner /> : <Icon d={IC.check} size={15} />}
              {isEdit ? "Save Changes" : "Add User"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserDetailModal({ user, onClose, onStatusChange }) {
  if (!user) return null;
  const [changing, setChanging] = useState(false);

  const toggleStatus = async () => {
    setChanging(true);
    const newStatus = user.status === "Suspended" ? "Active" : "Suspended";
    await usersApi.update(user.id, { status: newStatus });
    onStatusChange();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-white font-bold font-sora">User Profile</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><Icon d={IC.x} size={18} /></button>
        </div>
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-3"
            style={{ background: user.avatarColor || "#6366f1" }}>
            {user.avatar}
          </div>
          <p className="text-white font-bold text-lg">{user.name}</p>
          <span className={`status-badge border mt-1 ${ROLE_STYLE[user.role]}`}>{user.role}</span>
        </div>
        <div className="space-y-2">
          {[
            [IC.mail, user.email],
            [IC.phone, user.phone || "—"],
            [IC.map, user.location || "—"],
          ].map(([ic, val], i) => (
            <div key={i} className="flex items-center gap-2.5 py-2 border-b border-slate-800">
              <Icon d={ic} size={14} className="text-slate-500 flex-shrink-0" />
              <span className="text-slate-300 text-sm">{val}</span>
            </div>
          ))}
          {[
            ["Orders", user.orders],
            ["Total Spent", `$${user.spent?.toLocaleString()}`],
            ["Joined", user.joined],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-500 text-xs uppercase tracking-wider">{k}</span>
              <span className="text-white text-sm font-medium">{v}</span>
            </div>
          ))}
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-500 text-xs uppercase tracking-wider">Status</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${STATUS_DOT[user.status]}`} />
              <span className={`text-sm font-medium ${STATUS_TEXT[user.status]}`}>{user.status}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={toggleStatus} disabled={changing}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{ background: user.status === "Suspended" ? "#10b981" : "#ef444420", color: user.status === "Suspended" ? "white" : "#f87171", border: "1px solid", borderColor: user.status === "Suspended" ? "#10b981" : "#ef444440" }}>
            {changing ? <Spinner /> : <Icon d={user.status === "Suspended" ? IC.unlock : IC.ban} size={14} />}
            {user.status === "Suspended" ? "Reactivate" : "Suspend"}
          </button>
          <button onClick={onClose} className="btn-secondary flex-1">Close</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const confirm = async () => {
    setDeleting(true);
    await onConfirm(user.id);
    setDeleting(false);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.1)" }}>
            <Icon d={IC.trash} size={24} className="text-red-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Delete User</h3>
          <p className="text-slate-400 text-sm mb-6">Delete <span className="text-white font-medium">"{user?.name}"</span>? This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={confirm} disabled={deleting}
              className="flex-1 py-2.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: "#ef4444" }}>
              {deleting ? <Spinner /> : null}Delete
            </button>
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const load = async () => {
    setLoading(true);
    const [res, s] = await Promise.all([
      usersApi.getAll({ status: filterStatus === "All" ? "" : filterStatus, role: filterRole === "All" ? "" : filterRole, search }),
      usersApi.getStats(),
    ]);
    setUsers(res.data);
    setStats(s);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, filterStatus, filterRole]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => { setModal(null); await load(); showToast("User saved successfully!"); };
  const handleDelete = async (id) => { await usersApi.delete(id); await load(); showToast("User deleted."); };

  const sortedUsers = [...users].sort((a, b) => {
    let av = a[sortBy] ?? "", bv = b[sortBy] ?? "";
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) => (
    <span className="ml-1 text-slate-600">
      {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl flex items-center gap-2 animate-slide-in bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Icon d={IC.check} size={14} /> {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: stats.total?.toLocaleString(), color: "#6366f1" },
          { label: "Active", value: stats.active?.toLocaleString(), color: "#10b981" },
          { label: "Vendors", value: stats.vendors?.toLocaleString(), color: "#8b5cf6" },
          { label: "New This Month", value: `+${stats.newThisMonth}`, color: "#06b6d4" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4 border border-slate-800 card-hover" style={{ background: "#131920" }}>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold font-sora" style={{ color: s.color }}>{s.value ?? "—"}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden" style={{ background: "#131920" }}>
        {/* Table Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 flex-wrap">
          <div className="flex items-center gap-2 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-indigo-500 transition-colors"
            style={{ background: "#0d1117" }}>
            <Icon d={IC.search} size={15} className="text-slate-500 flex-shrink-0" />
            <input className="bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none w-44"
              placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex gap-1.5">
            {["All", "Active", "Inactive", "Suspended"].map((t) => (
              <button key={t} onClick={() => setFilterStatus(t)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filterStatus === t ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
                style={filterStatus !== t ? { background: "#1e2533" } : {}}>
                {t}
              </button>
            ))}
          </div>

          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-700 text-slate-400 focus:outline-none"
            style={{ background: "#0d1117" }}>
            {["All", "Customer", "Vendor", "Admin"].map((r) => (
              <option key={r} value={r}>{r === "All" ? "All Roles" : r}</option>
            ))}
          </select>

          <button onClick={() => setModal({ type: "add", user: null })}
            className="btn-primary flex items-center gap-2 ml-auto">
            <Icon d={IC.plus} size={15} /> Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {[
                  { label: "User", key: "name" },
                  { label: "Role", key: "role" },
                  { label: "Joined", key: "joined" },
                  { label: "Orders", key: "orders" },
                  { label: "Total Spent", key: "spent" },
                  { label: "Status", key: "status" },
                  { label: "Actions", key: null },
                ].map((h) => (
                  <th key={h.label}
                    className={`text-left text-xs text-slate-500 font-semibold px-5 py-3 uppercase tracking-wider whitespace-nowrap ${h.key ? "cursor-pointer hover:text-slate-300 select-none" : ""}`}
                    onClick={() => h.key && handleSort(h.key)}>
                    {h.label}{h.key && <SortIcon col={h.key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-800/40">
                    <td colSpan={7} className="px-5 py-4">
                      <div className="h-4 bg-slate-800 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">No users found</td>
                </tr>
              ) : sortedUsers.map((u) => (
                <tr key={u.id} className="table-row">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: u.avatarColor || "#6366f1" }}>
                        {u.avatar}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium whitespace-nowrap">{u.name}</p>
                        <p className="text-slate-500 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`status-badge border ${ROLE_STYLE[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-sm whitespace-nowrap">{u.joined}</td>
                  <td className="px-5 py-3.5 text-slate-300 text-sm font-medium">{u.orders}</td>
                  <td className="px-5 py-3.5 text-white text-sm font-semibold">${u.spent?.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[u.status]}`} />
                      <span className={`text-sm ${STATUS_TEXT[u.status]}`}>{u.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => setModal({ type: "view", user: u })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors"
                        style={{ background: "#2a3241" }} title="View">
                        <Icon d={IC.eye} size={13} />
                      </button>
                      <button onClick={() => setModal({ type: "edit", user: u })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-amber-600 transition-colors"
                        style={{ background: "#2a3241" }} title="Edit">
                        <Icon d={IC.edit} size={13} />
                      </button>
                      <button onClick={() => setModal({ type: "delete", user: u })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-600 transition-colors"
                        style={{ background: "#2a3241" }} title="Delete">
                        <Icon d={IC.trash} size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && sortedUsers.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-slate-500 text-xs">Showing {sortedUsers.length} user{sortedUsers.length !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <UserModal user={modal.user} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.type === "view" && (
        <UserDetailModal user={modal.user} onClose={() => setModal(null)} onStatusChange={load} />
      )}
      {modal?.type === "delete" && (
        <DeleteConfirm user={modal.user} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}
