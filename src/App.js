
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/DashboardPage"; // Updated path
import ListingsPage from "./pages/Products/ListingsPage"; // New import
import Users from "./pages/Users";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
            <Route index element={<Dashboard />} />
            
            {/* Products routes */}
            <Route path="products">
              <Route index element={<ListingsPage />} />
              {/* You can add more product-related routes here later */}
              {/* <Route path="pending" element={<PendingPage />} /> */}
              {/* <Route path=":id" element={<ProductDetail />} /> */}
            </Route>
            
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}