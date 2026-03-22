
// /home/richmond/Downloads/unimart-admin (1)/app/unimart-admin/src/services/api.js

// ─── Mock API Service with localStorage persistence ──────────────────────────

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ── Seed Data ────────────────────────────────────────────────────────────────

const SEED_PRODUCTS = [
  { id: 1, name: 'MacBook Pro 14" M3', sku: "AP-MBP14M3", category: "Laptops", price: 2399, stock: 45, status: "Active", rating: 4.9, sales: 245, image: "💻", description: "Apple M3 chip, 18-hour battery, Liquid Retina XDR display.", createdAt: "2024-09-01" },
  { id: 2, name: "iPhone 15 Pro Max", sku: "AP-IP15PM", category: "Phones", price: 1199, stock: 132, status: "Active", rating: 4.8, sales: 412, image: "📱", description: "Titanium design, A17 Pro chip, 48MP camera system.", createdAt: "2024-09-15" },
  { id: 3, name: "Sony WH-1000XM5", sku: "SN-WH1000XM5", category: "Audio", price: 349, stock: 0, status: "Out of Stock", rating: 4.7, sales: 631, image: "🎧", description: "Industry-leading noise cancelling headphones.", createdAt: "2024-10-01" },
  { id: 4, name: 'Samsung 4K TV 65"', sku: "SS-QN65S95C", category: "TVs", price: 1299, stock: 18, status: "Active", rating: 4.6, sales: 156, image: "📺", description: "OLED 4K Smart TV with Quantum HDR.", createdAt: "2024-10-10" },
  { id: 5, name: "iPad Air M2", sku: "AP-IPADAIRM2", category: "Tablets", price: 749, stock: 67, status: "Active", rating: 4.7, sales: 289, image: "📱", description: "M2 chip, 10.9-inch Liquid Retina display.", createdAt: "2024-10-20" },
  { id: 6, name: "AirPods Pro 2nd Gen", sku: "AP-APPRO2", category: "Audio", price: 249, stock: 5, status: "Low Stock", rating: 4.8, sales: 874, image: "🎵", description: "Active Noise Cancellation, Adaptive Audio.", createdAt: "2024-11-01" },
  { id: 7, name: "Nintendo Switch OLED", sku: "NT-SWTOLED", category: "Gaming", price: 349, stock: 29, status: "Active", rating: 4.5, sales: 543, image: "🎮", description: "Vibrant 7-inch OLED screen, enhanced audio.", createdAt: "2024-11-10" },
  { id: 8, name: 'LG UltraWide 34"', sku: "LG-34WP85C", category: "Monitors", price: 799, stock: 12, status: "Active", rating: 4.4, sales: 98, image: "🖥️", description: "34-inch Curved UltraWide QHD display.", createdAt: "2024-11-15" },
  { id: 9, name: "Dell XPS 15", sku: "DL-XPS15-9530", category: "Laptops", price: 1799, stock: 22, status: "Active", rating: 4.6, sales: 187, image: "💻", description: "Intel Core i9, RTX 4070, OLED display.", createdAt: "2024-12-01" },
  { id: 10, name: "Samsung Galaxy S24 Ultra", sku: "SS-GS24U", category: "Phones", price: 1299, stock: 88, status: "Active", rating: 4.7, sales: 321, image: "📱", description: "200MP camera, S Pen, Snapdragon 8 Gen 3.", createdAt: "2024-12-10" },
  { id: 11, name: "Bose QuietComfort 45", sku: "BS-QC45", category: "Audio", price: 279, stock: 34, status: "Active", rating: 4.5, sales: 445, image: "🎧", description: "Legendary noise cancellation, world-class sound.", createdAt: "2025-01-05" },
  { id: 12, name: "PS5 Console", sku: "SN-PS5-SLIM", category: "Gaming", price: 499, stock: 7, status: "Low Stock", rating: 4.9, sales: 1204, image: "🎮", description: "Ultra-high-speed SSD, 4K gaming, DualSense controller.", createdAt: "2025-01-15" },
];

