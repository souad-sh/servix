import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { confirmBilling } from "../controllers/billing.controller.js";

const r = Router();
r.get("/confirm", auth, confirmBilling);   // GET /billing/confirm?session_id=...
export default r;
