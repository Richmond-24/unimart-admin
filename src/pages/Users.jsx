
import React, { useState, useEffect } from "react";
import { listingApi } from "../services/listingsApi";
import { format } from "date-fns";

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
  package: "M20 7.5l-8-4-8 4v9l8 4 8-4v-9z M12 12l8-4-8-4-8 4 8 4z M12 12v9 M20 16.5v-9",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75 M9 7a4 4 0 11-8 0 4 4 0 018 0z",
};

const STATUS_STYLE = {
  active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  sold: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  archived: "text-slate-400 bg-slate-400/10 border-slate-400/20",
};

const STATUS_DOT = { 
  active: "bg-emerald-400", 
  sold: "bg-blue-400", 
  archived: "bg-slate-500" 
};

const USER_TYPE_STYLE = {
  student: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  vendor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}

function ProductModal({ listing, onClose, onSave }) {
  const isEdit = !!listing?._id;
  const [form, setForm] = useState({
    title: "", price: "", category: "", status: "active", userType: "student",
    description: "", sellerName: "", sellerEmail: "", sellerPhone: "",
    ...(listing || {}),
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title?.trim()) e.title = "Title is required";
    if (!form.price) e.price = "Price is required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (isEdit) await listingApi.updateStatus(form._id, form.status);
      else {
        // For new listings - you might want to implement a create endpoint
        console.log("Create new listing", form);
      }
      onSave();
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg font-sora">
            {isEdit ? "Edit Listing" : "Add New Listing"}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
            <Icon d={IC.x} size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="input-dark" placeholder="Product title" />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Price (GH₵) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="input-dark" placeholder="0.00" />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Category</label>
              <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="input-dark" placeholder="Electronics" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="input-dark">
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Seller Type</label>
              <select value={form.userType} onChange={(e) => setForm((f) => ({ ...f, userType: e.target.value }))} className="input-dark">
                <option value="student">Student</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="input-dark" rows="3" placeholder="Product description" />
            </div>
            <div className="col-span-2 border-t border-slate-800 pt-3 mt-2">
              <h4 className="text-white text-sm font-medium mb-3">Seller Information</h4>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Seller Name</label>
              <input value={form.sellerName} onChange={(e) => setForm((f) => ({ ...f, sellerName: e.target.value }))}
                className="input-dark" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Seller Email</label>
              <input type="email" value={form.sellerEmail} onChange={(e) => setForm((f) => ({ ...f, sellerEmail: e.target.value }))}
                className="input-dark" placeholder="john@email.com" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Seller Phone</label>
              <input value={form.sellerPhone} onChange={(e) => setForm((f) => ({ ...f, sellerPhone: e.target.value }))}
                className="input-dark" placeholder="+233 XX XXX XXXX" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <Spinner /> : <Icon d={IC.check} size={15} />}
              {isEdit ? "Save Changes" : "Add Listing"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductDetailModal({ listing, onClose, onStatusChange }) {
  if (!listing) return null;
  const [changing, setChanging] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setChanging(true);
    await listingApi.updateStatus(listing._id, newStatus);
    onStatusChange();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-white font-bold font-sora">Product Details</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <Icon d={IC.x} size={18} />
          </button>
        </div>

        {/* Product Images */}
        {listing.imageUrls?.length > 0 && (
          <div className="mb-5">
            <div className="grid grid-cols-4 gap-2">
              {listing.imageUrls.slice(0, 4).map((url, i) => (
                <img key={i} src={url} alt={`Product ${i+1}`}
                  className="w-full h-20 object-cover rounded-lg border border-slate-700"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ))}
            </div>
          </div>
        )}

        <div className="text-center mb-5">
          <p className="text-white font-bold text-lg">{listing.title}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`status-badge border ${USER_TYPE_STYLE[listing.userType]}`}>
              {listing.userType}
            </span>
            <span className={`status-badge border ${STATUS_STYLE[listing.status]}`}>
              {listing.status}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-500 text-xs uppercase tracking-wider">Price</span>
            <span className="text-white font-bold text-lg">GH₵{listing.price?.toFixed(2)}</span>
          </div>
          
          <div className="py-2 border-b border-slate-800">
            <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Description</span>
            <p className="text-slate-300 text-sm">{listing.description || "No description provided"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div>
              <span className="text-slate-500 text-xs uppercase tracking-wider block">Category</span>
              <span className="text-white text-sm">{listing.category || "—"}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs uppercase tracking-wider block">Subcategory</span>
              <span className="text-white text-sm">{listing.subcategory || "—"}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs uppercase tracking-wider block">Brand</span>
              <span className="text-white text-sm">{listing.brand || "—"}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs uppercase tracking-wider block">Condition</span>
              <span className="text-white text-sm">{listing.condition || "—"}</span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-500 text-xs uppercase tracking-wider block mb-2">Seller Information</span>
            <div className="space-y-2">
              {[
                [IC.users, listing.sellerName || "—"],
                [IC.mail, listing.sellerEmail || "—"],
                [IC.phone, listing.sellerPhone || "—"],
                [IC.map, listing.location || "—"],
              ].map(([ic, val], i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Icon d={ic} size={14} className="text-slate-500 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-2 text-xs text-slate-500">
            <div>Created: {format(new Date(listing.createdAt), 'MMM d, yyyy h:mm a')}</div>
            {listing.updatedAt && listing.updatedAt !== listing.createdAt && (
              <div>Updated: {format(new Date(listing.updatedAt), 'MMM d, yyyy h:mm a')}</div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          {listing.status === 'active' && (
            <button onClick={() => handleStatusChange('sold')} disabled={changing}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30
                hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2">
              {changing ? <Spinner /> : <Icon d={IC.check} size={14} />}
              Mark as Sold
            </button>
          )}
          {listing.status !== 'archived' && (
            <button onClick={() => handleStatusChange('archived')} disabled={changing}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30
                hover:bg-slate-500/30 transition-colors flex items-center justify-center gap-2">
              {changing ? <Spinner /> : <Icon d={IC.ban} size={14} />}
              Archive
            </button>
          )}
          <button onClick={onClose} className="btn-secondary flex-1">Close</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ listing, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const confirm = async () => {
    setDeleting(true);
    await onConfirm(listing._id);
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
          <h3 className="text-white font-bold text-lg mb-2">Delete Listing</h3>
          <p className="text-slate-400 text-sm mb-6">
            Delete <span className="text-white font-medium">"{listing?.title}"</span>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={confirm} disabled={deleting}
              className="flex-1 py-2.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition-colors">
              {deleting ? <Spinner /> : null}Delete
            </button>
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({
    total: 0, active: 0, sold: 0, archived: 0, totalValue: 0, students: 0, vendors: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterUserType, setFilterUserType] = useState("all");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        userType: filterUserType !== 'all' ? filterUserType : undefined,
        search: search || undefined
      };

      const response = await listingApi.getListings(params);
      
      if (response.success) {
        setListings(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 1
        }));
        
        // Calculate stats
        const data = response.data || [];
        const newStats = {
          total: response.pagination?.total || data.length,
          active: data.filter(l => l.status === 'active').length,
          sold: data.filter(l => l.status === 'sold').length,
          archived: data.filter(l => l.status === 'archived').length,
          totalValue: data.reduce((sum, l) => sum + (l.price || 0), 0),
          students: data.filter(l => l.userType === 'student').length,
          vendors: data.filter(l => l.userType === 'vendor').length
        };
        setStats(newStats);
      } else {
        setError(response.error || 'Failed to fetch listings');
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterStatus, filterCategory, filterUserType, pagination.page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) load();
      else setPagination(prev => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => { 
    setModal(null); 
    await load(); 
    showToast("Listing updated successfully!"); 
  };

  const handleDelete = async (id) => { 
    await listingApi.deleteListing(id); 
    await load(); 
    showToast("Listing deleted."); 
  };

  const handleStatusChange = async (id, newStatus) => {
    await listingApi.updateStatus(id, newStatus);
    await load();
    showToast(`Status changed to ${newStatus}`);
  };

  const sortedListings = [...listings].sort((a, b) => {
    let av = a[sortBy] ?? "", bv = b[sortBy] ?? "";
    if (sortBy === 'price' || sortBy === 'createdAt') {
      av = new Date(av).getTime() || av;
      bv = new Date(bv).getTime() || bv;
    }
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

  const categories = ['all', 'Electronics', 'Fashion', 'Books', 'Home & Furniture', 'Other'];

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
          { label: "Total Listings", value: stats.total, color: "#6366f1", icon: IC.package },
          { label: "Active", value: stats.active, color: "#10b981", icon: IC.check },
          { label: "Sold", value: stats.sold, color: "#8b5cf6", icon: IC.tag },
          { label: "Total Value", value: `GH₵${stats.totalValue.toFixed(2)}`, color: "#06b6d4", icon: IC.plus },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4 border border-slate-800 card-hover" style={{ background: "#131920" }}>
            <div className="flex items-center justify-between mb-2">
              <Icon d={s.icon} size={18} className="text-slate-500" />
              <p className="text-slate-500 text-xs uppercase tracking-wider">{s.label}</p>
            </div>
            <p className="text-2xl font-bold font-sora" style={{ color: s.color }}>{s.value ?? "—"}</p>
            {s.label === "Total Listings" && (
              <p className="text-xs text-slate-500 mt-1">{stats.students} students · {stats.vendors} vendors</p>
            )}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={load} className="mt-2 text-xs text-red-400 hover:text-red-300">
            Try Again
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden" style={{ background: "#131920" }}>
        {/* Table Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 flex-wrap">
          <div className="flex items-center gap-2 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-indigo-500 transition-colors"
            style={{ background: "#0d1117" }}>
            <Icon d={IC.search} size={15} className="text-slate-500 flex-shrink-0" />
            <input className="bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none w-44"
              placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex gap-1.5">
            {["all", "active", "sold", "archived"].map((t) => (
              <button key={t} onClick={() => setFilterStatus(t)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize ${
                  filterStatus === t ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                style={filterStatus !== t ? { background: "#1e2533" } : {}}>
                {t}
              </button>
            ))}
          </div>

          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-700 text-slate-400 focus:outline-none"
            style={{ background: "#0d1117" }}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select value={filterUserType} onChange={(e) => setFilterUserType(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-700 text-slate-400 focus:outline-none"
            style={{ background: "#0d1117" }}>
            <option value="all">All Sellers</option>
            <option value="student">Students</option>
            <option value="vendor">Vendors</option>
          </select>

          <button onClick={() => setModal({ type: "add", listing: null })}
            className="btn-primary flex items-center gap-2 ml-auto">
            <Icon d={IC.plus} size={15} /> Add Listing
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {[
                  { label: "Product", key: "title" },
                  { label: "Seller", key: "sellerName" },
                  { label: "Price", key: "price" },
                  { label: "Status", key: "status" },
                  { label: "Type", key: "userType" },
                  { label: "Date", key: "createdAt" },
                  { label: "Actions", key: null },
                ].map((h) => (
                  <th key={h.label}
                    className={`text-left text-xs text-slate-500 font-semibold px-5 py-3 uppercase tracking-wider whitespace-nowrap ${
                      h.key ? "cursor-pointer hover:text-slate-300 select-none" : ""
                    }`}
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
              ) : sortedListings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">No listings found</td>
                </tr>
              ) : sortedListings.map((listing) => (
                <tr key={listing._id} className="table-row">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {listing.imageUrls?.[0] && (
                        <img src={listing.imageUrls[0]} alt={listing.title}
                          className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div>
                        <p className="text-white text-sm font-medium whitespace-nowrap">{listing.title}</p>
                        <p className="text-slate-500 text-xs">{listing.category} {listing.brand && `· ${listing.brand}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-white text-sm">{listing.sellerName || "—"}</p>
                      <p className="text-slate-500 text-xs">{listing.sellerEmail || ""}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-white text-sm font-semibold">GH₵{listing.price?.toFixed(2)}</p>
                    {listing.discount > 0 && (
                      <p className="text-xs text-emerald-400">{listing.discount}% off</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={listing.status}
                      onChange={(e) => handleStatusChange(listing._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg border-0 cursor-pointer font-medium
                        ${listing.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 
                          listing.status === 'sold' ? 'bg-blue-500/20 text-blue-400' : 
                          'bg-slate-500/20 text-slate-400'}`}
                      style={{ background: "#1e2533" }}
                    >
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`status-badge border ${USER_TYPE_STYLE[listing.userType]}`}>
                      {listing.userType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-sm whitespace-nowrap">
                    {format(new Date(listing.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => setModal({ type: "view", listing })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors"
                        style={{ background: "#2a3241" }} title="View">
                        <Icon d={IC.eye} size={13} />
                      </button>
                      <button onClick={() => setModal({ type: "edit", listing })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-amber-600 transition-colors"
                        style={{ background: "#2a3241" }} title="Edit">
                        <Icon d={IC.edit} size={13} />
                      </button>
                      <button onClick={() => setModal({ type: "delete", listing })}
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

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-slate-500 text-xs">
              Showing page {pagination.page} of {pagination.pages} · {pagination.total} total listings
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-400 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-400 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <ProductModal listing={modal.listing} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.type === "view" && (
        <ProductDetailModal listing={modal.listing} onClose={() => setModal(null)} onStatusChange={load} />
      )}
      {modal?.type === "delete" && (
        <DeleteConfirm listing={modal.listing} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}