const SEED_USERS = [
  { id: 1, name: "Sarah Chen", email: "sarah.chen@email.com", role: "Customer", joined: "2025-01-15", orders: 28, spent: 4291, status: "Active", avatar: "SC", avatarColor: "#6366f1", phone: "+1 (555) 123-4567", location: "San Francisco, CA" },
  { id: 2, name: "Marcus Lee", email: "marcus.lee@email.com", role: "Customer", joined: "2024-12-03", orders: 15, spent: 2847, status: "Active", avatar: "ML", avatarColor: "#ec4899", phone: "+1 (555) 234-5678", location: "New York, NY" },
  { id: 3, name: "Priya Sharma", email: "priya.sharma@email.com", role: "Vendor", joined: "2024-10-20", orders: 142, spent: 28450, status: "Active", avatar: "PS", avatarColor: "#06b6d4", phone: "+1 (555) 345-6789", location: "Chicago, IL" },
  { id: 4, name: "Jake Williams", email: "jake.w@email.com", role: "Customer", joined: "2025-02-01", orders: 5, spent: 891, status: "Inactive", avatar: "JW", avatarColor: "#f59e0b", phone: "+1 (555) 456-7890", location: "Austin, TX" },
  { id: 5, name: "Ana Kovacs", email: "ana.kovacs@unimart.com", role: "Admin", joined: "2024-08-12", orders: 0, spent: 0, status: "Active", avatar: "AK", avatarColor: "#10b981", phone: "+1 (555) 567-8901", location: "Seattle, WA" },
  { id: 6, name: "Tom Bradley", email: "tom.b@email.com", role: "Customer", joined: "2024-11-28", orders: 41, spent: 7123, status: "Suspended", avatar: "TB", avatarColor: "#f97316", phone: "+1 (555) 678-9012", location: "Miami, FL" },
  { id: 7, name: "Yuna Park", email: "yuna.park@vendor.com", role: "Vendor", joined: "2024-09-05", orders: 89, spent: 18200, status: "Active", avatar: "YP", avatarColor: "#8b5cf6", phone: "+1 (555) 789-0123", location: "Los Angeles, CA" },
  { id: 8, name: "Carlos Rivera", email: "carlos.r@email.com", role: "Customer", joined: "2025-01-20", orders: 12, spent: 1560, status: "Active", avatar: "CR", avatarColor: "#14b8a6", phone: "+1 (555) 890-1234", location: "Houston, TX" },
  { id: 9, name: "Emma Wilson", email: "emma.w@email.com", role: "Customer", joined: "2024-12-15", orders: 33, spent: 5890, status: "Active", avatar: "EW", avatarColor: "#d946ef", phone: "+1 (555) 901-2345", location: "Boston, MA" },
  { id: 10, name: "David Kim", email: "david.kim@vendor.com", role: "Vendor", joined: "2024-11-01", orders: 67, spent: 14320, status: "Active", avatar: "DK", avatarColor: "#0ea5e9", phone: "+1 (555) 012-3456", location: "Portland, OR" },
];

