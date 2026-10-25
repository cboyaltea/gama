// Génère dist/ (HTML statique FR + EN, sitemap.xml, robots.txt, llms.txt) à partir de src/site.js et src/site.en.js.
// FR : /slug-francais — EN : /en/english-slug. Chaque page porte ses hreflang (fr-CA, en-CA, x-default = FR).
'use strict';
const fs = require('fs');
const path = require('path');
const S = require('./src/site.js');
const E = require('./src/site.en.js');
const { CITIES } = require('./src/cities.js');

const DIST = path.join(__dirname, 'dist');
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'en'), { recursive: true });

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
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

// ——— Données par langue. EN reprend la structure FR (images, icônes, liens) et remplace les textes.
const FR_SLUG_FORM = 'demande-de-soumission';
function langData(lang) {
  if (lang === 'fr') return { SERVICES: S.SERVICES, ZONES: S.ZONES, ZONE_SERVICES: S.ZONE_SERVICES.map(([t, d, k]) => [t, d, k]), HOME: S.HOME, FORM: { ...S.FORM, services: S.FORM.services.map((s) => [s, s]) } };
  const merge = (fr, en) => Object.fromEntries(Object.entries(fr).map(([k, v]) => [k, { ...v, ...en[k], frService: v.service }]));
  return { SERVICES: merge(S.SERVICES, E.SERVICES), ZONES: merge(S.ZONES, E.ZONES), ZONE_SERVICES: S.ZONE_SERVICES.map(([, , k], i) => [E.ZONE_SERVICES[i][0], E.ZONE_SERVICES[i][1], k]), HOME: E.HOME, FORM: E.FORM };
}
const DATA = { fr: langData('fr'), en: langData('en') };
const city = (lang, k) => ({ ...CITIES[k], ...CITIES[k][lang] });
const cityKeys = Object.keys(CITIES);
const citiesOf = (zone) => cityKeys.filter((k) => CITIES[k].zone === zone);
// Chemin d'une page : key = '/', 'form' ou slug français d'un service/zone.
function href(lang, key) {
  if (lang === 'fr') return key === '/' ? '/' : '/' + (key === 'form' ? FR_SLUG_FORM : key);
  if (key === '/') return '/en';
  if (key === 'form') return '/en/' + E.FORM.slug;
  if (CITIES[key]) return '/en/' + CITIES[key].en.slug;
  return '/en/' + (E.SERVICES[key] || E.ZONES[key]).slug;
}
const abs = (p) => S.SITE + p;
const other = (lang) => (lang === 'fr' ? 'en' : 'fr');
// Valeur du champ « Service » du formulaire (toujours en français, ce que l'équipe reçoit)
const formService = (svc) => (svc === 'Livraison urgente' ? 'Livraison Rapide' : svc === 'Distribution' ? 'Livraison' : svc);

