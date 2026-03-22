
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout, { PendingApprovalsPage } from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/DashboardPage";
import ListingsPage from "./pages/Products/ListingsPage";
import Users from "./pages/Users";

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
            }
          >
            <Route index element={<Dashboard />} />

            {/* Products */}
            <Route path="products">
              <Route index element={<ListingsPage />} />
              <Route path="pending" element={<PendingApprovalsPage />} />
            </Route>

            <Route path="users" element={<Users />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}