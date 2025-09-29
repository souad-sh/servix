//import Stripe from "stripe";
import { pool } from "../db/pool.js";

//const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function confirmBilling(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ ok: false, message: "Missing session_id" });

  const orgId = req.user?.orgId;
  if (!orgId) return res.status(401).json({ ok: false, message: "Unauthorized" });

  try {
    // 1) get checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session || session.mode !== "subscription") {
      return res.status(400).json({ ok: false, message: "Invalid session" });
    }

    // 2) get subscription from Stripe
    const subId = typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;
    if (!subId) return res.status(400).json({ ok: false, message: "No subscription found on session" });

    const sub = await stripe.subscriptions.retrieve(subId);
    const periodEndSec = sub.current_period_end ?? null;   // seconds
    const trialEndSec  = sub.trial_end ?? null;            // seconds or null

    // 3) update the latest pending row
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        `UPDATE subscriptions
           SET status='active',
               provider='stripe',
               provider_sub_id=?,
               current_period_end = IFNULL(FROM_UNIXTIME(?), current_period_end),
               trial_end          = IFNULL(FROM_UNIXTIME(?), trial_end)
         WHERE org_id=? AND status='pending_payment'
         ORDER BY id DESC
         LIMIT 1`,
        [subId, periodEndSec, trialEndSec, orgId]
      );

      // Optional: log if nothing was updated (helps debugging)
      if (result.affectedRows === 0) {
        console.warn("confirmBilling: no pending row to update for org", orgId);
      }
    } finally {
      conn.release();
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("confirmBilling error:", err);
    return res.status(500).json({ ok: false, message: "Failed to confirm billing" });
  }
}
