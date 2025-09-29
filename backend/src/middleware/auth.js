// src/middleware/auth.js
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  try {
    const COOKIE_NAME = (process.env.COOKIE_NAME || "servix_token").trim();

    // Prefer cookie (our signup sets it), fall back to Authorization header for tools/testing
    const token =
      req.cookies?.[COOKIE_NAME] ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (!token) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Keep payload minimal
    req.user = { id: payload.id, orgId: payload.orgId, role: payload.role };

    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
}
