export const requireRole = (...allowed) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ ok:false, message:"Unauthorized" });
  if (!allowed.includes(req.user.roleCode)) {
    return res.status(403).json({ ok:false, message:"Forbidden" });
  }
  next();
};
