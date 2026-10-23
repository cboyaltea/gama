// groupegama.ca — sert le site statique généré (dist/) depuis GitHub cboyaltea/gama (branche main), avec cache.
// Routes : URL propres (/livraison-grand-montreal → dist/livraison-grand-montreal.html), redirections 301 des anciennes variantes,
// POST /api/demande → webhook Make (formulaire de soumission).
const RAW = Bun.env.GITHUB_RAW || "https://raw.githubusercontent.com/cboyaltea/gama/main/dist/";
const TTL = (parseInt(Bun.env.CACHE_MINUTES || "5", 10)) * 60 * 1000;
const WEBHOOK = Bun.env.FORM_WEBHOOK || "https://hook.us1.make.com/zmffcg235snr2vmpwbsmb34f8yxkjihm";
const CANON = "https://groupegama.ca";
const TYPES: Record<string, string> = { html: "text/html; charset=utf-8", css: "text/css; charset=utf-8", js: "text/javascript; charset=utf-8", svg: "image/svg+xml", webp: "image/webp", png: "image/png", jpg: "image/jpeg", txt: "text/plain; charset=utf-8", xml: "application/xml; charset=utf-8", json: "application/json; charset=utf-8" };
const SEC: Record<string, string> = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://stats.zodacanu.com https://umami-production-2064.up.railway.app https://alteaseo-production.up.railway.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://stats.zodacanu.com https://umami-production-2064.up.railway.app https://alteaseo-production.up.railway.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};
// Anciennes URL / variantes → URL canoniques (301)
const REDIRECTS: Record<string, string> = {
  "/index.html": "/", "/index": "/", "/accueil": "/", "/home": "/",
  "/services": "/#services", "/nos-services": "/#services", "/prix": "/demande-de-soumission", "/contact": "/demande-de-soumission", "/devis": "/demande-de-soumission", "/soumission": "/demande-de-soumission", "/demande-rapide": "/demande-de-soumission",
  "/livraison-montreal": "/livraison-grand-montreal", "/livraison-rive-nord": "/livraison-rive-nord-montreal", "/livraison-rive-sud": "/livraison-rive-sud-montreal", "/livraison-laval": "/livraison-rive-nord-montreal", "/livraison-longueuil": "/livraison-rive-sud-montreal",
  "/demenagement": "/demenagement-montreal", "/manutention": "/manutention-dechargement-conteneurs", "/marque-blanche": "/livraison-marque-blanche", "/distribution": "/distribution-publicitaire-montreal", "/livraison-urgente": "/livraison-urgente-montreal",
};

const cache = new Map<string, { body: Uint8Array | null; at: number }>();
async function load(name: string): Promise<Uint8Array | null> {
  const c = cache.get(name);
  if (c && Date.now() - c.at < TTL) return c.body;
  try {
    const res = await fetch(RAW + name, { headers: { "user-agent": "groupegama-web" } });
    if (res.status === 404) { cache.set(name, { body: null, at: Date.now() }); return null; }
    if (!res.ok) throw new Error("HTTP " + res.status);
    const body = new Uint8Array(await res.arrayBuffer());
    cache.set(name, { body, at: Date.now() });
    return body;
  } catch (e) { return c ? c.body : null; }
}
let routes: string[] = [];
async function loadRoutes() { const b = await load("routes.json"); try { routes = b ? JSON.parse(new TextDecoder().decode(b)).pages : routes; } catch (e) {} return routes; }
let cssV = "", cssAt = 0;
async function cssVersion() { if (Date.now() - cssAt > 60 * 1000) { const c = await load("site.css"); cssV = c ? Bun.hash(c).toString(36) : "0"; cssAt = Date.now(); } return cssV; }
await loadRoutes();
await Promise.all(["index.html", "site.css", "site.js"].map(load));

const text = (body: string, status: number, type: string, extra: Record<string, string> = {}) => new Response(body, { status, headers: { ...SEC, "content-type": type, ...extra } });
const notFound = async () => {
  const b = await load("index.html");
  const html = b ? new TextDecoder().decode(b).replace("__CSSV__", await cssVersion()) : "Page introuvable";
  return text(html, 404, TYPES.html, { "cache-control": "no-store" });
};

Bun.serve({
  port: Number(Bun.env.PORT) || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let p = url.pathname;
    if (p === "/healthz") return new Response("ok");

    // Formulaire → Make
    if (p === "/api/demande" && req.method === "POST") {
      let d: any = {};
      try { d = await req.json(); } catch (e) { return Response.json({ ok: false, error: "json" }, { status: 400 }); }
      if (d.website) return Response.json({ ok: true }); // pot de miel
      const s = (v: any, n = 2000) => String(v == null ? "" : v).trim().slice(0, n);
      const payload = { Date: new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" }), Name: s(d.Name, 120), Email: s(d.Email, 200), Phone: s(d.Phone, 40), Service: s(d.Service, 60), from: s(d.from, 300), to: s(d.to, 300), Demande: s(d.Demande, 4000) + (d.page ? "\n\n(Envoyé depuis " + CANON + s(d.page, 100) + ")" : "") };
      if (!payload.Name || !payload.Email || !payload.Phone || !payload.Service || !payload.Demande) return Response.json({ ok: false, error: "champs" }, { status: 400 });
      try {
        const r = await fetch(WEBHOOK, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
        if (!r.ok) throw new Error("hook " + r.status);
        return Response.json({ ok: true });
      } catch (e: any) { console.error("[form] " + e.message); return Response.json({ ok: false, error: "envoi" }, { status: 502 }); }
    }

    // Canonique : www → apex, barre finale retirée, minuscules
    if (url.hostname.startsWith("www.")) return Response.redirect(CANON + p + url.search, 301);
    if (p.length > 1 && p.endsWith("/")) return Response.redirect(CANON + p.replace(/\/+$/, "") + url.search, 301);
    if (p !== p.toLowerCase()) p = p.toLowerCase();
    if (REDIRECTS[p]) return Response.redirect((url.hostname === "localhost" ? url.origin : CANON) + REDIRECTS[p], 301);

    // Fichiers statiques
    if (/^\/(site\.css|site\.js|favicon\.svg|logo\.svg|robots\.txt|sitemap\.xml|img\/[a-z0-9-]+\.webp)$/.test(p)) {
      const b = await load(p.slice(1));
      if (!b) return text("Not found", 404, TYPES.txt);
      const ext = p.split(".").pop() || "";
      return new Response(b, { headers: { ...SEC, "content-type": TYPES[ext] || "application/octet-stream", "cache-control": ext === "xml" || ext === "txt" ? "public, max-age=3600" : "public, max-age=86400" } });
    }

    // Pages
    const name = p === "/" ? "index.html" : p.slice(1) + ".html";
    if (!routes.length || !routes.includes(name)) await loadRoutes();
    if (!routes.includes(name) || !/^[a-z0-9-]+\.html$/.test(name)) return notFound();
    const b = await load(name);
    if (!b) return notFound();
    const html = new TextDecoder().decode(b).replace(/__CSSV__/g, await cssVersion());
    return text(html, 200, TYPES.html, { "cache-control": "public, max-age=300" });
  },
});
console.log("groupegama.ca prêt");
