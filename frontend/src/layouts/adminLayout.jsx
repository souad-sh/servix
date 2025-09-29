// src/layouts/AdminLayout.jsx
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// Runs once when /admin?session_id=... is loaded, confirms with backend, then cleans URL
function AfterStripeConfirm() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sid = new URLSearchParams(location.search).get("session_id");
    if (!sid) return;

    (async () => {
      try {
        await fetch(`${API_BASE}/billing/confirm?session_id=${encodeURIComponent(sid)}`, {
          credentials: "include",
        });
      } catch {
        // ignore — even if confirm fails, don't keep the query param around
      } finally {
        // remove ?session_id and go to dashboard
        navigate("/admin/dashboard", { replace: true });
      }
    })();
  }, [location.search, navigate]);

  return null;
}

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* make sure this is rendered so confirmation runs */}
        <AfterStripeConfirm />
        <Outlet />
      </main>
    </div>
  );
}
