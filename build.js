// Génère dist/ (HTML statique, sitemap.xml, robots.txt) à partir de src/site.js.
'use strict';
const fs = require('fs');
const path = require('path');
const S = require('./src/site.js');

const DIST = path.join(__dirname, 'dist');
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const abs = (p) => S.SITE + (p === '/' ? '/' : '/' + p);
const img = (name) => '/img/' + name + '.webp';
const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
const CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICONS = {
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  boxes: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>',
  tag: '<path d="M20 12 12 20 3 11V3h8l9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  map: '<path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/>',
  truck: '<path d="M1 7h13v10H1zM14 10h5l3 3v4h-8z"/><circle cx="5" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.9 2z"/>',
};
const icon = (k, size = 26) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[k] + '</svg>';
const LOGO = '<svg class="mark" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#13A34A"/><path d="M27.5 14.2A9.5 9.5 0 1 0 29.5 21H20" fill="none" stroke="#06361B" stroke-width="4.2" stroke-linecap="round"/></svg>';

function faqHtml(items) {
  return '<div class="faq">' + items.map(([q, a], i) => '<details' + (i === 0 ? ' open' : '') + '><summary>' + esc(q) + '</summary><p>' + esc(a) + '</p></details>').join('') + '</div>';
}
function faqLd(items) {
  return { '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
}
function crumbsLd(list) {
  return { '@type': 'BreadcrumbList', itemListElement: list.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })) };
}
const ORG_ID = S.SITE + '/#organisation';
const ORG = {
  '@type': ['MovingCompany', 'LocalBusiness'], '@id': ORG_ID, name: S.BRAND, url: S.SITE + '/', telephone: S.PHONE_TEL, image: S.SITE + img('hero-montreal'), logo: S.SITE + '/logo.svg', priceRange: '$$',
  description: 'Livraison urgente 24/7, livraison dès le lendemain, déménagement la fin de semaine, manutention et déchargement de conteneurs, livraison en marque blanche et distribution publicitaire à Montréal, Laval, Rive-Nord et Rive-Sud.',
  areaServed: [{ '@type': 'City', name: 'Montréal' }, { '@type': 'City', name: 'Laval' }, { '@type': 'City', name: 'Longueuil' }, { '@type': 'City', name: 'Brossard' }, { '@type': 'City', name: 'Terrebonne' }, { '@type': 'AdministrativeArea', name: 'Québec' }],
  address: { '@type': 'PostalAddress', addressLocality: 'Montréal', addressRegion: 'QC', addressCountry: 'CA' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' }],
  knowsLanguage: ['fr-CA', 'en-CA'],
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: Object.entries(S.SERVICES).map(([slug, s]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.h1, url: abs(slug) } })) },
};

function nav(active) {
  const svc = Object.entries(S.SERVICES).map(([slug, s]) => '<a href="/' + slug + '"' + (active === slug ? ' aria-current="page"' : '') + '>' + esc(s.nav) + '</a>').join('');
  const zones = Object.entries(S.ZONES).map(([slug, z]) => '<a href="/' + slug + '"' + (active === slug ? ' aria-current="page"' : '') + '>' + esc(z.nav) + '</a>').join('');
  return `<header id="hdr"><div class="wrap bar">
  <a class="logo" href="/" aria-label="${S.BRAND} — accueil">${LOGO}<span>GROUPE <b>GAMA</b></span></a>
  <nav aria-label="Navigation principale">
    <div class="dd"><button type="button" aria-expanded="false" aria-controls="m-services">Nos services</button><div class="menu" id="m-services">${svc}</div></div>
    <div class="dd"><button type="button" aria-expanded="false" aria-controls="m-zones">Zones desservies</button><div class="menu" id="m-zones">${zones}</div></div>
    <a href="/#faq">FAQ</a>
  </nav>
  <a class="tel" href="tel:${S.PHONE_TEL}">${icon('phone', 18)}<span>${S.PHONE}</span></a>
  <a class="btn btn-primary cta-top" href="/demande-de-soumission">Demande rapide</a>
  <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span><span></span></button>
</div>
<div class="mnav" id="mnav">
  <strong>Nos services</strong>${svc}<strong>Zones desservies</strong>${zones}<a href="/#faq">FAQ</a><a class="btn btn-primary" href="/demande-de-soumission">Demande rapide</a>
</div></header>`;
}

