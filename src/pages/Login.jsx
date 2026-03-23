
// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function IconLock({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function IconUser({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconEye({ size = 18, off = false }) {
  return off ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#F8F9FA" }}>

      <div className="w-full max-w-sm">

        {/* Logo + brand */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Uni-Mart Logo"
            className="w-14 h-14 rounded-2xl mx-auto mb-4 shadow-lg shadow-orange-200 object-cover"
          />
          <h1 className="text-2xl font-black" style={{ color: "#1B1B1F" }}>Uni-Mart Admin</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Sign in to access the dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-7" style={{ borderColor: "#EEEEEE" }}>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <div
                className="text-sm px-4 py-3 rounded-xl font-medium"
                style={{ background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA" }}
              >
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider"
                style={{ color: "#6B7280" }}>
                Username
              </label>
              <div
                className="flex items-center gap-2.5 border rounded-xl px-3.5 py-3 transition-colors focus-within:border-orange-400"
                style={{ borderColor: "#EEEEEE", background: "#F8F9FA" }}
              >
                <span style={{ color: "#9CA3AF" }}><IconUser size={17} /></span>
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "#1B1B1F" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider"
                style={{ color: "#6B7280" }}>
                Password
              </label>
              <div
                className="flex items-center gap-2.5 border rounded-xl px-3.5 py-3 transition-colors focus-within:border-orange-400"
                style={{ borderColor: "#EEEEEE", background: "#F8F9FA" }}
              >
                <span style={{ color: "#9CA3AF" }}><IconLock size={17} /></span>
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "#1B1B1F" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="transition-colors hover:opacity-70 flex-shrink-0"
                  style={{ color: "#9CA3AF" }}
                  tabIndex={-1}
                >
                  <IconEye size={17} off={showPass} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-sm text-white transition-opacity disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #FF8A3C, #FF6A00)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-6" style={{ color: "#9CA3AF" }}>
          Uni-Mart Admin · Authorised access only
        </p>
      </div>
    </div>
  );
}