const SEED_ORDERS = [
  { id: "UM-4821", customerId: 1, customer: "Sarah Chen", product: 'MacBook Pro 14" M3', productId: 1, amount: 2399, status: "Delivered", date: "2026-02-25", paymentMethod: "Credit Card" },
  { id: "UM-4820", customerId: 2, customer: "Marcus Lee", product: "Sony WH-1000XM5", productId: 3, amount: 349, status: "Shipped", date: "2026-02-24", paymentMethod: "PayPal" },
  { id: "UM-4819", customerId: 3, customer: "Priya Sharma", product: "iPad Air M2", productId: 5, amount: 749, status: "Processing", date: "2026-02-24", paymentMethod: "Credit Card" },
  { id: "UM-4818", customerId: 8, customer: "Carlos Rivera", product: 'Samsung 4K TV 65"', productId: 4, amount: 1299, status: "Delivered", date: "2026-02-23", paymentMethod: "Debit Card" },
  { id: "UM-4817", customerId: 4, customer: "Jake Williams", product: "AirPods Pro 2nd Gen", productId: 6, amount: 249, status: "Cancelled", date: "2026-02-23", paymentMethod: "Credit Card" },
  { id: "UM-4816", customerId: 9, customer: "Emma Wilson", product: "Nintendo Switch OLED", productId: 7, amount: 349, status: "Delivered", date: "2026-02-22", paymentMethod: "PayPal" },
  { id: "UM-4815", customerId: 7, customer: "Yuna Park", product: "iPhone 15 Pro Max", productId: 2, amount: 1199, status: "Shipped", date: "2026-02-22", paymentMethod: "Credit Card" },
  { id: "UM-4814", customerId: 10, customer: "David Kim", product: "PS5 Console", productId: 12, amount: 499, status: "Processing", date: "2026-02-21", paymentMethod: "Debit Card" },
  { id: "UM-4813", customerId: 1, customer: "Sarah Chen", product: "AirPods Pro 2nd Gen", productId: 6, amount: 249, status: "Delivered", date: "2026-02-21", paymentMethod: "Credit Card" },
  { id: "UM-4812", customerId: 6, customer: "Tom Bradley", product: 'LG UltraWide 34"', productId: 8, amount: 799, status: "Refunded", date: "2026-02-20", paymentMethod: "Credit Card" },
  { id: "UM-4811", customerId: 2, customer: "Marcus Lee", product: "Bose QuietComfort 45", productId: 11, amount: 279, status: "Delivered", date: "2026-02-20", paymentMethod: "PayPal" },
  { id: "UM-4810", customerId: 5, customer: "Ana Kovacs", product: "Samsung Galaxy S24 Ultra", productId: 10, amount: 1299, status: "Delivered", date: "2026-02-19", paymentMethod: "Credit Card" },
];

// ── Storage Helpers ───────────────────────────────────────────────────────────

const getStore = (key, seed) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  } catch {
    return seed;
  }
};

const setStore = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

const nextId = (items) =>
  items.length > 0 ? Math.max(...items.map((i) => Number(i.id) || 0)) + 1 : 1;

// Helper function for date formatting
const formatDate = (date, formatStr) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const day = days[date.getDay()];
  
  return formatStr
    .replace('HH:mm', `${hh}:${mm}`)
    .replace('EEE', day)
    .replace('MMM dd', `${m} ${d}`)
    .replace('MMM yyyy', `${m} ${y}`);
};

