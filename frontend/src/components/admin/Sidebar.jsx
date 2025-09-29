import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaFileAlt,
  FaTools,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { name: "Dashboard",         path: "/admin/dashboard",    icon: <FaTachometerAlt /> },
  { name: "Vehicles",          path: "/admin/vehicles",     icon: <FaCar /> },
  { name: "service-logs",      path: "/admin/service-logs", icon: <FaClipboardList /> },
  { name: "Maintenance Tasks", path: "/admin/maintenance",  icon: <FaTools /> },
  // { name: "Reports",         path: "/admin/reports",      icon: <FaFileAlt /> },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  // optional: close on ESC
  useEffect(() => {
    if (!showConfirm) return;
    const onKey = (e) => e.key === "Escape" && setShowConfirm(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showConfirm]);

  const proceedLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    localStorage.setItem("servix_user", JSON.stringify({ role: "user" }));
    navigate("/", { replace: true });
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-blue-100 border-r border-blue-200 flex flex-col font-[Inter,ui-sans-serif,system-ui]">
      <div className="px-5 py-5">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Servix</h1>
      </div>

      <nav className="px-3 py-2 space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-900 hover:bg-blue-200"}`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout footer */}
      <div className="px-3 pb-4">
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold
                     bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 transition"
        >
          <FaSignOutAlt className="text-base" />
        Logout
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-labelledby="logout-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(false)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 id="logout-title" className="text-lg font-semibold text-slate-900">
              Confirm Logout
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to logout?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={proceedLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
