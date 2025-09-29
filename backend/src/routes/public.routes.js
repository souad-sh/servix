// src/routes/public.routes.js
import { Router } from "express";
import { listPlans } from "../controllers/public.controller.js";

const r = Router();

// Marketing-site endpoints (no auth)
r.get("/plans", listPlans);

export default r;
