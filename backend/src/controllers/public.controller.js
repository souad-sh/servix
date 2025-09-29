// src/controllers/public.controller.js
import { pool } from "../db/pool.js";

/**
 * GET /public/plans
 * Read pricing plans from DB to show on the marketing page.
 * We return just what's needed by the frontend.
 */
export async function listPlans(_req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT
         code,
         name,
         monthly_price_cents,
         yearly_price_cents,
         vehicle_limit,
         user_limit,
         features_json
       FROM plans
       WHERE code IN ('starter','pro','enterprise')
       ORDER BY FIELD(code,'starter','pro','enterprise')`
    );

    return res.json({ ok: true, plans: rows });
  } catch (err) {
    console.error("listPlans error:", err);
    return res.status(500).json({ ok: false, message: "Failed to load plans" });
  }
}
