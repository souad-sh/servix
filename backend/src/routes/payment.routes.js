// src/routes/payment.routes.js
import { Router } from "express";
import bodyParser from "body-parser";
import { pool } from "../db/pool.js";

export const payments = Router();
const raw = bodyParser.raw({ type: "*/*" });
payments.use(bodyParser.json());

// Fetch one invoice (used by /billing/pay?inv=...)
payments.get("/invoice/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, amount_cents, currency, status FROM invoices WHERE id=? LIMIT 1",
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "not found" });
  res.json(rows[0]);
});

// Create Whish session (placeholder; replace with real API later)
payments.post("/whish/create", async (req, res) => {
  const { invoiceId } = req.body || {};
  const [[inv]] = await pool.query(
    "SELECT id, amount_cents, currency FROM invoices WHERE id=? LIMIT 1",
    [invoiceId]
  );
  if (!inv) return res.status(404).json({ error: "invoice not found" });

  const sessionId = `whish_${Date.now()}`;
  await pool.query(
    `INSERT INTO payment_sessions (id, provider, session_id, invoice_id, status, amount_cents, currency)
     VALUES (?,?,?,?, 'created', ?, ?)`,
    [`psn_${Date.now()}`, "whish", sessionId, invoiceId, inv.amount_cents, inv.currency]
  );

  res.json({ provider: "whish", sessionId, paymentUrl: `whish://pay/${sessionId}` });
});

// Create APS session (placeholder; replace with real API later)
payments.post("/aps/create", async (req, res) => {
  const { invoiceId } = req.body || {};
  const [[inv]] = await pool.query(
    "SELECT id, amount_cents, currency FROM invoices WHERE id=? LIMIT 1",
    [invoiceId]
  );
  if (!inv) return res.status(404).json({ error: "invoice not found" });

  const sessionId = `aps_${Date.now()}`;
  await pool.query(
    `INSERT INTO payment_sessions (id, provider, session_id, invoice_id, status, amount_cents, currency)
     VALUES (?,?,?,?, 'created', ?, ?)`,
    [`psn_${Date.now()}`, "aps", sessionId, invoiceId, inv.amount_cents, inv.currency]
  );

  res.json({ provider: "aps", sessionId, paymentUrl: `https://pay.example-aps/${sessionId}` });
});

// Webhooks (providers -> your server). Add signature verification later.
payments.post("/webhook/whish", raw, async (req, res) => {
  const body = req.body.toString("utf8");
  const evt = safeParse(body);
  await handleWebhook("whish", evt, res);
});

payments.post("/webhook/aps", raw, async (req, res) => {
  const body = req.body.toString("utf8");
  const evt = safeParse(body);
  await handleWebhook("aps", evt, res);
});

// helpers
function safeParse(s) { try { return JSON.parse(s); } catch { return null; } }

async function handleWebhook(provider, evt, res) {
  const sessionId = evt?.id || evt?.transactionId || evt?.fort_id;
  const status = normalizeStatus(provider, evt);
  if (!sessionId) return res.send("ok");

  // idempotency
  try {
    await pool.query("INSERT INTO webhook_dedup (id) VALUES (?)", [`${provider}:${sessionId}:${status}`]);
  } catch {
    return res.send("duplicate");
  }

  await pool.query(
    "INSERT INTO payment_events (id, provider, event_id, raw) VALUES (?,?,?,?)",
    [`evt_${Date.now()}`, provider, String(sessionId), JSON.stringify(evt || {})]
  );

  const [[ps]] = await pool.query("SELECT * FROM payment_sessions WHERE session_id=? LIMIT 1", [sessionId]);
  if (!ps) return res.send("ok");

  if (status === "SUCCESS") {
    await pool.query("UPDATE payment_sessions SET status='succeeded' WHERE session_id=?", [sessionId]);
    await pool.query("UPDATE invoices SET status='paid', paid_at=NOW() WHERE id=?", [ps.invoice_id]);

    const [[inv]] = await pool.query("SELECT subscription_id FROM invoices WHERE id=? LIMIT 1", [ps.invoice_id]);
    const [[sub]] = await pool.query(
      "SELECT id, current_period_end FROM subscriptions WHERE id=? LIMIT 1",
      [inv.subscription_id]
    );

    const next = new Date(sub.current_period_end || new Date());
    next.setMonth(next.getMonth() + 1);
    await pool.query(
      "UPDATE subscriptions SET status='active', current_period_end=?, current_period_start=NOW() WHERE id=?",
      [next, sub.id]
    );
  } else if (status === "FAILED" || status === "CANCELLED") {
    await pool.query("UPDATE payment_sessions SET status=? WHERE session_id=?", [status.toLowerCase(), sessionId]);
    await pool.query("UPDATE invoices SET status='failed' WHERE id=?", [ps.invoice_id]);
  }

  res.send("ok");
}

function normalizeStatus(provider, evt) {
  // map APS/Whish event to SUCCESS/FAILED/CANCELLED
  const raw = JSON.stringify(evt || "").toUpperCase();
  if (raw.includes("SUCCESS")) return "SUCCESS";
  if (raw.includes("CANCEL")) return "CANCELLED";
  return "FAILED";
}
