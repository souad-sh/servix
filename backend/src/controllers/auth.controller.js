// src/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";

function slugify(text = "") {
  return String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "org";
}
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const genId = (p) => `${p}_${Math.random().toString(36).slice(2, 10)}`;

export async function signup(req, res) {
  // ... (your latest non-Stripe signup code you pasted earlier) ...
}

export async function me(req, res) {
  if (!req.user) return res.status(401).json({ ok: false, message: "Unauthorized" });
  const { id, orgId, role } = req.user;
  return res.json({ ok: true, user: { id, org_id: orgId, role } });
}