// ——— Textes d'interface
const T = {
  fr: {
    locale: 'fr-CA', og: 'fr_CA', home: 'Accueil', homeLabel: 'accueil', services: 'Nos services', zones: 'Zones desservies', servicesShort: 'Services', zonesShort: 'Zones', faq: 'FAQ', quick: 'Demande rapide', skip: 'Aller au contenu', mainNav: 'Navigation principale', menu: 'Menu', crumbs: 'Fil d’Ariane', switchLabel: 'English', switchShort: 'EN', switchTitle: 'View this page in English',
    footAbout: 'Livraison, distribution, déménagement et manutention partout au Québec depuis plus de 25 ans. Disponible 24 h/24, 7 j/7.', rights: 'Tous droits réservés.', madeBy: 'Site réalisé par', quote: 'Demande de soumission', deliveryZone: (n) => 'Livraison ' + n,
    ctaBtn: 'Demande de soumission gratuite', more: 'En savoir plus', details: 'Détails du service',
    homeSvcKicker: 'Solutions de transport sur mesure', homeSvcH2: 'Faites le choix de l’excellence sur mesure', homeSvcP: 'Livraison, déménagement, manutention, distribution : six services, une seule équipe, un seul numéro.',
    homeZoneH2: 'Partout dans le Grand Montréal, et au Québec', homeZoneP: 'Île de Montréal, Laval, Rive-Nord, Rive-Sud et secteurs industriels au quotidien ; le reste du Québec en planifié ou dès le lendemain.', homeZoneAlt: 'Vue aérienne d’un entrepôt et de ses quais, secteur industriel du Grand Montréal',
    homeWhyH2: 'Une logistique performante, 24 h/24 et 7 j/7', faqH2: 'Questions fréquentes', homeCta: ['Que pouvons-nous faire pour vous ?', 'Soumission gratuite, réponse rapide, 7 jours sur 7.'],
    svcDetail: 'Le service en détail', svcIncluded: 'Ce qui est compris', svcHow: 'Comment ça se passe', svcFaq: (h1) => 'Questions fréquentes sur ' + (h1.toLowerCase().startsWith('service') ? 'le ' : 'la ') + h1.toLowerCase(), svcOthers: 'Autres services Groupe Gama', zonesServed: 'Zones desservies', svcCta: ['Besoin de ce service ?', 'Obtenez un prix et une date aujourd’hui — sans engagement.'], howTo: 'Comment réserver : ',
    zoneKicker: (n) => 'Livraison ' + n, zoneBook: 'Réserver une livraison', zoneThree: 'Trois façons de livrer', zoneThreeH2: (a) => 'Livraison express, planifiée ou sur palette ' + a, zoneServed: (a) => 'Zones desservies ' + a, zoneCities: 'Villes et secteurs', zoneOthers: (a) => 'Nos autres services ' + a, zoneFaq: (h1) => 'Questions fréquentes — ' + h1.toLowerCase(), zoneOtherZones: 'Autres zones', zoneCta: ['Besoin d’une livraison ?', 'Obtenez un devis gratuit ou réservez votre service dès aujourd’hui.'], zoneServiceType: 'Livraison',
    cities: 'Villes', cityKicker: (n) => 'Livraison ' + n, cityIntroH2: (n) => 'Groupe Gama à ' + n, cityWhy: 'Ce que nous faisons pour vous', cityAccess: 'Accès et délais', citySvcH2: (n) => 'Nos services à ' + n, citySvcP: 'Six services, une seule équipe et un seul numéro, du colis urgent au déménagement.', citySectors: (n) => 'Secteurs desservis à ' + n, cityFaq: (n) => 'Questions fréquentes — ' + n, cityNear: 'Villes voisines', cityZone: 'Voir toute la zone', cityCta: (n) => ['Une livraison à ' + n + ' ?', 'Prix et date confirmés aujourd’hui — soumission gratuite, sans engagement.'], cityBook: 'Demander un prix',
    formKicker: 'Devis gratuit', formTitleSuffix: ' gratuite', fName: 'Nom et prénom', fEmail: 'Courriel', fPhone: 'Téléphone', fService: 'Service', fChoose: 'Choisissez…', fServiceHelp: 'Choisissez bien le service approprié : il détermine l’équipe qui vous répond.', fFrom: 'Adresse de récupération', fTo: 'Adresse de livraison', fStreet: 'Rue, ville', fAddr: 'Adresse du service', fDate: 'Date et heure souhaitées', fDateEx: 'Ex. : samedi 8 novembre, 8 h', fDetails: 'Détails de la demande',
    fHelpDelivery: 'Donnez-nous le plus de détails possible : dimensions, nombre de boîtes et poids (cm ou pouces, lb ou kg) ; pour un déménagement, nombre de pièces (ex. : maison avec 2 chambres et un bureau), service d’emballage oui ou non, nombre d’étages aux deux adresses.', fHelpHandling: 'Décrivez les produits (taille, poids), le temps approximatif et le nombre de personnes souhaité.',
    fConsent: 'En envoyant ce formulaire, vous acceptez d’être contacté par Groupe Gama au sujet de votre demande. Aucune infolettre, aucune revente de données.', fSend: 'Envoyer ma demande', fCallH2: 'Vous préférez parler à quelqu’un ?', fCallP: 'Appelez-nous, 7 jours sur 7 :',
  },
  en: {
    locale: 'en-CA', og: 'en_CA', home: 'Home', homeLabel: 'home', services: 'Our services', zones: 'Service areas', servicesShort: 'Services', zonesShort: 'Areas', faq: 'FAQ', quick: 'Get a quote', skip: 'Skip to content', mainNav: 'Main navigation', menu: 'Menu', crumbs: 'Breadcrumb', switchLabel: 'Français', switchShort: 'FR', switchTitle: 'Voir cette page en français',
    footAbout: 'Delivery, distribution, moving and material handling anywhere in Quebec for over 25 years. Available 24/7.', rights: 'All rights reserved.', madeBy: 'Website by', quote: 'Request a quote', deliveryZone: (n) => n + ' delivery',
    ctaBtn: 'Get a free quote', more: 'Learn more', details: 'Service details',
    homeSvcKicker: 'Custom transport solutions', homeSvcH2: 'Choose tailor-made excellence', homeSvcP: 'Delivery, moving, material handling, distribution: six services, one team, one phone number.',
    homeZoneH2: 'Everywhere in Greater Montreal, and across Quebec', homeZoneP: 'Island of Montreal, Laval, North Shore, South Shore and industrial parks every day; the rest of Quebec scheduled or next day.', homeZoneAlt: 'Aerial view of a warehouse and its loading docks in a Greater Montreal industrial park',
    homeWhyH2: 'Efficient logistics, 24/7', faqH2: 'Frequently asked questions', homeCta: ['What can we do for you?', 'Free quote, fast reply, 7 days a week.'],
    svcDetail: 'The service in detail', svcIncluded: 'What’s included', svcHow: 'How it works', svcFaq: (h1) => 'FAQ — ' + h1.toLowerCase(), svcOthers: 'Other Groupe Gama services', zonesServed: 'Service areas', svcCta: ['Need this service?', 'Get a price and a date today — no obligation.'], howTo: 'How to book: ',
    zoneKicker: (n) => n + ' delivery', zoneBook: 'Book a delivery', zoneThree: 'Three ways to deliver', zoneThreeH2: (a) => 'Express, scheduled or pallet delivery ' + a, zoneServed: (a) => 'Areas served ' + a, zoneCities: 'Cities and areas', zoneOthers: (a) => 'Our other services ' + a, zoneFaq: (h1) => 'FAQ — ' + h1.toLowerCase(), zoneOtherZones: 'Other areas', zoneCta: ['Need a delivery?', 'Get a free quote or book your service today.'], zoneServiceType: 'Delivery',
    cities: 'Cities', cityKicker: (n) => n + ' delivery', cityIntroH2: (n) => 'Groupe Gama in ' + n, cityWhy: 'What we do for you', cityAccess: 'Access and delivery times', citySvcH2: (n) => 'Our services in ' + n, citySvcP: 'Six services, one team and one phone number, from urgent parcels to moving.', citySectors: (n) => 'Areas served in ' + n, cityFaq: (n) => 'FAQ — ' + n, cityNear: 'Nearby cities', cityZone: 'See the whole area', cityCta: (n) => ['Need a delivery in ' + n + '?', 'Price and date confirmed today — free quote, no obligation.'], cityBook: 'Get a price',
    formKicker: 'Free quote', formTitleSuffix: '', fName: 'Full name', fEmail: 'Email', fPhone: 'Phone', fService: 'Service', fChoose: 'Choose…', fServiceHelp: 'Please choose the right service: it determines which team gets back to you.', fFrom: 'Pickup address', fTo: 'Delivery address', fStreet: 'Street, city', fAddr: 'Service address', fDate: 'Preferred date and time', fDateEx: 'E.g. Saturday, November 8, 8 a.m.', fDetails: 'Request details',
    fHelpDelivery: 'Give us as many details as possible: dimensions, number of boxes and weight (cm or inches, lb or kg); for a move, number of rooms (e.g. house with 2 bedrooms and an office), packing service yes or no, number of floors at both addresses.', fHelpHandling: 'Describe the products (size, weight), the approximate time needed and the number of people you would like.',
    fConsent: 'By sending this form, you agree to be contacted by Groupe Gama about your request. No newsletter, no resale of your data.', fSend: 'Send my request', fCallH2: 'Prefer to talk to someone?', fCallP: 'Call us, 7 days a week:',
  },
};

