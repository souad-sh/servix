// src/auth/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // If we just returned from Stripe Checkout, confirm it first
        const sid = new URLSearchParams(location.search).get("session_id");
        if (sid) {
          await fetch(`${API_BASE}/billing/confirm?session_id=${encodeURIComponent(sid)}`, {
            credentials: "include",
          }).catch(() => {});
          // Clean URL after confirming
          window.history.replaceState({}, "", "/admin");
        }

        // Now check session/cookie
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (!cancelled) setOk(Boolean(data?.ok));
      } catch {
        if (!cancelled) setOk(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [location.key]);

  if (loading) return <div className="p-8 text-slate-600">Loading…</div>;

  // Not authenticated: go back to Landing. Add a flag to auto-open the signup modal if you want.
  if (!ok) return <Navigate to="/?showSignup=1" replace />;

  return children ?? <Outlet />;
}
