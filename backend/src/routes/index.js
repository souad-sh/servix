// src/routes/index.js
// central place to gather and mount all routes
// so we can import just this file in server.js

import { Router } from "express";
import authRoutes from "./auth.routes.js";
import billingRoutes from "./billing.routes.js";
import publicRoutes from "./public.routes.js";
import { payments } from "./payment.routes.js";
const router = Router();

// quick health check (no auth)
router.get("/health", (_req, res) => res.json({ ok: true }));

// mount all auth endpoints under /auth/...
router.use("/auth", authRoutes);

// mount all billing endpoints under /billing/...
router.use("/billing", billingRoutes);

router.use("/public", publicRoutes);

router.use("/payments", payments); 
export default router;
