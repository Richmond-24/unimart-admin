import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// Demo users
const DEMO_USERS = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "admin@unimart.com",
    password: "admin123",
    role: "Super Admin",
    avatar: "AM",
    avatarColor: "from-pink-500 to-orange-500",
    permissions: ["all"],
  },
  {
    id: 2,
    name: "Jordan Lee",
    email: "manager@unimart.com",
    password: "manager123",
    role: "Manager",
    avatar: "JL",
    avatarColor: "from-indigo-500 to-cyan-500",
    permissions: ["products", "users", "dashboard"],
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const saved = localStorage.getItem("unimart_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await new Promise((r) => setTimeout(r, 800)); // simulate API
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem("unimart_user", JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    }
    return { success: false, error: "Invalid email or password." };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("unimart_user");
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("unimart_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