function footer() {
  const svc = Object.entries(S.SERVICES).map(([slug, s]) => '<a href="/' + slug + '">' + esc(s.nav) + '</a>').join('');
  const zones = Object.entries(S.ZONES).map(([slug, z]) => '<a href="/' + slug + '">Livraison ' + esc(z.nav) + '</a>').join('');
  return `<footer><div class="wrap">
  <div class="foot">
    <div><a class="logo" href="/">${LOGO}<span>GROUPE <b>GAMA</b></span></a><p>Livraison, distribution, déménagement et manutention partout au Québec depuis plus de 25 ans. Disponible 24 h/24, 7 j/7.</p><a class="tel big" href="tel:${S.PHONE_TEL}">${S.PHONE}</a></div>
    <div><h4>Services</h4>${svc}</div>
    <div><h4>Zones</h4>${zones}<a href="/demande-de-soumission">Demande de soumission</a></div>
  </div>
  <div class="legal"><span>© ${new Date().getFullYear()} ${S.BRAND}. Tous droits réservés.</span><span>Site réalisé par <a href="https://altea.ca" rel="noopener">Altea.ca</a></span></div>
</div></footer>`;
}

function page({ slug, title, meta, h1, body, ld, ogImage, crumbs }) {
  const url = abs(slug);
  const jsonld = { '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'WebSite', '@id': S.SITE + '/#site', url: S.SITE + '/', name: S.BRAND, inLanguage: 'fr-CA', publisher: { '@id': ORG_ID } }, { '@type': 'WebPage', '@id': url, url, name: title, description: meta, inLanguage: 'fr-CA', isPartOf: { '@id': S.SITE + '/#site' }, about: { '@id': ORG_ID }, dateModified: S.UPDATED }, crumbsLd(crumbs), ...ld] };
  return `<!doctype html>
<html lang="fr-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${S.BRAND}">
<meta property="og:locale" content="fr_CA">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(meta)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${S.SITE}${img(ogImage || 'hero-montreal')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#06361B">
<meta name="geo.region" content="CA-QC">
<meta name="geo.placename" content="Montréal">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/site.css?v=__CSSV__">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
<script defer src="${S.UMAMI.src}" data-website-id="${S.UMAMI.id}" data-domains="${S.UMAMI.domains}"></script>
<meta name="google-site-verification" content="HpQO-BE_d136olBIxfkDkmlk8u6g29d2WSEUstPia_M">
<script>window.seoPixelConfig={siteId:'site_mibyif16_8muag7',apiEndpoint:'https://alteaseo-production.up.railway.app',debug:false};</script>
<script src="https://alteaseo-production.up.railway.app/seo-pixel.js" async></script>
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
${nav(slug)}
<main id="main">
${body}
</main>
${footer()}
<script src="/site.js?v=__CSSV__" defer></script>
</body>
</html>`;
}

const ctaBand = (title, lead) => `<section class="cta"><div class="wrap"><h2>${esc(title)}</h2><p>${esc(lead)}</p><div class="actions"><a class="btn btn-white" href="/demande-de-soumission">Demande de soumission gratuite ${ARROW}</a><a class="btn btn-ghost" href="tel:${S.PHONE_TEL}">${icon('phone', 18)} ${S.PHONE}</a></div></div></section>`;
const serviceCard = (slug, s) => { s = s || S.SERVICES[slug] || S.ZONES[slug]; return `<a class="card" href="/${slug}"><div class="ic">${icon(s.icon || 'truck')}</div><h3>${esc(s.h1)}</h3><p>${esc(s.lead)}</p><span class="more">En savoir plus ${ARROW}</span></a>`; };
const testimonial = () => `<figure class="quote"><blockquote>« ${esc(S.HOME.testimonial.quote)} »</blockquote><figcaption><b>${esc(S.HOME.testimonial.author)}</b> — ${esc(S.HOME.testimonial.org)}</figcaption></figure>`;

// ——— Accueil
function home() {
  const H = S.HOME;
  const body = `
<section class="hero">
  <img class="hero-bg" src="${img('hero-montreal')}" alt="" width="1200" height="900" fetchpriority="high">
  <div class="wrap">
    <span class="kicker">${esc(H.kicker)}</span>
    <h1>${esc(H.h1)}</h1>
    <p class="lead">${esc(H.lead)}</p>
    <div class="actions"><a class="btn btn-primary" href="/demande-de-soumission">Demande rapide ${ARROW}</a><a class="btn btn-light" href="tel:${S.PHONE_TEL}">${icon('phone', 18)} ${S.PHONE}</a></div>
    <ul class="stats">${H.stats.map(([v, l]) => '<li><b>' + esc(v) + '</b><span>' + esc(l) + '</span></li>').join('')}</ul>
  </div>
</section>
<section class="sec" id="services">
  <div class="wrap">
    <div class="sec-head"><span class="kicker">Solutions de transport sur mesure</span><h2>Faites le choix de l’excellence sur mesure</h2><p>Livraison, déménagement, manutention, distribution : six services, une seule équipe, un seul numéro.</p></div>
    <div class="grid3">${Object.entries(S.SERVICES).map(([k, s]) => serviceCard(k, s)).join('')}</div>
  </div>
</section>
<section class="sec alt" id="zones">
  <div class="wrap split">
    <div>
      <span class="kicker">Zones desservies</span>
      <h2>Partout dans le Grand Montréal, et au Québec</h2>
      <p>Île de Montréal, Laval, Rive-Nord, Rive-Sud et secteurs industriels au quotidien ; le reste du Québec en planifié ou dès le lendemain.</p>
      <div class="chips">${Object.entries(S.ZONES).map(([k, z]) => '<a href="/' + k + '">' + esc(z.h1) + ' ' + ARROW + '</a>').join('')}</div>
    </div>
    <img src="${img('entrepot-aerien')}" alt="Vue aérienne d’un entrepôt et de ses quais, secteur industriel du Grand Montréal" width="1600" height="1067" loading="lazy">
  </div>
</section>
<section class="sec" id="why">
  <div class="wrap">
    <div class="sec-head"><span class="kicker">${esc(H.whyTitle)}</span><h2>Une logistique performante, 24 h/24 et 7 j/7</h2><p>${esc(H.whyLead)}</p></div>
    <div class="grid4">${H.why.map(([t, d]) => '<div class="why"><span class="n">' + CHECK + '</span><h3>' + esc(t) + '</h3><p>' + esc(d) + '</p></div>').join('')}</div>
    ${testimonial()}
  </div>
</section>
<section class="sec alt" id="faq">
  <div class="wrap narrow"><div class="sec-head"><span class="kicker">FAQ</span><h2>Questions fréquentes</h2></div>${faqHtml(H.faq)}</div>
</section>
${ctaBand('Que pouvons-nous faire pour vous ?', 'Soumission gratuite, réponse rapide, 7 jours sur 7.')}`;
  return page({ slug: '/', title: H.title, meta: H.meta, h1: H.h1, body, ld: [faqLd(H.faq)], crumbs: [['Accueil', S.SITE + '/']] });
}

// ——— Pages services
function servicePage(slug, s) {
  const ld = [
    { '@type': 'Service', '@id': abs(slug) + '#service', name: s.h1, serviceType: s.service, description: s.meta, provider: { '@id': ORG_ID }, areaServed: ORG.areaServed, url: abs(slug), image: S.SITE + img(s.image) },
    faqLd(s.faq),
    { '@type': 'HowTo', name: 'Comment réserver : ' + s.h1, step: s.how.map(([n, t], i) => ({ '@type': 'HowToStep', position: i + 1, name: n, text: t })) },
  ];
  const body = `
<section class="phero">
  <div class="wrap split">
    <div>
      <nav class="crumbs" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span>›</span><a href="/#services">Services</a><span>›</span><span aria-current="page">${esc(s.nav)}</span></nav>
      <span class="kicker">${icon(s.icon, 18)} ${esc(s.service)}</span>
      <h1>${esc(s.h1)}</h1>
      <p class="lead">${esc(s.lead)}</p>
      <div class="actions"><a class="btn btn-primary" href="/demande-de-soumission?service=${encodeURIComponent(s.service === 'Livraison urgente' ? 'Livraison Rapide' : s.service === 'Distribution' ? 'Livraison' : s.service)}">Demande rapide ${ARROW}</a><a class="btn btn-light" href="tel:${S.PHONE_TEL}">${icon('phone', 18)} ${S.PHONE}</a></div>
    </div>
    <img src="${img(s.image)}" alt="${esc(s.imageAlt)}" width="1200" height="900" fetchpriority="high">
  </div>
</section>
<section class="sec">
  <div class="wrap split2">
    <article class="prose"><h2>Le service en détail</h2><p>${esc(s.intro)}</p>
      <h3>Ce qui est compris</h3><ul class="checks">${s.points.map((p) => '<li>' + CHECK + '<span>' + esc(p) + '</span></li>').join('')}</ul>
    </article>
    <aside class="steps"><h2>Comment ça se passe</h2><ol>${s.how.map(([n, t]) => '<li><b>' + esc(n) + '</b><p>' + esc(t) + '</p></li>').join('')}</ol></aside>
  </div>
</section>
<section class="sec alt">
  <div class="wrap narrow"><div class="sec-head"><span class="kicker">FAQ</span><h2>Questions fréquentes sur ${esc(s.h1.toLowerCase().startsWith('service') ? 'le ' + s.h1.toLowerCase() : 'la ' + s.h1.toLowerCase())}</h2></div>${faqHtml(s.faq)}${s.testimonial ? testimonial() : ''}</div>
</section>
<section class="sec">
  <div class="wrap"><h2 class="h-sm">Autres services Groupe Gama</h2><div class="grid3">${s.related.map((k) => serviceCard(k)).join('')}</div>
  <p class="zone-links">Zones desservies : ${Object.entries(S.ZONES).map(([k, z]) => '<a href="/' + k + '">' + esc(z.h1) + '</a>').join(' · ')}</p></div>
</section>
${ctaBand('Besoin de ce service ?', 'Obtenez un prix et une date aujourd’hui — sans engagement.')}`;
  return page({ slug, title: s.title, meta: s.meta, h1: s.h1, body, ld, ogImage: s.image, crumbs: [['Accueil', S.SITE + '/'], ['Services', S.SITE + '/#services'], [s.h1, abs(slug)]] });
}

// ——— Pages zones (URL existantes)
function zonePage(slug, z) {
  const ld = [
    { '@type': 'Service', '@id': abs(slug) + '#service', name: z.h1, serviceType: 'Livraison', description: z.meta, provider: { '@id': ORG_ID }, url: abs(slug), image: S.SITE + img(z.image), areaServed: z.cities.map((c) => ({ '@type': 'City', name: c.replace(/ \(.*\)/, '') })) },
    faqLd(z.faq),
  ];
  const body = `
<section class="phero">
  <div class="wrap split">
    <div>
      <nav class="crumbs" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span>›</span><a href="/#zones">Zones desservies</a><span>›</span><span aria-current="page">${esc(z.nav)}</span></nav>
      <span class="kicker">${icon('truck', 18)} Livraison ${esc(z.nav)}</span>
      <h1>${esc(z.h1)}</h1>
      <p class="lead">${esc(z.lead)}</p>
      <div class="actions"><a class="btn btn-primary" href="/demande-de-soumission?service=Livraison">Réserver une livraison ${ARROW}</a><a class="btn btn-light" href="tel:${S.PHONE_TEL}">${icon('phone', 18)} ${S.PHONE}</a></div>
    </div>
    <img src="${img(z.image)}" alt="${esc(z.imageAlt)}" width="1200" height="900" fetchpriority="high">
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><span class="kicker">Trois façons de livrer</span><h2>Livraison express, planifiée ou sur palette ${esc(z.area)}</h2></div>
    <div class="grid3">${S.ZONE_SERVICES.map(([t, d, k]) => '<a class="card" href="/' + k + '"><div class="ic">' + icon(S.SERVICES[k].icon) + '</div><h3>' + esc(t) + '</h3><p>' + esc(d) + '</p><span class="more">Détails du service ' + ARROW + '</span></a>').join('')}</div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap split2">
    <article class="prose"><h2>Zones desservies ${esc(z.area)}</h2><p>${esc(z.zoneText)}</p>
      <h3>Villes et secteurs</h3><ul class="cities">${z.cities.map((c) => '<li>' + esc(c) + '</li>').join('')}</ul></article>
    <aside class="steps"><h2>Nos autres services ${esc(z.area)}</h2><ol>${['demenagement-montreal', 'manutention-dechargement-conteneurs', 'livraison-marque-blanche', 'distribution-publicitaire-montreal'].map((k) => '<li><b><a href="/' + k + '">' + esc(S.SERVICES[k].h1) + '</a></b><p>' + esc(S.SERVICES[k].lead) + '</p></li>').join('')}</ol></aside>
  </div>
</section>
<section class="sec">
  <div class="wrap narrow"><div class="sec-head"><span class="kicker">FAQ</span><h2>Questions fréquentes — ${esc(z.h1.toLowerCase())}</h2></div>${faqHtml(z.faq)}${testimonial()}
  <p class="zone-links">Autres zones : ${z.related.map((k) => '<a href="/' + k + '">' + esc(S.ZONES[k].h1) + '</a>').join(' · ')}</p></div>
</section>
${ctaBand('Besoin d’une livraison ?', 'Obtenez un devis gratuit ou réservez votre service dès aujourd’hui.')}`;
  return page({ slug, title: z.title, meta: z.meta, h1: z.h1, body, ld, ogImage: z.image, crumbs: [['Accueil', S.SITE + '/'], ['Zones desservies', S.SITE + '/#zones'], [z.h1, abs(slug)]] });
}

// ——— Formulaire
function formPage() {
  const F = S.FORM;
  const body = `
<section class="phero form-hero">
  <div class="wrap narrow">
    <nav class="crumbs" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span>›</span><span aria-current="page">Demande de soumission</span></nav>
    <span class="kicker">Devis gratuit</span>
    <h1>${esc(F.h1)}</h1>
    <p class="lead">${esc(F.lead)}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap narrow">
    <form id="quote" class="quote-form" method="post" action="/api/demande" novalidate>
      <input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <div class="row2">
        <label>Nom et prénom<input type="text" name="Name" required autocomplete="name"></label>
        <label>Courriel<input type="email" name="Email" required autocomplete="email"></label>
      </div>
      <div class="row2">
        <label>Téléphone<input type="tel" name="Phone" required autocomplete="tel"></label>
        <label>Service<select name="Service" required><option value="">Choisissez…</option>${F.services.map((s) => '<option>' + esc(s) + '</option>').join('')}</select><small>Choisissez bien le service approprié : il détermine l’équipe qui vous répond.</small></label>
      </div>
      <div class="row2" data-when="livraison">
        <label>Adresse de récupération<input type="text" name="from" autocomplete="off" placeholder="Rue, ville"></label>
        <label>Adresse de livraison<input type="text" name="to" autocomplete="off" placeholder="Rue, ville"></label>
      </div>
      <div class="row2" data-when="manutention" hidden>
        <label>Adresse du service<input type="text" name="from_m" autocomplete="off" placeholder="Rue, ville"></label>
        <label>Date et heure souhaitées<input type="text" name="Date" placeholder="Ex. : samedi 8 novembre, 8 h"></label>
      </div>
      <label>Détails de la demande<textarea name="Demande" rows="7" required></textarea>
        <small data-when="livraison">Donnez-nous le plus de détails possible : dimensions, nombre de boîtes et poids (cm ou pouces, lb ou kg) ; pour un déménagement, nombre de pièces (ex. : maison avec 2 chambres et un bureau), service d’emballage oui ou non, nombre d’étages aux deux adresses.</small>
        <small data-when="manutention" hidden>Décrivez les produits (taille, poids), le temps approximatif et le nombre de personnes souhaité.</small>
      </label>
      <p class="consent">En envoyant ce formulaire, vous acceptez d’être contacté par Groupe Gama au sujet de votre demande. Aucune infolettre, aucune revente de données.</p>
      <button class="btn btn-primary big" type="submit">Envoyer ma demande ${ARROW}</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
    <div class="alt-contact"><h2>Vous préférez parler à quelqu’un ?</h2><p>Appelez-nous, 7 jours sur 7 : <a class="tel big" href="tel:${S.PHONE_TEL}">${S.PHONE}</a></p></div>
  </div>
</section>`;
  return page({ slug: 'demande-de-soumission', title: F.title + ' gratuite | ' + S.BRAND, meta: F.meta, h1: F.h1, body, ld: [{ '@type': 'ContactPage', '@id': abs('demande-de-soumission') + '#contact', url: abs('demande-de-soumission'), name: F.title }], crumbs: [['Accueil', S.SITE + '/'], ['Demande de soumission', abs('demande-de-soumission')]] });
}

// ——— Écriture
const pages = { 'index.html': home(), 'demande-de-soumission.html': formPage() };
for (const [k, s] of Object.entries(S.SERVICES)) pages[k + '.html'] = servicePage(k, s);
for (const [k, z] of Object.entries(S.ZONES)) pages[k + '.html'] = zonePage(k, z);
for (const [f, html] of Object.entries(pages)) fs.writeFileSync(path.join(DIST, f), html);

const urls = ['/', ...Object.keys(S.ZONES), ...Object.keys(S.SERVICES), 'demande-de-soumission'];
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map((u) => '  <url><loc>' + abs(u) + '</loc><lastmod>' + S.UPDATED + '</lastmod><changefreq>' + (u === '/' ? 'weekly' : 'monthly') + '</changefreq><priority>' + (u === '/' ? '1.0' : u in S.ZONES ? '0.9' : '0.8') + '</priority></url>').join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ' + S.SITE + '/sitemap.xml\n');
for (const f of ['site.css', 'site.js', 'favicon.svg', 'logo.svg']) fs.copyFileSync(path.join(__dirname, 'public', f), path.join(DIST, f));
fs.mkdirSync(path.join(DIST, 'img'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'public/img'))) fs.copyFileSync(path.join(__dirname, 'public/img', f), path.join(DIST, 'img', f));
fs.writeFileSync(path.join(DIST, 'routes.json'), JSON.stringify({ pages: Object.keys(pages), updated: S.UPDATED }));
console.log(Object.keys(pages).length + ' pages générées dans dist/');