function faqHtml(items) {
  return '<div class="faq">' + items.map(([q, a], i) => '<details' + (i === 0 ? ' open' : '') + '><summary>' + esc(q) + '</summary><p>' + esc(a) + '</p></details>').join('') + '</div>';
}
const faqLd = (items) => ({ '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const crumbsLd = (list) => ({ '@type': 'BreadcrumbList', itemListElement: list.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })) });

const ORG_ID = S.SITE + '/#organisation';
const AREA = [{ '@type': 'City', name: 'Montréal' }, { '@type': 'City', name: 'Laval' }, { '@type': 'City', name: 'Longueuil' }, { '@type': 'City', name: 'Brossard' }, { '@type': 'City', name: 'Terrebonne' }, { '@type': 'AdministrativeArea', name: 'Québec' }];
function org(lang) {
  const D = DATA[lang];
  return {
    '@type': ['MovingCompany', 'LocalBusiness'], '@id': ORG_ID, name: S.BRAND, url: abs(href(lang, '/')), telephone: S.PHONE_TEL, image: S.SITE + img('hero-montreal'), logo: S.SITE + '/logo.svg', priceRange: '$$',
    description: lang === 'fr' ? 'Livraison urgente 24/7, livraison dès le lendemain, déménagement la fin de semaine, manutention et déchargement de conteneurs, livraison en marque blanche et distribution publicitaire à Montréal, Laval, Rive-Nord et Rive-Sud.' : '24/7 urgent delivery, next-day delivery, weekend moving, material handling and container unloading, white-label delivery and flyer distribution in Montreal, Laval, the North Shore and South Shore.',
    areaServed: AREA,
    address: { '@type': 'PostalAddress', addressLocality: 'Montréal', addressRegion: 'QC', addressCountry: 'CA' },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' }],
    knowsLanguage: ['fr-CA', 'en-CA'],
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: Object.entries(D.SERVICES).map(([k, s]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.h1, url: abs(href(lang, k)) } })) },
  };
}

function nav(lang, active) {
  const D = DATA[lang], L = T[lang];
  const links = (obj) => Object.entries(obj).map(([k, s]) => '<a href="' + href(lang, k) + '"' + (active === k ? ' aria-current="page"' : '') + '>' + esc(s.nav) + '</a>').join('');
  const svc = links(D.SERVICES), zones = links(D.ZONES) + '<span class="menu-sep">' + L.cities + '</span>' + cityKeys.map((k) => '<a href="' + href(lang, k) + '"' + (active === k ? ' aria-current="page"' : '') + '>' + esc(city(lang, k).nav) + '</a>').join('');
  const alt = href(other(lang), active);
  const sw = `<a class="lang" href="${alt}" hreflang="${T[other(lang)].locale}" lang="${other(lang)}" title="${L.switchTitle}"><span class="lang-long">${L.switchLabel}</span><span class="lang-short">${L.switchShort}</span></a>`;
  return `<header id="hdr"><div class="wrap bar">
  <a class="logo" href="${href(lang, '/')}" aria-label="${S.BRAND} — ${L.homeLabel}">${LOGO}<span>GROUPE <b>GAMA</b></span></a>
  <nav aria-label="${L.mainNav}">
    <div class="dd"><button type="button" aria-expanded="false" aria-controls="m-services">${L.services}</button><div class="menu" id="m-services">${svc}</div></div>
    <div class="dd"><button type="button" aria-expanded="false" aria-controls="m-zones">${L.zones}</button><div class="menu" id="m-zones">${zones}</div></div>
    <a href="${href(lang, '/')}#faq">${L.faq}</a>
  </nav>
  ${sw}
  <a class="tel" href="tel:${S.PHONE_TEL}">${icon('phone', 18)}<span>${S.PHONE}</span></a>
  <a class="btn btn-primary cta-top" href="${href(lang, 'form')}">${L.quick}</a>
  <button class="burger" type="button" aria-label="${L.menu}" aria-expanded="false" aria-controls="mnav"><span></span><span></span><span></span></button>
</div>
<div class="mnav" id="mnav">
  <strong>${L.services}</strong>${svc}<strong>${L.zones}</strong>${zones}<a href="${href(lang, '/')}#faq">${L.faq}</a><a href="${alt}" hreflang="${T[other(lang)].locale}" lang="${other(lang)}">${L.switchLabel}</a><a class="btn btn-primary" href="${href(lang, 'form')}">${L.quick}</a>
</div></header>`;
}

