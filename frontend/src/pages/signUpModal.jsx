import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import logo from "../assets/logo_transparent.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/** tiny client-side strength scorer: 0..5 */
function scorePassword(p = "") {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s; // 0..5
}
const strengthLabel = ["", "Very weak", "Weak", "Okay", "Good", "Strong"];
const strengthBarClass = [
  "w-0",
  "w-1/5 bg-red-500",
  "w-2/5 bg-orange-500",
  "w-3/5 bg-yellow-500",
  "w-4/5 bg-lime-500",
  "w-full bg-green-600",
];

export default function SignupModal({
  open,
  onClose,
  defaultPlan = "starter",
  onSwitchToLogin,
}) {
  const dialogRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);

  const [form, setForm] = useState({
    org_name: "",
    name: "",
    email: "",
    password: "",
    plan_code: defaultPlan,
  });

  // keep plan in sync
  useEffect(() => {
    setForm((f) => ({ ...f, plan_code: defaultPlan }));
  }, [defaultPlan]);

  // ESC / focus / lock scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!agree) return; // safety guard
    setError("");
    setLoading(true);
    try {
      const res = await fetch(API_BASE + "/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) throw new Error(data.message || "Signup failed");

      // go to Stripe Checkout (normal flow)
      if (data.checkout_url) {
        window.location.assign(data.checkout_url);
        return;
      }
      // fallback if you ever skip Stripe
      window.location.assign("/admin");
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  const pwdScore = scorePassword(form.password);

  if (!open) return null;

  return createPortal(
    <div aria-modal="true" role="dialog" aria-labelledby="signup-title" className="fixed inset-0 z-[9999]">
      {/* overlay (don’t close while submitting) */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* scroll container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="min-h-full flex items-start justify-center p-4 sm:p-6">
          {/* panel */}
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="relative z-10 w-full max-w-lg mx-auto my-8 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 max-h-[85vh] overflow-y-auto"
          >
            {/* header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Servix" className="w-8 h-8 object-contain" />
                <h2 id="signup-title" className="text-lg font-semibold">Create your Servix account</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-slate-100 disabled:opacity-50"
                aria-label="Close"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* body */}
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              {/* plan chooser */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {["starter", "pro", "enterprise"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, plan_code: p }))}
                      className={`rounded-lg border px-3 py-2 text-sm capitalize ${
                        form.plan_code === p
                          ? "border-blue-600 text-blue-700 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* org name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization name</label>
                <input
                  name="org_name"
                  value={form.org_name}
                  onChange={onChange}
                  minLength={2}
                  required
                  autoComplete="organization"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. TransCo"
                />
              </div>

              {/* full name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  minLength={2}
                  required
                  autoComplete="name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leen Krayem"
                />
              </div>

              {/* email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@company.com"
                  aria-invalid={Boolean(error) && !form.email.includes("@")}
                />
              </div>

              {/* password + strength */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={onChange}
                    minLength={6}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min 6 characters"
                    aria-describedby="pwd-help"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-sm"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>

                {/* strength meter */}
                <div className="mt-2">
                  <div className="h-1.5 rounded bg-slate-200">
                    <div className={`h-full rounded transition-all ${strengthBarClass[pwdScore]}`} />
                  </div>
                  {form.password && (
                    <p id="pwd-help" className="mt-1 text-xs text-slate-500">
                      {strengthLabel[pwdScore] || ""}
                    </p>
                  )}
                </div>
              </div>

              {/* global error */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              {/* agree to terms */}
              <label className="flex items-start gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  aria-required="true"
                />
                <span>
                  I agree to the{" "}
                  <a href="/terms" className="text-blue-600 underline">Terms</a> &{" "}
                  <a href="/privacy" className="text-blue-600 underline">Privacy</a>.
                </span>
              </label>

              {/* actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading || !agree}
                  className="inline-flex justify-center items-center rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create account"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>

              {/* switch to login */}
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={() => onSwitchToLogin?.()}
                >
                  Sign in
                </button>
              </p>
            </form>

            {/* blocking spinner overlay while loading (optional) */}
            {loading && (
              <div className="absolute inset-0 grid place-items-center bg-white/50 rounded-2xl">
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}