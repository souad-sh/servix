
// src/routes/auth.routes.js
import { Router } from "express";
import { signup, me } from "../controllers/auth.controller.js"; 
import { auth } from "../middleware/auth.js";
const r = Router();

// Create org + admin, then (later) redirect to Stripe
r.post("/signup", signup); // POST /auth/signup
r.get("/me", auth, me); // GET /auth/me - get current user info

export default r;
