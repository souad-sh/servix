const API_BASE = import.meta.env.VITE_API_BASE_URL || ""; // "" means same origin

export async function api(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    credentials: "include",                // <-- important for cookies
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data; // typically { ok: true, ... }
}
