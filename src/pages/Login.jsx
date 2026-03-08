
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@unimart.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FFF5E8 0%, #FFFFFF 50%, #FFE4D6 100%)" }}>
      
      {/* Decorative Orange Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full opacity-10"
          style={{ 
            background: "radial-gradient(circle, #FF6A00, transparent)", 
            top: "-10%", 
            left: "-5%", 
            animation: "float 8s ease-in-out infinite" 
          }} />
        <div className="absolute w-72 h-72 rounded-full opacity-10"
          style={{ 
            background: "radial-gradient(circle, #FF8A3C, transparent)", 
            bottom: "10%", 
            right: "5%", 
            animation: "float 12s ease-in-out infinite reverse" 
          }} />
        <div className="absolute w-48 h-48 rounded-full opacity-5"
          style={{ 
            background: "radial-gradient(circle, #FF6A00, transparent)", 
            top: "50%", 
            right: "30%", 
            animation: "float 6s ease-in-out infinite 2s" 
          }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{ 
                background: "linear-gradient(135deg, #FF6A00, #FF8A3C)",
                boxShadow: "0 10px 25px -5px rgba(255, 106, 0, 0.3)"
              }}>
              UM
            </div>
            <span className="text-3xl font-bold text-[#1B1B1F] tracking-tight">Uni-Mart</span>
          </div>
          <p className="text-[#6B7280] text-xs tracking-widest uppercase font-medium">Admin Control Center</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 bg-white shadow-xl border border-[#FFE4D6]">
          <h2 className="text-2xl font-bold text-[#1B1B1F] mb-1">Welcome back</h2>
          <p className="text-[#6B7280] text-sm mb-7">Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none text-[#1B1B1F]"
                style={{
                  borderColor: "#FFE4D6",
                  backgroundColor: "#F8F9FA",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF6A00";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255, 106, 0, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#FFE4D6";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="admin@unimart.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none text-[#1B1B1F]"
                style={{
                  borderColor: "#FFE4D6",
                  backgroundColor: "#F8F9FA",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF6A00";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255, 106, 0, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#FFE4D6";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
                style={{ 
                  background: "#FFE4D6", 
                  border: "1px solid #FF6A00",
                  color: "#FF6A00" 
                }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-2 hover:shadow-lg hover:shadow-orange-500/25"
              style={{ 
                background: "linear-gradient(135deg, #FF6A00, #FF8A3C)",
              }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-xl p-4 space-y-2"
            style={{ 
              background: "#FFF5E8", 
              border: "1px solid #FFE4D6" 
            }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#FF6A00" }}>
              Demo Accounts
            </p>
            <p className="text-xs text-[#6B7280]">
              <span style={{ color: "#FF6A00", fontWeight: 500 }}>Super Admin:</span> admin@unimart.com / admin123
            </p>
            <p className="text-xs text-[#6B7280]">
              <span style={{ color: "#FF6A00", fontWeight: 500 }}>Manager:</span> manager@unimart.com / manager123
            </p>
          </div>
        </div>

        <p className="text-center text-[#6B7280] text-xs mt-6">
          © 2026 Uni-Mart. All rights reserved.
        </p>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}