export function notFound(_req, res) {
  res.status(404).json({ ok:false, message:"Not found" });
}
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(err.status || 500).json({ ok:false, message: err.message || "Server error" });
}
