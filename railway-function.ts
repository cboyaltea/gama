// groupegama.ca — sert le site statique généré (dist/) depuis GitHub cboyaltea/gama (branche main), avec cache.
// Routes : URL propres (/livraison-grand-montreal → dist/livraison-grand-montreal.html), redirections 301 des anciennes variantes,
// POST /api/demande → webhook Make (formulaire de soumission).
import nodemailer from "nodemailer@6";
const RAW = Bun.env.GITHUB_RAW || "https://raw.githubusercontent.com/cboyaltea/gama/main/dist/";
const TTL = (parseInt(Bun.env.CACHE_MINUTES || "5", 10)) * 60 * 1000;
const WEBHOOK = Bun.env.FORM_WEBHOOK === undefined ? "https://hook.us1.make.com/zmffcg235snr2vmpwbsmb34f8yxkjihm" : Bun.env.FORM_WEBHOOK; // vide = Make désactivé
const CANON = "https://groupegama.ca";
// Courriel direct (Gmail / Google Workspace, mot de passe d'application) ; Make reste appelé en parallèle si FORM_WEBHOOK est défini.
const GMAIL_USER = Bun.env.GMAIL_USER || "";
const GMAIL_PASS = Bun.env.GMAIL_APP_PASSWORD || "";
const FORM_TO = (Bun.env.FORM_TO || "cboy@altea.ca,bruno.gandolfo@hotmail.com").split(",").map((x) => x.trim()).filter(Boolean);
const FORM_ACK = (Bun.env.FORM_ACK || "1") !== "0"; // accusé de réception au client
const RESEND_KEY = Bun.env.RESEND_API_KEY || "";
const FROM_ADDR = Bun.env.FORM_FROM || (GMAIL_USER || "demandes@groupegama.ca");
const mailer = GMAIL_USER && GMAIL_PASS ? nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: GMAIL_USER, pass: GMAIL_PASS }, connectionTimeout: 15000, greetingTimeout: 10000, socketTimeout: 20000 }) : null;
const escH = (v: string) => v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
function mailHtml(p: Record<string, string>) {
  const row = (k: string, v: string) => v ? `<tr><td style="padding:6px 12px 6px 0;color:#4B5A50;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0;font-weight:600">${escH(v).replace(/\n/g, "<br>")}</td></tr>` : "";
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0F1A14;max-width:640px"><h2 style="margin:0 0 4px;color:#06361B">Nouvelle demande — ${escH(p.Service)}</h2><p style="margin:0 0 16px;color:#4B5A50">Reçue le ${escH(p.Date)} via groupegama.ca</p><table style="border-collapse:collapse">${row("Nom", p.Name)}${row("Courriel", p.Email)}${row("Téléphone", p.Phone)}${row("Récupération / adresse du service", p.from)}${row("Livraison", p.to)}</table><h3 style="margin:18px 0 6px;color:#06361B">Détails</h3><div style="white-space:pre-wrap;background:#F6F8F6;border-radius:10px;padding:14px">${escH(p.Demande)}</div><p style="margin:18px 0 0;color:#4B5A50;font-size:13px">Répondre à ce courriel écrit directement au client (${escH(p.Email)}).</p></div>`;
}
// Envoi : Resend (API HTTP) si RESEND_API_KEY, sinon Gmail SMTP, sinon rien.
async function sendMail(m: { to: string[]; subject: string; text: string; html: string; replyTo?: string; fromName: string }) {
  if (RESEND_KEY) {
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: "Bearer " + RESEND_KEY, "content-type": "application/json" }, body: JSON.stringify({ from: `${m.fromName} <${FROM_ADDR}>`, to: m.to, reply_to: m.replyTo, subject: m.subject, text: m.text, html: m.html }) });
    if (!r.ok) throw new Error("resend " + r.status + " " + (await r.text()).slice(0, 200));
    return;
  }
  if (mailer) { await mailer.sendMail({ from: `"${m.fromName}" <${FROM_ADDR}>`, to: m.to, replyTo: m.replyTo, subject: m.subject, text: m.text, html: m.html }); return; }
  throw new Error("aucun expéditeur configuré (RESEND_API_KEY ou GMAIL_USER/GMAIL_APP_PASSWORD)");
}
const canMail = () => Boolean(RESEND_KEY || mailer);
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
      const payload = { Date: new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" }), Name: s(d.Name, 120), Email: s(d.Email, 200), Phone: s(d.Phone, 40), Service: s(d.Service, 60), from: s(d.from, 300), to: s(d.to, 300), Demande: s(d.Demande, 4000) };
      if (!payload.Name || !payload.Email || !payload.Phone || !payload.Service || !payload.Demande) return Response.json({ ok: false, error: "champs" }, { status: 400 });
      const page = d.page ? s(d.page, 100) : "";
      const results = await Promise.allSettled([
        sendMail({ fromName: "Groupe Gama — site web", to: FORM_TO, replyTo: payload.Email, subject: `Nouvelle demande — ${payload.Service} — ${payload.Name}`, text: `Service : ${payload.Service}\nNom : ${payload.Name}\nCourriel : ${payload.Email}\nTéléphone : ${payload.Phone}\nRécupération : ${payload.from}\nLivraison : ${payload.to}\nDate : ${payload.Date}\n\n${payload.Demande}`, html: mailHtml(payload) }),
        WEBHOOK ? fetch(WEBHOOK, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, Demande: payload.Demande + (page ? "\n\n(Envoyé depuis " + CANON + page + ")" : "") }) }).then((r) => { if (!r.ok) throw new Error("hook " + r.status); }) : Promise.reject(new Error("webhook désactivé")),
      ]);
      const ok = results.some((r) => r.status === "fulfilled");
      results.forEach((r, i) => { if (r.status === "rejected") console.error("[form] " + (i ? "make" : "courriel") + " : " + (r.reason && r.reason.message)); });
      if (ok && canMail() && FORM_ACK && results[0].status === "fulfilled") {
        sendMail({ fromName: "Groupe Gama", to: [payload.Email], subject: "Nous avons bien reçu votre demande — Groupe Gama", text: `Bonjour ${payload.Name},\n\nMerci pour votre demande (${payload.Service}). Nous vous répondons rapidement avec un prix et une date.\n\nPour une urgence : 514-424-7936.\n\nGroupe Gama\nhttps://groupegama.ca`, html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0F1A14;max-width:560px"><p>Bonjour ${escH(payload.Name)},</p><p>Merci pour votre demande (<b>${escH(payload.Service)}</b>). Nous vous répondons rapidement avec un prix et une date.</p><p>Pour une urgence : <a href="tel:+15144247936">514-424-7936</a>.</p><p style="color:#4B5A50">Groupe Gama · <a href="https://groupegama.ca">groupegama.ca</a></p></div>` }).catch((e: any) => console.error("[form] accusé : " + e.message));
      }
      return ok ? Response.json({ ok: true }) : Response.json({ ok: false, error: "envoi" }, { status: 502 });
    }

    // Canonique : www → apex, barre finale retirée, minuscules
    if (url.hostname.startsWith("www.")) return Response.redirect(CANON + p + url.search, 301);
    if (p.length > 1 && p.endsWith("/")) return Response.redirect(CANON + p.replace(/\/+$/, "") + url.search, 301);
    if (p !== p.toLowerCase()) return Response.redirect((url.hostname === "localhost" ? url.origin : CANON) + p.toLowerCase() + url.search, 301);
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
