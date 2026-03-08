# Unimart Admin Dashboard

A modern, full-featured e-commerce admin dashboard built with React, Tailwind CSS, and Recharts.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@unimart.com | admin123 |
| Manager | manager@unimart.com | manager123 |

## 📁 Project Structure

```
unimart-admin/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Sidebar + Header + Notifications
│   │   └── ProtectedRoute.jsx  # Auth guard
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state + localStorage session
│   ├── pages/
│   │   ├── Login.jsx           # Login with demo accounts
│   │   ├── Dashboard.jsx       # KPIs, charts, recent orders
│   │   ├── Products.jsx        # Full CRUD product management
│   │   ├── Users.jsx           # Full CRUD user management
│   │   └── Settings.jsx        # Profile, notifications, security, store
│   ├── services/
│   │   └── api.js              # Mock API with localStorage persistence
│   ├── App.js                  # React Router setup
│   ├── index.js                # Entry point
│   └── index.css               # Tailwind + global styles
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## ✨ Features

### Dashboard
- KPI stat cards with sparklines and trend indicators
- Interactive revenue chart (Area / Bar toggle)
- Category breakdown pie chart
- Recent orders table
- Top products ranking

### Products
- Card grid with category/status filters and search
- Full CRUD: Add, View, Edit, Delete
- Form validation
- Toast notifications
- Emoji product icon picker
- Stock status management (Active / Low Stock / Out of Stock)

### Users
- Sortable data table with pagination info
- Full CRUD: Add, View, Edit, Delete
- Filter by status (Active/Inactive/Suspended) and role
- User detail modal with suspend/reactivate toggle
- Avatar color generation

### Settings
- Profile editor with live update
- Password change with validation and show/hide toggle
- Notification toggles (Email, Push, SMS, Weekly Report, etc.)
- Security settings (2FA, Login Alerts)
- Store configuration (Currency, Tax Rate, Region)
- Danger zone actions

### Extras
- 🔔 Notification dropdown with read/unread state
- 🔒 Session persistence (survives page refresh)
- 📱 Responsive sidebar (collapsible)
- 💾 LocalStorage data persistence
- 🎨 Dark theme throughout
- ✨ Smooth animations and transitions

## 🛠 Tech Stack

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Tailwind CSS v3** - Utility-first CSS
- **Recharts** - Chart components
- **Lucide React** - Icons (via custom SVG component)
- **localStorage** - Mock data persistence

## 📝 Notes

- All data is stored in `localStorage` — it persists between page refreshes
- The seed data is loaded on first run; changes are saved locally
- No backend required; fully functional as a standalone SPA

## 🏗 Build for Production

```bash
npm run build
```

Output will be in the `build/` folder.