function footer(lang) {
  const D = DATA[lang], L = T[lang];
  const svc = Object.entries(D.SERVICES).map(([k, s]) => '<a href="' + href(lang, k) + '">' + esc(s.nav) + '</a>').join('');
  const zones = Object.entries(D.ZONES).map(([k, z]) => '<a href="' + href(lang, k) + '">' + esc(L.deliveryZone(z.nav)) + '</a>').join('');
  return `<footer><div class="wrap">
  <div class="foot">
    <div><a class="logo" href="${href(lang, '/')}">${LOGO}<span>GROUPE <b>GAMA</b></span></a><p>${L.footAbout}</p><a class="tel big" href="tel:${S.PHONE_TEL}">${S.PHONE}</a></div>
    <div><h4>${L.servicesShort}</h4>${svc}</div>
    <div><h4>${L.zonesShort}</h4>${zones}<a href="${href(lang, 'form')}">${L.quote}</a></div>
    <div><h4>${L.cities}</h4>${cityKeys.map((k) => '<a href="' + href(lang, k) + '">' + esc(L.deliveryZone(city(lang, k).nav)) + '</a>').join('')}</div>
  </div>
  <div class="legal"><span>© ${new Date().getFullYear()} ${S.BRAND}. ${L.rights}</span><span><a href="${href(other(lang), '/')}" hreflang="${T[other(lang)].locale}" lang="${other(lang)}">${L.switchLabel}</a> · ${L.madeBy} <a href="https://altea.ca" rel="noopener">Altea.ca</a></span></div>
</div></footer>`;
}

function page(lang, { key, title, meta, body, ld, ogImage, crumbs }) {
  const L = T[lang];
  const url = abs(href(lang, key));
  const fr = abs(href('fr', key)), en = abs(href('en', key));
  const jsonld = { '@context': 'https://schema.org', '@graph': [org(lang), { '@type': 'WebSite', '@id': S.SITE + '/#site', url: S.SITE + '/', name: S.BRAND, inLanguage: ['fr-CA', 'en-CA'], publisher: { '@id': ORG_ID } }, { '@type': 'WebPage', '@id': url, url, name: title, description: meta, inLanguage: L.locale, isPartOf: { '@id': S.SITE + '/#site' }, about: { '@id': ORG_ID }, dateModified: S.UPDATED }, crumbsLd(crumbs), ...ld] };
  return `<!doctype html>
<html lang="${L.locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="fr-CA" href="${fr}">
<link rel="alternate" hreflang="en-CA" href="${en}">
<link rel="alternate" hreflang="x-default" href="${fr}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${S.BRAND}">
<meta property="og:locale" content="${L.og}">
<meta property="og:locale:alternate" content="${T[other(lang)].og}">
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
<a class="skip" href="#main">${L.skip}</a>
${nav(lang, key)}
<main id="main">
${body}
</main>
${footer(lang)}
<script src="/site.js?v=__CSSV__" defer></script>
</body>
</html>`;
}

const ctaBand = (lang, [title, lead]) => `<section class="cta"><div class="wrap"><h2>${esc(title)}</h2><p>${esc(lead)}</p><div class="actions"><a class="btn btn-white" href="${href(lang, 'form')}">${T[lang].ctaBtn} ${ARROW}</a><a class="btn btn-ghost" href="tel:${S.PHONE_TEL}">${icon('phone', 18)} ${S.PHONE}</a></div></div></section>`;
const serviceCard = (lang, k) => { const D = DATA[lang]; const s = D.SERVICES[k] || D.ZONES[k]; return `<a class="card" href="${href(lang, k)}"><div class="ic">${icon(s.icon || 'truck')}</div><h3>${esc(s.h1)}</h3><p>${esc(s.lead)}</p><span class="more">${T[lang].more} ${ARROW}</span></a>`; };
const testimonial = (lang) => { const t = DATA[lang].HOME.testimonial; return `<figure class="quote"><blockquote>${lang === 'fr' ? '« ' + esc(t.quote) + ' »' : '“' + esc(t.quote) + '”'}</blockquote><figcaption><b>${esc(t.author)}</b> — ${esc(t.org)}</figcaption></figure>`; };

