import { useEffect, useMemo, useState } from "react";
const API = import.meta.env.VITE_API_BASE_URL || "";

export default function PayInvoice() {
  const [invoice, setInvoice] = useState(null);
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("pending");
  const inv = new URLSearchParams(location.search).get("inv");

  useEffect(() => {
    if (!inv) return;
    fetch(`${API}/payments/invoice/${inv}`).then(r=>r.json()).then(setInvoice);
    const t = setInterval(async () => {
      const r = await fetch(`${API}/payments/invoice/${inv}`);
      const j = await r.json();
      setStatus(j.status || j.invoice?.status || "pending");
    }, 3000);
    return () => clearInterval(t);
  }, [inv]);

  async function pay(provider) {
    setSession(null);
    const r = await fetch(`${API}/payments/${provider}/create`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ invoiceId: inv })
    });
    const s = await r.json();
    setSession(s);
    if (s.paymentUrl) window.open(s.paymentUrl, "_blank");
  }

  if (!inv) return <div className="p-6">Missing invoice id.</div>;
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Complete your payment</h1>
      <div className="rounded-lg border p-4">
        <p className="text-sm text-slate-600">Invoice: <b>{inv}</b></p>
        <p className="text-sm">Amount: <b>{(invoice?.amount_cents||0)/100} {invoice?.currency||"USD"}</b></p>
        <p className="text-sm">Status: <b className="uppercase">{status}</b></p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <button onClick={()=>pay("aps")} className="rounded-lg border px-4 py-3 hover:bg-slate-50">
          Pay by Card (APS)
        </button>
        <button onClick={()=>pay("whish")} className="rounded-lg border px-4 py-3 hover:bg-slate-50">
          Pay by Wallet (Whish)
        </button>
      </div>

      {session?.qrSvg && (
        <div className="rounded-lg border p-4" dangerouslySetInnerHTML={{ __html: session.qrSvg }} />
      )}

      {status === "paid" && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-4">
          🎉 Payment received. You can now go to <a className="text-blue-600 underline" href="/admin">your dashboard</a>.
        </div>
      )}
    </div>
  );
}
