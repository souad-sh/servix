export function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
}