// ——— Accueil
function home(lang) {
  const D = DATA[lang], H = D.HOME, L = T[lang];
  const body = `
<section class="hero">
  <img class="hero-bg" src="${img('hero-montreal')}" alt="" width="1200" height="900" fetchpriority="high">
  <div class="wrap">
    <span class="kicker">${esc(H.kicker)}</span>
    <h1>${esc(H.h1)}</h1>
    <p class="lead">${esc(H.lead)}</p>
    <div class="actions"><a class="btn btn-primary" href="${href(lang, 'form')}">${L.quick} ${ARROW}</a><a class="btn btn-light" href="tel:${S.PHONE_TEL}">${icon('phone', 18)} ${S.PHONE}</a></div>
    <ul class="stats">${H.stats.map(([v, l]) => '<li><b>' + esc(v) + '</b><span>' + esc(l) + '</span></li>').join('')}</ul>
  </div>
</section>
<section class="sec" id="services">
  <div class="wrap">
    <div class="sec-head"><span class="kicker">${L.homeSvcKicker}</span><h2>${L.homeSvcH2}</h2><p>${L.homeSvcP}</p></div>
    <div class="grid3">${Object.keys(D.SERVICES).map((k) => serviceCard(lang, k)).join('')}</div>
  </div>
</section>
<section class="sec alt" id="zones">
  <div class="wrap split">
    <div>
      <span class="kicker">${L.zones}</span>
      <h2>${L.homeZoneH2}</h2>
      <p>${L.homeZoneP}</p>
      <div class="chips">${Object.entries(D.ZONES).map(([k, z]) => '<a href="' + href(lang, k) + '">' + esc(z.h1) + ' ' + ARROW + '</a>').join('')}</div>
      <p class="city-links"><b>${L.cities} :</b> ${cityKeys.map((k) => '<a href="' + href(lang, k) + '">' + esc(city(lang, k).nav) + '</a>').join(' · ')}</p>
    </div>
    <img src="${img('entrepot-aerien')}" alt="${L.homeZoneAlt}" width="1600" height="1067" loading="lazy">
  </div>
</section>
<section class="sec" id="why">
  <div class="wrap">
    <div class="sec-head"><span class="kicker">${esc(H.whyTitle)}</span><h2>${L.homeWhyH2}</h2><p>${esc(H.whyLead)}</p></div>
    <div class="grid4">${H.why.map(([t, d]) => '<div class="why"><span class="n">' + CHECK + '</span><h3>' + esc(t) + '</h3><p>' + esc(d) + '</p></div>').join('')}</div>
    ${testimonial(lang)}
  </div>
</section>
<section class="sec alt" id="faq">
  <div class="wrap narrow"><div class="sec-head"><span class="kicker">FAQ</span><h2>${L.faqH2}</h2></div>${faqHtml(H.faq)}</div>
</section>
${ctaBand(lang, L.homeCta)}`;
  return page(lang, { key: '/', title: H.title, meta: H.meta, body, ld: [faqLd(H.faq)], crumbs: [[L.home, abs(href(lang, '/'))]] });
}

// ——— Pages services
function servicePage(lang, k) {
  const D = DATA[lang], s = D.SERVICES[k], L = T[lang];
  const url = abs(href(lang, k));
  const ld = [
    { '@type': 'Service', '@id': url + '#service', name: s.h1, serviceType: s.service, description: s.meta, provider: { '@id': ORG_ID }, areaServed: AREA, url, image: S.SITE + img(s.image) },
    faqLd(s.faq),
    { '@type': 'HowTo', name: L.howTo + s.h1, step: s.how.map(([n, t], i) => ({ '@type': 'HowToStep', position: i + 1, name: n, text: t })) },
  ];
  const body = `
<section class="phero">
  <div class="wrap split">
    <div>
      <nav class="crumbs" aria-label="${L.crumbs}"><a href="${href(lang, '/')}">${L.home}</a><span>›</span><a href="${href(lang, '/')}#services">${L.servicesShort}</a><span>›</span><span aria-current="page">${esc(s.nav)}</span></nav>
      <span class="kicker">${icon(s.icon, 18)} ${esc(s.service)}</span>
      <h1>${esc(s.h1)}</h1>
      <p class="lead">${esc(s.lead)}</p>
      <div class="actions"><a class="btn btn-primary" href="${href(lang, 'form')}?service=${encodeURIComponent(formService(S.SERVICES[k].service))}">${L.quick} ${ARROW}</a><a class="btn btn-light" href="tel:${S.PHONE_TEL}">${icon('phone', 18)} ${S.PHONE}</a></div>
    </div>
    <img src="${img(s.image)}" alt="${esc(s.imageAlt)}" width="1200" height="900" fetchpriority="high">
  </div>
</section>
<section class="sec">
  <div class="wrap split2">
    <article class="prose"><h2>${L.svcDetail}</h2><p>${esc(s.intro)}</p>
      <h3>${L.svcIncluded}</h3><ul class="checks">${s.points.map((p) => '<li>' + CHECK + '<span>' + esc(p) + '</span></li>').join('')}</ul>
    </article>
    <aside class="steps"><h2>${L.svcHow}</h2><ol>${s.how.map(([n, t]) => '<li><b>' + esc(n) + '</b><p>' + esc(t) + '</p></li>').join('')}</ol></aside>
  </div>
</section>
<section class="sec alt">
  <div class="wrap narrow"><div class="sec-head"><span class="kicker">FAQ</span><h2>${esc(L.svcFaq(s.h1))}</h2></div>${faqHtml(s.faq)}${s.testimonial ? testimonial(lang) : ''}</div>
</section>
<section class="sec">
  <div class="wrap"><h2 class="h-sm">${L.svcOthers}</h2><div class="grid3">${s.related.map((r) => serviceCard(lang, r)).join('')}</div>
  <p class="zone-links">${L.zonesServed} : ${Object.entries(D.ZONES).map(([z, zz]) => '<a href="' + href(lang, z) + '">' + esc(zz.h1) + '</a>').join(' · ')}</p></div>
</section>
${ctaBand(lang, L.svcCta)}`;
  return page(lang, { key: k, title: s.title, meta: s.meta, body, ld, ogImage: s.image, crumbs: [[L.home, abs(href(lang, '/'))], [L.servicesShort, abs(href(lang, '/')) + '#services'], [s.h1, url]] });
}