// ── Products API ──────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: async (filters = {}) => {
    await delay(200);
    let data = getStore("unimart_products", SEED_PRODUCTS);
    if (filters.category && filters.category !== "All") {
      data = data.filter((p) => p.category === filters.category);
    }
    if (filters.status && filters.status !== "All") {
      data = data.filter((p) => p.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return { data, total: data.length };
  },

  getById: async (id) => {
    await delay(100);
    const data = getStore("unimart_products", SEED_PRODUCTS);
    return data.find((p) => p.id === Number(id)) || null;
  },

  create: async (product) => {
    await delay(400);
    const data = getStore("unimart_products", SEED_PRODUCTS);
    const newProduct = {
      ...product,
      id: nextId(data),
      sales: 0,
      rating: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    data.push(newProduct);
    setStore("unimart_products", data);
    return newProduct;
  },

  update: async (id, updates) => {
    await delay(300);
    const data = getStore("unimart_products", SEED_PRODUCTS);
    const idx = data.findIndex((p) => p.id === Number(id));
    if (idx === -1) throw new Error("Product not found");
    data[idx] = { ...data[idx], ...updates };
    setStore("unimart_products", data);
    return data[idx];
  },

  delete: async (id) => {
    await delay(300);
    const data = getStore("unimart_products", SEED_PRODUCTS);
    const filtered = data.filter((p) => p.id !== Number(id));
    setStore("unimart_products", filtered);
    return { success: true };
  },

  getCategories: async () => {
    await delay(100);
    const data = getStore("unimart_products", SEED_PRODUCTS);
    return [...new Set(data.map((p) => p.category))];
  },

  getStats: async () => {
    await delay(150);
    const data = getStore("unimart_products", SEED_PRODUCTS);
    return {
      total: data.length,
      active: data.filter((p) => p.status === "Active").length,
      outOfStock: data.filter((p) => p.status === "Out of Stock").length,
      lowStock: data.filter((p) => p.status === "Low Stock").length,
    };
  },
};

// ── Users API ─────────────────────────────────────────────────────────────────

export const usersApi = {
  getAll: async (filters = {}) => {
    await delay(200);
    let data = getStore("unimart_users", SEED_USERS);
    if (filters.role && filters.role !== "All") {
      data = data.filter((u) => u.role === filters.role);
    }
    if (filters.status && filters.status !== "All") {
      data = data.filter((u) => u.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return { data, total: data.length };
  },

  getById: async (id) => {
    await delay(100);
    const data = getStore("unimart_users", SEED_USERS);
    return data.find((u) => u.id === Number(id)) || null;
  },

  create: async (user) => {
    await delay(400);
    const data = getStore("unimart_users", SEED_USERS);
    const newUser = {
      ...user,
      id: nextId(data),
      orders: 0,
      spent: 0,
      joined: new Date().toISOString().split("T")[0],
      avatarColor: ["#6366f1","#ec4899","#06b6d4","#f59e0b","#10b981","#8b5cf6"][Math.floor(Math.random()*6)],
    };
    data.push(newUser);
    setStore("unimart_users", data);
    return newUser;
  },

  update: async (id, updates) => {
    await delay(300);
    const data = getStore("unimart_users", SEED_USERS);
    const idx = data.findIndex((u) => u.id === Number(id));
    if (idx === -1) throw new Error("User not found");
    data[idx] = { ...data[idx], ...updates };
    setStore("unimart_users", data);
    return data[idx];
  },

  delete: async (id) => {
    await delay(300);
    const data = getStore("unimart_users", SEED_USERS);
    const filtered = data.filter((u) => u.id !== Number(id));
    setStore("unimart_users", filtered);
    return { success: true };
  },

  getStats: async () => {
    await delay(150);
    const data = getStore("unimart_users", SEED_USERS);
    return {
      total: data.length + 12533,
      active: data.filter((u) => u.status === "Active").length + 11274,
      vendors: data.filter((u) => u.role === "Vendor").length + 381,
      newThisMonth: 248,
    };
  },
};

// ── Orders API ────────────────────────────────────────────────────────────────

export const ordersApi = {
  getAll: async (filters = {}) => {
    await delay(200);
    let data = getStore("unimart_orders", SEED_ORDERS);
    if (filters.status && filters.status !== "All") {
      data = data.filter((o) => o.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q)
      );
    }
    return { data, total: data.length };
  },

  updateStatus: async (id, status) => {
    await delay(300);
    const data = getStore("unimart_orders", SEED_ORDERS);
    const idx = data.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");
    data[idx].status = status;
    setStore("unimart_orders", data);
    return data[idx];
  },

  getRecent: async (limit = 5) => {
    await delay(150);
    const data = getStore("unimart_orders", SEED_ORDERS);
    return data
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  },
};

// ── Dashboard API (Fully implemented) ─────────────────────────────────────────

export const dashboardApi = {
  // Get KPI data
  getKPI: async (timeRange) => {
    await delay(300);
    const products = getStore("unimart_products", SEED_PRODUCTS);
    const orders = getStore("unimart_orders", SEED_ORDERS);
    const users = getStore("unimart_users", SEED_USERS);
    
    // Calculate real data from stores
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = orders.length;
    const totalCustomers = users.length + 12533;
    
    // Mock trends based on timeRange
    const trends = {
      '24h': { revenue: 12.5, orders: 8.2, customers: 15.3, conversion: 2.1, aov: -1.5 },
      '7d': { revenue: 8.7, orders: 5.4, customers: 10.2, conversion: 1.8, aov: 2.3 },
      '30d': { revenue: 15.2, orders: 11.8, customers: 22.5, conversion: 3.2, aov: 4.1 },
      '90d': { revenue: 24.6, orders: 18.3, customers: 35.7, conversion: 5.4, aov: 6.8 },
      '1y': { revenue: 42.1, orders: 31.5, customers: 58.2, conversion: 7.6, aov: 9.3 },
    };

    const trend = trends[timeRange] || trends['30d'];

    return {
      revenue: totalRevenue,
      revenueTrend: trend.revenue,
      orders: totalOrders,
      ordersTrend: trend.orders,
      customers: totalCustomers,
      customersTrend: trend.customers,
      conversionRate: 3.8,
      conversionTrend: trend.conversion,
      aov: Math.round(totalRevenue / totalOrders) || 362,
      aovTrend: trend.aov,
    };
  },

  // Get sales trend data
  getSalesTrend: async (timeRange) => {
    await delay(200);
    const orders = getStore("unimart_orders", SEED_ORDERS);
    
    let days = 30;
    let formatStr = 'MMM dd';
    
    switch(timeRange) {
      case '24h':
        days = 1;
        formatStr = 'HH:mm';
        break;
      case '7d':
        days = 7;
        formatStr = 'EEE';
        break;
      case '30d':
        days = 30;
        formatStr = 'MMM dd';
        break;
      case '90d':
        days = 90;
        formatStr = 'MMM dd';
        break;
      case '1y':
        days = 365;
        formatStr = 'MMM yyyy';
        break;
      default:
        days = 30;
        formatStr = 'MMM dd';
    }

    const data = [];
    const now = new Date();
    
    // Group orders by date
    const ordersByDate = {};
    orders.forEach(order => {
      if (!ordersByDate[order.date]) {
        ordersByDate[order.date] = {
          revenue: 0,
          count: 0
        };
      }
      ordersByDate[order.date].revenue += order.amount;
      ordersByDate[order.date].count += 1;
    });
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayData = ordersByDate[dateStr] || { revenue: 0, count: 0 };
      
      // If no data for this date, generate random data for demo
      const revenue = dayData.revenue || Math.floor(Math.random() * 50000) + 20000;
      const orderCount = dayData.count || Math.floor(Math.random() * 150) + 50;
      
      data.push({
        date: formatDate(date, formatStr),
        revenue: revenue,
        orders: orderCount,
      });
    }
    
    return data;
  },

  // Get category performance
  getCategoryPerformance: async (timeRange) => {
    await delay(150);
    const products = getStore("unimart_products", SEED_PRODUCTS);
    const orders = getStore("unimart_orders", SEED_ORDERS);
    
    // Calculate category sales
    const categoryMap = new Map();
    
    orders.forEach(order => {
      const product = products.find(p => p.id === order.productId);
      if (product) {
        const cat = product.category;
        const current = categoryMap.get(cat) || 0;
        categoryMap.set(cat, current + order.amount);
      }
    });
    
    // If no real data, use mock
    if (categoryMap.size === 0) {
      return [
        { name: 'Electronics', value: 450000 },
        { name: 'Fashion', value: 380000 },
        { name: 'Books', value: 210000 },
        { name: 'Home & Furniture', value: 320000 },
        { name: 'Other', value: 120000 },
      ];
    }
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  },

  // Get top products
  getTopProducts: async (timeRange) => {
    await delay(150);
    const products = getStore("unimart_products", SEED_PRODUCTS);
    const orders = getStore("unimart_orders", SEED_ORDERS);
    
    // Calculate product sales
    const productSales = new Map();
    
    orders.forEach(order => {
      const productId = order.productId;
      const current = productSales.get(productId) || { revenue: 0, count: 0 };
      productSales.set(productId, {
        revenue: current.revenue + order.amount,
        count: current.count + 1,
      });
    });
    
    // Map to products
    const topProducts = products
      .map(product => {
        const sales = productSales.get(product.id) || { revenue: 0, count: 0 };
        return {
          id: product.id,
          name: product.name,
          category: product.category,
          revenue: sales.revenue || product.price * product.sales,
          sold: sales.count || product.sales,
          image: product.image,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return topProducts.length ? topProducts : [
      { id: 1, name: 'iPhone 14 Pro', category: 'Electronics', revenue: 245000, sold: 42, image: '📱' },
      { id: 2, name: 'Nike Air Max', category: 'Fashion', revenue: 189000, sold: 156, image: '👟' },
      { id: 3, name: 'MacBook Pro', category: 'Electronics', revenue: 168000, sold: 18, image: '💻' },
      { id: 4, name: 'Harry Potter Box Set', category: 'Books', revenue: 89000, sold: 234, image: '📚' },
      { id: 5, name: 'Samsung TV 65"', category: 'Electronics', revenue: 76000, sold: 8, image: '📺' },
    ];
  },

  // Get user activity
  getUserActivity: async (timeRange) => {
    await delay(150);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      visitors: Math.floor(Math.random() * 1000) + 500,
      pageViews: Math.floor(Math.random() * 3000) + 1000,
    }));
  },

  // Get geographic distribution
  getGeoDistribution: async (timeRange) => {
    await delay(150);
    return [
      { name: 'Accra', percentage: 35 },
      { name: 'Kumasi', percentage: 25 },
      { name: 'Takoradi', percentage: 15 },
      { name: 'Tamale', percentage: 12 },
      { name: 'Cape Coast', percentage: 8 },
      { name: 'Other', percentage: 5 },
    ];
  },

  // Get inventory alerts
  getInventoryAlerts: async () => {
    await delay(150);
    const products = getStore("unimart_products", SEED_PRODUCTS);
    
    const alerts = products
      .filter(p => p.stock < 10 || p.status === 'Low Stock' || p.status === 'Out of Stock')
      .map(p => ({
        id: p.id,
        product: p.name,
        sku: p.sku,
        stock: p.stock,
        threshold: 10,
      }))
      .slice(0, 5);
    
    return alerts.length ? alerts : [
      { id: 1, product: 'iPhone 14 Pro', sku: 'IP14P-256', stock: 3, threshold: 10 },
      { id: 2, product: 'Nike Air Max', sku: 'NK-AM-42', stock: 5, threshold: 20 },
      { id: 3, product: 'MacBook Pro M2', sku: 'MBP-M2-512', stock: 2, threshold: 5 },
      { id: 4, product: 'Wireless Headphones', sku: 'WH-1000', stock: 8, threshold: 15 },
    ];
  },

  // Get recent orders
  getRecentOrders: async () => {
    await delay(150);
    const orders = getStore("unimart_orders", SEED_ORDERS);
    
    const recentOrders = orders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(o => ({
        id: o.id,
        orderNumber: o.id,
        customer: o.customer,
        amount: o.amount,
        status: o.status.toLowerCase(),
      }));
    
    return recentOrders.length ? recentOrders : [
      { id: 'UM-4821', orderNumber: 'UM-4821', customer: 'John Doe', amount: 1250, status: 'delivered' },
      { id: 'UM-4820', orderNumber: 'UM-4820', customer: 'Jane Smith', amount: 349, status: 'shipped' },
      { id: 'UM-4819', orderNumber: 'UM-4819', customer: 'Bob Johnson', amount: 749, status: 'processing' },
      { id: 'UM-4818', orderNumber: 'UM-4818', customer: 'Alice Brown', amount: 1299, status: 'delivered' },
      { id: 'UM-4817', orderNumber: 'UM-4817', customer: 'Charlie Wilson', amount: 249, status: 'cancelled' },
    ];
  },

  // Get conversion funnel
  getConversionFunnel: async (timeRange) => {
    await delay(150);
    return [
      { stage: 'Visitors', count: 50000 },
      { stage: 'Product Views', count: 35000 },
      { stage: 'Add to Cart', count: 12000 },
      { stage: 'Checkout', count: 5000 },
      { stage: 'Purchase', count: 1900 },
    ];
  },

  // Get real-time visitors
  getRealtimeVisitors: async () => {
    await delay(50);
    return Math.floor(Math.random() * 50) + 10; // 10-60 visitors
  },

  // Legacy method for backward compatibility
  getGeoData: async (timeRange) => {
    console.warn('getGeoData is deprecated, use getGeoDistribution instead');
    return dashboardApi.getGeoDistribution(timeRange);
  },

  // Original methods kept for backward compatibility
  getStats: async () => {
    await delay(300);
    const orders = getStore("unimart_orders", SEED_ORDERS);
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    
    return {
      revenue: { value: totalRevenue || 84254, change: 12.5, positive: true, spark: [30,45,38,60,55,72,84,78,92,88,95,84] },
      orders: { value: orders.length || 3842, change: 8.2, positive: true, spark: [20,35,28,50,45,62,58,70,65,78,72,84] },
      products: { value: 1294, change: -2.1, positive: false, spark: [80,75,82,78,70,72,68,72,69,71,73,70] },
      users: { value: 12543, change: 18.7, positive: true, spark: [40,55,48,70,65,82,78,90,85,98,92,105] },
    };
  },

  getRevenueSeries: async () => {
    await delay(200);
    return [
      { month: "Jan", revenue: 42000, orders: 310 },
      { month: "Feb", revenue: 58000, orders: 425 },
      { month: "Mar", revenue: 51000, orders: 380 },
      { month: "Apr", revenue: 67000, orders: 502 },
      { month: "May", revenue: 72000, orders: 534 },
      { month: "Jun", revenue: 63000, orders: 465 },
      { month: "Jul", revenue: 78000, orders: 580 },
      { month: "Aug", revenue: 85000, orders: 632 },
      { month: "Sep", revenue: 79000, orders: 588 },
      { month: "Oct", revenue: 93000, orders: 695 },
      { month: "Nov", revenue: 88000, orders: 652 },
      { month: "Dec", revenue: 84254, orders: 628 },
    ];
  },

  getCategories: async () => {
    await delay(150);
    return [
      { name: "Electronics", value: 54, color: "#6366f1" },
      { name: "Appliances", value: 22, color: "#06b6d4" },
      { name: "Accessories", value: 14, color: "#f59e0b" },
      { name: "Others", value: 10, color: "#ec4899" },
    ];
  },
};

// ── Settings API ──────────────────────────────────────────────────────────────

export const settingsApi = {
  get: async () => {
    await delay(200);
    const defaults = {
      store: {
        name: "Unimart",
        email: "support@unimart.com",
        phone: "+1 (800) 123-4567",
        currency: "USD",
        taxRate: "8.5",
        region: "North America",
        website: "https://unimart.com",
      },
      notifications: {
        email: true,
        push: true,
        sms: false,
        weeklyReport: true,
        orderUpdates: true,
        lowStockAlerts: true,
        securityAlerts: true,
      },
      security: {
        twoFactor: true,
        sessionTimeout: "60",
        loginAlerts: true,
      },
    };
    const saved = localStorage.getItem("unimart_settings");
    return saved ? JSON.parse(saved) : defaults;
  },

  update: async (section, data) => {
    await delay(400);
    const current = JSON.parse(localStorage.getItem("unimart_settings") || "{}");
    const updated = { ...current, [section]: { ...current[section], ...data } };
    localStorage.setItem("unimart_settings", JSON.stringify(updated));
    return updated;
  },
};

// ── Notifications API ─────────────────────────────────────────────────────────

export const notificationsApi = {
  getAll: async () => {
    await delay(100);
    return [
      { id: 1, type: "order", message: "New order #UM-4821 received", time: "2 min ago", read: false },
      { id: 2, type: "stock", message: "AirPods Pro 2nd Gen low stock (5 left)", time: "15 min ago", read: false },
      { id: 3, type: "user", message: "New vendor registration: Yuna Park", time: "1 hr ago", read: false },
      { id: 4, type: "order", message: "Order #UM-4817 was cancelled", time: "3 hr ago", read: true },
      { id: 5, type: "stock", message: "PS5 Console running low (7 left)", time: "5 hr ago", read: true },
    ];
  },

  markRead: async (id) => {
    await delay(100);
    return { success: true };
  },
};

// Default export for backward compatibility
export default {
  productsApi,
  usersApi,
  ordersApi,
  dashboardApi,
  settingsApi,
  notificationsApi,
};