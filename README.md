# groupegama.ca

Site de Groupe Gama (livraison, déménagement, manutention — Montréal, Laval, Rive-Nord, Rive-Sud). Français, 11 pages, SEO complet.

## Structure

- `src/site.js` — **tout le contenu** (textes, services, zones, FAQ, métadonnées). C'est le seul fichier à éditer pour changer un texte.
- `build.js` — génère `dist/` : pages HTML, `sitemap.xml`, `robots.txt`, `routes.json`, copie du CSS/JS/images. Lancer `node build.js` après chaque modification, puis commettre `dist/`.
- `public/` — `site.css`, `site.js` (menu, formulaire, suivi), `logo.svg`, `favicon.svg`, `img/*.webp`.
- `railway-function.ts` — serveur Railway (Bun) : sert `dist/` depuis ce dépôt (branche `main`, cache 5 min), URL propres, redirections 301, en-têtes de sécurité, et traite le formulaire (`POST /api/demande`) : courriel direct via Resend (`RESEND_API_KEY`, `FORM_FROM` = adresse d'expédition sur un domaine vérifié, p. ex. demandes@groupegama.ca) ou, à défaut, Gmail SMTP (`GMAIL_USER`, `GMAIL_APP_PASSWORD`) ; `FORM_TO` = destinataires séparés par des virgules ; `FORM_ACK=0` désactive l'accusé de réception au client **et**, en parallèle, webhook Make « GroupeGamawebform » (`FORM_WEBHOOK` ; vide pour le désactiver). L'envoi réussit si l'un des deux canaux passe.

## URL

Conservées de l'ancien site Framer : `/`, `/livraison-grand-montreal`, `/livraison-rive-nord-montreal`, `/livraison-rive-sud-montreal`.
Nouvelles : `/livraison-urgente-montreal`, `/livraison-lendemain-quebec`, `/demenagement-montreal`, `/manutention-dechargement-conteneurs`, `/livraison-marque-blanche`, `/distribution-publicitaire-montreal`, `/demande-de-soumission`.
`www` → apex, barres finales et anciennes variantes → 301 (voir `REDIRECTS` dans la fonction).

## Déploiement

Railway, projet `sites-web`, service `groupegama-web`. Un `git push` sur `main` (avec `dist/` régénéré) met le site à jour en ≤ 5 min, sans redéploiement. La fonction n'est à redéployer que si `railway-function.ts` change.

## Mesure

- Umami (projet Railway `analytics`) : site `groupegama.ca`. Événements : `clic_telephone`, `clic_soumission`, `demande_envoyee`.
- AlteaSEO pixel (`site_mibyif16_8muag7`) et balise de vérification Google Search Console conservés de l'ancien site.