// ——— Pages zones
function zonePage(lang, k) {
  const D = DATA[lang], z = D.ZONES[k], L = T[lang];
  const url = abs(href(lang, k));
  const ld = [
    { '@type': 'Service', '@id': url + '#service', name: z.h1, serviceType: L.zoneServiceType, description: z.meta, provider: { '@id': ORG_ID }, url, image: S.SITE + img(z.image), areaServed: z.cities.map((c) => ({ '@type': 'City', name: c.replace(/ \(.*\)/, '') })) },
    faqLd(z.faq),
  ];
  const body = `
<section class="phero">
  <div class="wrap split">
    <div>
      <nav class="crumbs" aria-label="${L.crumbs}"><a href="${href(lang, '/')}">${L.home}</a><span>›</span><a href="${href(lang, '/')}#zones">${L.zones}</a><span>›</span><span aria-current="page">${esc(z.nav)}</span></nav>
      <span class="kicker">${icon('truck', 18)} ${esc(L.zoneKicker(z.nav))}</span>
      <h1>${esc(z.h1)}</h1>
      <p class="lead">${esc(z.lead)}</p>
      <div class="actions"><a class="btn btn-primary" href="${href(lang, 'form')}?service=Livraison">${L.zoneBook} ${ARROW}</a><a class="btn btn-light" href="tel:${S.PHONE_TEL}">${icon('phone', 18)} ${S.PHONE}</a></div>
    </div>
    <img src="${img(z.image)}" alt="${esc(z.imageAlt)}" width="1200" height="900" fetchpriority="high">
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><span class="kicker">${L.zoneThree}</span><h2>${esc(L.zoneThreeH2(z.area))}</h2></div>
    <div class="grid3">${D.ZONE_SERVICES.map(([t, d, sk]) => '<a class="card" href="' + href(lang, sk) + '"><div class="ic">' + icon(S.SERVICES[sk].icon) + '</div><h3>' + esc(t) + '</h3><p>' + esc(d) + '</p><span class="more">' + L.details + ' ' + ARROW + '</span></a>').join('')}</div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap split2">
    <article class="prose"><h2>${esc(L.zoneServed(z.area))}</h2><p>${esc(z.zoneText)}</p>
      <h3>${L.zoneCities}</h3><ul class="cities">${z.cities.map((c) => { const ck = cityKeys.find((x) => c.startsWith(city(lang, x).nav.split(' ')[0].replace(/,$/, ''))); return '<li>' + (ck ? '<a href="' + href(lang, ck) + '">' + esc(c) + '</a>' : esc(c)) + '</li>'; }).join('')}</ul>
      ${citiesOf(k).length ? '<p class="city-links"><b>' + L.cities + ' :</b> ' + citiesOf(k).map((x) => '<a href="' + href(lang, x) + '">' + esc(city(lang, x).h1) + '</a>').join(' · ') + '</p>' : ''}</article>
    <aside class="steps"><h2>${esc(L.zoneOthers(z.area))}</h2><ol>${['demenagement-montreal', 'manutention-dechargement-conteneurs', 'livraison-marque-blanche', 'distribution-publicitaire-montreal'].map((sk) => '<li><b><a href="' + href(lang, sk) + '">' + esc(D.SERVICES[sk].h1) + '</a></b><p>' + esc(D.SERVICES[sk].lead) + '</p></li>').join('')}</ol></aside>
  </div>
</section>
<section class="sec">
  <div class="wrap narrow"><div class="sec-head"><span class="kicker">FAQ</span><h2>${esc(L.zoneFaq(z.h1))}</h2></div>${faqHtml(z.faq)}${testimonial(lang)}
  <p class="zone-links">${L.zoneOtherZones} : ${z.related.map((r) => '<a href="' + href(lang, r) + '">' + esc(D.ZONES[r].h1) + '</a>').join(' · ')}</p></div>
</section>
${ctaBand(lang, L.zoneCta)}`;
  return page(lang, { key: k, title: z.title, meta: z.meta, body, ld, ogImage: z.image, crumbs: [[L.home, abs(href(lang, '/'))], [L.zones, abs(href(lang, '/')) + '#zones'], [z.h1, url]] });
}

// ——— Pages de villes
function cityPage(lang, k) {
  const D = DATA[lang], c = city(lang, k), L = T[lang], z = D.ZONES[c.zone];
  const url = abs(href(lang, k));
  const name = c.nav;
  const ld = [
    { '@type': 'Service', '@id': url + '#service', name: c.h1, serviceType: L.zoneServiceType, description: c.meta, provider: { '@id': ORG_ID }, url, image: S.SITE + img(c.image), areaServed: { '@type': 'City', name: name.split(/ et | & /)[0], containedInPlace: { '@type': 'AdministrativeArea', name: 'Québec' } }, hasOfferCatalog: { '@type': 'OfferCatalog', name: L.citySvcH2(name), itemListElement: Object.entries(D.SERVICES).map(([sk, sv]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: sv.h1, url: abs(href(lang, sk)) } })) } },
    faqLd(c.faq),
  ];
  const body = `
<section class="phero">
  <div class="wrap split">
    <div>
      <nav class="crumbs" aria-label="${L.crumbs}"><a href="${href(lang, '/')}">${L.home}</a><span>›</span><a href="${href(lang, c.zone)}">${esc(z.nav)}</a><span>›</span><span aria-current="page">${esc(name)}</span></nav>
      <span class="kicker">${icon('truck', 18)} ${esc(L.cityKicker(name))}</span>
      <h1>${esc(c.h1)}</h1>
      <p class="lead">${esc(c.lead)}</p>
      <div class="actions"><a class="btn btn-primary" href="${href(lang, 'form')}?service=Livraison">${L.cityBook} ${ARROW}</a><a class="btn btn-light" href="tel:${S.PHONE_TEL}">${icon('phone', 18)} ${S.PHONE}</a></div>
    </div>
    <img src="${img(c.image)}" alt="${esc(c.imageAlt)}" width="1200" height="900" fetchpriority="high">
  </div>
</section>
<section class="sec">
  <div class="wrap split2">
    <article class="prose"><h2>${esc(L.cityIntroH2(name))}</h2><p>${esc(c.intro)}</p>
      <h3>${L.cityWhy}</h3><ul class="checks">${c.highlights.map((p) => '<li>' + CHECK + '<span>' + esc(p) + '</span></li>').join('')}</ul>
    </article>
    <aside class="steps"><h2>${L.cityAccess}</h2><p>${esc(c.access)}</p></aside>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L.citySvcH2(name))}</h2><p>${L.citySvcP}</p></div>
    <div class="grid3">${Object.keys(D.SERVICES).map((sk) => serviceCard(lang, sk)).join('')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap narrow">
    <h2>${esc(L.citySectors(name))}</h2>
    <ul class="cities">${c.sectors.map((x) => '<li>' + esc(x) + '</li>').join('')}</ul>
    <p class="zone-links">${L.cityZone} : <a href="${href(lang, c.zone)}">${esc(z.h1)}</a></p>
  </div>
</section>
<section class="sec alt">
  <div class="wrap narrow"><div class="sec-head"><span class="kicker">FAQ</span><h2>${esc(L.cityFaq(name))}</h2></div>${faqHtml(c.faq)}${testimonial(lang)}
  <p class="zone-links">${L.cityNear} : ${c.near.map((n) => '<a href="' + href(lang, n) + '">' + esc(city(lang, n).h1) + '</a>').join(' · ')}</p></div>
</section>
${ctaBand(lang, L.cityCta(name))}`;
  return page(lang, { key: k, title: c.title, meta: c.meta, body, ld, ogImage: c.image, crumbs: [[L.home, abs(href(lang, '/'))], [z.h1, abs(href(lang, c.zone))], [c.h1, url]] });
}

