// src/pages/driver/driverApi.js
const API = import.meta.env.VITE_API_BASE_URL || "";

export async function submitMaintenance(data, isOnline) {
  if (isOnline) {
    const res = await fetch(`${API}/api/driver/maintenance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Network error");
    return await res.json();
  } else {
    const pending = JSON.parse(localStorage.getItem("pendingMaint") || "[]");
    pending.push({ ...data, ts: Date.now() });
    localStorage.setItem("pendingMaint", JSON.stringify(pending));
    return { savedOffline: true };
  }
}