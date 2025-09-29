// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/publicLayout";
import AdminLayout from "./layouts/adminLayout";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Admin/Dashboard";
import Vehicles from "./pages/Admin/Vehicles";
import ServiceLog from "./pages/Admin/ServiceLogs";
import Maintenance from "./pages/Admin/Maintenance";

import Signup from "./pages/signUpModal";          // ⬅️ Capitalized component name & file
import PayInvoice from "./pages/Billing/payInvoice";
import DriverForm from "./pages/driver/DriverForm.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";

const Inventory = () => <div className="p-8">Inventory page (coming soon)</div>;
const Reports   = () => <div className="p-8">Reports page (coming soon)</div>;
const Users     = () => <div className="p-8">Users & Roles (coming soon)</div>;
const NotFound  = () => <div className="p-8">404 — Not Found</div>;

export default function App() {
  return (
    <Routes>
      {/* Public site (Navbar + Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>
       <Route path="/signup" element={<Signup />} /> 

      {/* Admin area (Sidebar + content) */}
      <Route
        path="/admin"
        element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="service-logs" element={<ServiceLog />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="reports" element={<Reports />} />
        <Route path="users" element={<Users />} />
        <Route path="maintenance" element={<Maintenance />} />
      </Route>
      <Route path="/billing/pay" element={<PayInvoice />} />

<Route path="/driver" >
        <Route index element={<DriverForm />} />
      </Route>
      {/* Login page (public) */}

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