// ——— Formulaire (les valeurs du champ Service restent en français : c'est ce que l'équipe reçoit)
function formPage(lang) {
  const F = DATA[lang].FORM, L = T[lang];
  const url = abs(href(lang, 'form'));
  const body = `
<section class="phero form-hero">
  <div class="wrap narrow">
    <nav class="crumbs" aria-label="${L.crumbs}"><a href="${href(lang, '/')}">${L.home}</a><span>›</span><span aria-current="page">${esc(F.title)}</span></nav>
    <span class="kicker">${L.formKicker}</span>
    <h1>${esc(F.h1)}</h1>
    <p class="lead">${esc(F.lead)}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap narrow">
    <form id="quote" class="quote-form" method="post" action="/api/demande" novalidate>
      <input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <div class="row2">
        <label>${L.fName}<input type="text" name="Name" required autocomplete="name"></label>
        <label>${L.fEmail}<input type="email" name="Email" required autocomplete="email"></label>
      </div>
      <div class="row2">
        <label>${L.fPhone}<input type="tel" name="Phone" required autocomplete="tel"></label>
        <label>${L.fService}<select name="Service" required><option value="">${L.fChoose}</option>${F.services.map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + '</option>').join('')}</select><small>${L.fServiceHelp}</small></label>
      </div>
      <div class="row2" data-when="livraison">
        <label>${L.fFrom}<input type="text" name="from" autocomplete="off" placeholder="${L.fStreet}"></label>
        <label>${L.fTo}<input type="text" name="to" autocomplete="off" placeholder="${L.fStreet}"></label>
      </div>
      <div class="row2" data-when="manutention" hidden>
        <label>${L.fAddr}<input type="text" name="from_m" autocomplete="off" placeholder="${L.fStreet}"></label>
        <label>${L.fDate}<input type="text" name="Date" placeholder="${L.fDateEx}"></label>
      </div>
      <label>${L.fDetails}<textarea name="Demande" rows="7" required></textarea>
        <small data-when="livraison">${L.fHelpDelivery}</small>
        <small data-when="manutention" hidden>${L.fHelpHandling}</small>
      </label>
      <p class="consent">${L.fConsent}</p>
      <button class="btn btn-primary big" type="submit">${L.fSend} ${ARROW}</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
    <div class="alt-contact"><h2>${L.fCallH2}</h2><p>${L.fCallP} <a class="tel big" href="tel:${S.PHONE_TEL}">${S.PHONE}</a></p></div>
  </div>
</section>`;
  return page(lang, { key: 'form', title: F.title + L.formTitleSuffix + ' | ' + S.BRAND, meta: F.meta, body, ld: [{ '@type': 'ContactPage', '@id': url + '#contact', url, name: F.title }], crumbs: [[L.home, abs(href(lang, '/'))], [F.title, url]] });
}

// ——— Écriture
const KEYS = ['/', ...Object.keys(S.ZONES), ...cityKeys, ...Object.keys(S.SERVICES), 'form'];
const file = (lang, key) => { const p = href(lang, key); return p === '/' ? 'index.html' : p === '/en' ? 'en/index.html' : p.slice(1) + '.html'; };
const pages = {};
for (const lang of ['fr', 'en']) {
  pages[file(lang, '/')] = home(lang);
  pages[file(lang, 'form')] = formPage(lang);
  for (const k of Object.keys(S.SERVICES)) pages[file(lang, k)] = servicePage(lang, k);
  for (const k of Object.keys(S.ZONES)) pages[file(lang, k)] = zonePage(lang, k);
  for (const k of cityKeys) pages[file(lang, k)] = cityPage(lang, k);
}
for (const [f, html] of Object.entries(pages)) fs.writeFileSync(path.join(DIST, f), html);

