# groupegama.ca

Site de Groupe Gama (livraison, déménagement, manutention — Montréal, Laval, Rive-Nord, Rive-Sud). Bilingue : français (19 pages, `/`) et anglais (19 pages, `/en/…`), dont 8 pages de villes par langue, SEO complet.

## Structure

- `src/site.js` — **tout le contenu français** (textes, services, zones, FAQ, métadonnées, images, liens entre pages).
- `src/site.en.js` — **contenu anglais**, mêmes clés que le français (slug français) + `slug` = URL anglaise sous `/en/`. Images, icônes et liens « services liés » sont repris du français. Changer un texte : le modifier dans les deux fichiers.
- `src/cities.js` — **pages de villes** (FR + EN côte à côte) : Laval, Longueuil, Brossard, Terrebonne, Boucherville, Blainville, Saint-Laurent, Anjou / est de Montréal. Chaque ville : zone parente, image, villes voisines, intro, points forts, secteurs, accès (ponts/autoroutes), FAQ locale. Ajouter une ville = ajouter une entrée ; menu, pied de page, accueil, pages de zones, sitemap et llms.txt suivent automatiquement.
- Les textes d'interface (menus, boutons, formulaire) sont dans l'objet `T` de `build.js` (fr / en).
- `build.js` — génère `dist/` : pages HTML, `sitemap.xml`, `robots.txt`, `routes.json`, copie du CSS/JS/images. Lancer `node build.js` après chaque modification, puis commettre `dist/`.
- `public/` — `site.css`, `site.js` (menu, formulaire, suivi), `logo.svg`, `favicon.svg`, `img/*.webp`.
- `railway-function.ts` — serveur Railway (Bun) : sert `dist/` depuis ce dépôt (branche `main`, cache 5 min), URL propres, redirections 301, en-têtes de sécurité, et traite le formulaire (`POST /api/demande`) : courriel direct via Resend (`RESEND_API_KEY`, `FORM_FROM` = adresse d'expédition sur un domaine vérifié, p. ex. demandes@groupegama.ca) ou, à défaut, Gmail SMTP (`GMAIL_USER`, `GMAIL_APP_PASSWORD`) ; `FORM_TO` = destinataires séparés par des virgules ; `FORM_ACK=0` désactive l'accusé de réception au client ; le webhook Make « GroupeGamawebform » est désactivé (`FORM_WEBHOOK` vide ; scénario Make « Gama Integration Webhooks » désactivé le 23 oct. 2026). Pour le réactiver : remettre l'URL du webhook dans `FORM_WEBHOOK` et réactiver le scénario.

## URL

Conservées de l'ancien site Framer : `/`, `/livraison-grand-montreal`, `/livraison-rive-nord-montreal`, `/livraison-rive-sud-montreal`.
Nouvelles : `/livraison-urgente-montreal`, `/livraison-lendemain-quebec`, `/demenagement-montreal`, `/manutention-dechargement-conteneurs`, `/livraison-marque-blanche`, `/distribution-publicitaire-montreal`, `/demande-de-soumission`.
`www` → apex, barres finales et anciennes variantes → 301 (voir `REDIRECTS` dans la fonction).

## Anglais

| FR | EN |
|---|---|
| `/` | `/en` |
| `/livraison-grand-montreal` | `/en/montreal-delivery` |
| `/livraison-rive-nord-montreal` | `/en/north-shore-delivery` |
| `/livraison-rive-sud-montreal` | `/en/south-shore-delivery` |
| `/livraison-urgente-montreal` | `/en/same-day-courier-montreal` |
| `/livraison-lendemain-quebec` | `/en/next-day-delivery-quebec` |
| `/demenagement-montreal` | `/en/moving-montreal` |
| `/manutention-dechargement-conteneurs` | `/en/container-unloading-montreal` |
| `/livraison-marque-blanche` | `/en/white-label-delivery` |
| `/distribution-publicitaire-montreal` | `/en/flyer-distribution-montreal` |
| `/demande-de-soumission` | `/en/request-a-quote` |
| `/livraison-laval`, `/livraison-longueuil`, `/livraison-brossard`, `/livraison-terrebonne`, `/livraison-boucherville`, `/livraison-blainville`, `/livraison-saint-laurent`, `/livraison-anjou` | `/en/laval-delivery`, `/en/longueuil-delivery`, `/en/brossard-delivery`, `/en/terrebonne-delivery`, `/en/boucherville-delivery`, `/en/blainville-delivery`, `/en/saint-laurent-delivery`, `/en/anjou-east-montreal-delivery` |

- Chaque page a ses `hreflang` (fr-CA, en-CA, x-default = FR) ; le sitemap liste les 38 URL avec leurs alternates ; bouton FR/EN dans l'en-tête, le menu mobile et le pied de page.
- Langue automatique (comme les autres sites Railway) : à l'arrivée depuis l'extérieur, un navigateur anglais est redirigé (302) vers la page anglaise équivalente et inversement ; un clic sur le bouton de langue mémorise le choix (cookie `lang`) ; robots jamais redirigés.
- Formulaire anglais : les valeurs du champ Service restent en français (ce que l'équipe reçoit) ; le courriel à l'équipe indique « client anglophone, répondre en anglais » ; l'accusé de réception au client part en anglais.

## Déploiement

Railway, projet `sites-web`, service `groupegama-web`. Un `git push` sur `main` (avec `dist/` régénéré) met le site à jour en ≤ 5 min, sans redéploiement. La fonction n'est à redéployer que si `railway-function.ts` change.

## Mesure

- Umami (projet Railway `analytics`) : site `groupegama.ca`. Événements : `clic_telephone`, `clic_soumission`, `demande_envoyee`.
- AlteaSEO pixel (`site_mibyif16_8muag7`) et balise de vérification Google Search Console conservés de l'ancien site.
