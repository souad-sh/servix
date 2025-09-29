// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("servix_user") || "null");
    } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Restore/verify session on first load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        if (!cancelled && res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem("servix_user", JSON.stringify(data.user));
          } else {
            setUser(null);
            localStorage.removeItem("servix_user");
          }
        } else if (!cancelled) {
          setUser(null);
          localStorage.removeItem("servix_user");
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          localStorage.removeItem("servix_user");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = async (userObj) => {
    setUser(userObj);
    localStorage.setItem("servix_user", JSON.stringify(userObj));
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
    } catch {}
    localStorage.removeItem("servix_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