// Sitemap avec alternates hreflang
const prio = (k) => (k === '/' ? '1.0' : k in S.ZONES || k in CITIES ? '0.9' : '0.8');
const sm = [];
for (const lang of ['fr', 'en']) for (const k of KEYS) {
  sm.push('  <url><loc>' + abs(href(lang, k)) + '</loc><lastmod>' + S.UPDATED + '</lastmod><changefreq>' + (k === '/' ? 'weekly' : 'monthly') + '</changefreq><priority>' + prio(k) + '</priority>'
    + '<xhtml:link rel="alternate" hreflang="fr-CA" href="' + abs(href('fr', k)) + '"/><xhtml:link rel="alternate" hreflang="en-CA" href="' + abs(href('en', k)) + '"/><xhtml:link rel="alternate" hreflang="x-default" href="' + abs(href('fr', k)) + '"/></url>');
}
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + sm.join('\n') + '\n</urlset>\n');

const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'Claude-SearchBot', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Googlebot', 'Bingbot', 'Applebot', 'Applebot-Extended', 'Amazonbot', 'meta-externalagent', 'Meta-ExternalFetcher', 'DuckAssistBot', 'YouBot', 'cohere-ai', 'CCBot', 'Bytespider', 'MistralAI-User'];
fs.writeFileSync(path.join(DIST, 'robots.txt'), '# Robots d\'indexation classiques\nUser-agent: *\nAllow: /\nDisallow: /api/\n\n# Assistants et moteurs IA : accès explicitement autorisé\n' + AI_BOTS.map((b) => 'User-agent: ' + b).join('\n') + '\nAllow: /\nDisallow: /api/\n\nSitemap: ' + S.SITE + '/sitemap.xml\n# Résumé lisible par les IA : ' + S.SITE + '/llms.txt\n');

// llms.txt — résumé structuré du site pour les assistants IA (llmstxt.org)
const strip = (t) => String(t).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const llms = [];
llms.push('# ' + S.BRAND, '', '> ' + strip(S.HOME.meta), '', 'Site : ' + S.SITE + '/ — Téléphone : ' + S.PHONE + ' (7 jours sur 7). Devis gratuit : ' + abs(href('fr', 'form')), 'Langues : français (' + S.SITE + '/) et anglais (' + S.SITE + '/en). Zone de service : Grand Montréal (île de Montréal, Laval, Rive-Nord, Rive-Sud) au quotidien, livraison partout au Québec en planifié ou dès le lendemain. Dernière mise à jour : ' + S.UPDATED + '.', '');
llms.push('## Faits clés', ...S.HOME.stats.map(([n, t]) => '- ' + n + ' ' + t), ...S.HOME.why.map(([t, d]) => '- ' + t + ' : ' + strip(d)), '');
llms.push('## Services');
for (const [slug, sv] of Object.entries(S.SERVICES)) llms.push('- [' + sv.h1 + '](' + abs(href('fr', slug)) + ') : ' + strip(sv.meta));
llms.push('', '## Zones desservies');
for (const [slug, z] of Object.entries(S.ZONES)) llms.push('- [' + z.h1 + '](' + abs(href('fr', slug)) + ') : ' + z.cities.map((c) => c.replace(/ \(.*\)/, '')).join(', '));
llms.push('', '## Villes');
for (const k of cityKeys) llms.push('- [' + CITIES[k].fr.h1 + '](' + abs(href('fr', k)) + ') : ' + strip(CITIES[k].fr.meta));
llms.push('', '## Questions fréquentes');
for (const [q, a] of S.HOME.faq) llms.push('- **' + q + '** ' + strip(a));
for (const sv of Object.values(S.SERVICES)) for (const [q, a] of (sv.faq || []).slice(0, 2)) llms.push('- **' + q + '** ' + strip(a));
llms.push('', '## Pages', '- [Accueil](' + S.SITE + '/)', '- [Demande de soumission](' + abs(href('fr', 'form')) + ')', ...Object.entries(S.SERVICES).map(([k, v]) => '- [' + v.nav + '](' + abs(href('fr', k)) + ')'), ...Object.entries(S.ZONES).map(([k, v]) => '- [' + v.nav + '](' + abs(href('fr', k)) + ')'), '- [Plan du site XML](' + S.SITE + '/sitemap.xml)', '');
llms.push('## English', '> ' + strip(E.HOME.meta), '', '- [Home](' + abs(href('en', '/')) + ')', '- [Request a quote](' + abs(href('en', 'form')) + ')', ...Object.keys(S.SERVICES).map((k) => '- [' + DATA.en.SERVICES[k].h1 + '](' + abs(href('en', k)) + ') : ' + strip(DATA.en.SERVICES[k].meta)), ...Object.keys(S.ZONES).map((k) => '- [' + DATA.en.ZONES[k].h1 + '](' + abs(href('en', k)) + ')'), ...cityKeys.map((k) => '- [' + CITIES[k].en.h1 + '](' + abs(href('en', k)) + ')'), '');
llms.push('## Optionnel', '- Entreprise : ' + S.BRAND + ', transporteur et déménageur québécois, plus de 25 ans d\'expérience. Services : livraison urgente 24/7, livraison dès le lendemain, déménagement la fin de semaine, déchargement de conteneurs, manutention, livraison en marque blanche.', '- Pour citer ce site : « ' + S.BRAND + ' (' + S.SITE + ') ».', '');
fs.writeFileSync(path.join(DIST, 'llms.txt'), llms.join('\n'));

for (const f of ['site.css', 'site.js', 'favicon.svg', 'logo.svg']) fs.copyFileSync(path.join(__dirname, 'public', f), path.join(DIST, f));
fs.mkdirSync(path.join(DIST, 'img'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'public/img'))) fs.copyFileSync(path.join(__dirname, 'public/img', f), path.join(DIST, 'img', f));
fs.writeFileSync(path.join(DIST, 'routes.json'), JSON.stringify({ pages: Object.keys(pages), updated: S.UPDATED }));
console.log(Object.keys(pages).length + ' pages générées dans dist/ (FR + EN)');
