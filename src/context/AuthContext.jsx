
// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  AUTHORISED USERS
//  Passwords are stored as SHA-256 hashes — the plain-text never lives in code.
//
//  User 1 → username: richmond   password: 2025
//  User 2 → username: admin      password: 2026
// ─────────────────────────────────────────────────────────────────────────────
const AUTHORISED_USERS = [
  {
    username:     "richmond",
    displayName:  "Richmond",
    role:         "Super Admin",
    passwordHash: "b2b2f104d32c638903e151a9b20d6e27b41d8c0c84cf8458738f83ca2f1dd744", 
  },
  {
    username:     "admin",
    displayName:  "Administrator",
    role:         "Admin",
    passwordHash: "158a323a7ba44870f23d96f1516dd70aa48e9a72db4ebb026b0a89e212a208ab",
  },
];

const SESSION_KEY = "um_admin_session";

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const found = AUTHORISED_USERS.find(u => u.username === parsed.username);
        if (found) {
          setUser({ username: found.username, displayName: found.displayName, role: found.role });
        }
      }
    } catch (_) {
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (username, password) => {
    const trimmedUser = (username || "").trim().toLowerCase();
    const trimmedPass = (password || "").trim();

    if (!trimmedUser || !trimmedPass) {
      return { success: false, error: "Username and password are required." };
    }

    const found = AUTHORISED_USERS.find(u => u.username === trimmedUser);
    if (!found) {
      return { success: false, error: "Invalid username or password." };
    }

    const hash = await sha256(trimmedPass);
    if (hash !== found.passwordHash) {
      return { success: false, error: "Invalid username or password." };
    }

    const sessionUser = {
      username:    found.username,
      displayName: found.displayName,
      role:        found.role,
    };

    setUser(sessionUser);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    return { success: true, user: sessionUser };
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}