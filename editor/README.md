# Gama Editor — Puck + Claude

Éditeur visuel de sites web (façon Framer léger) qui combine
[Puck](https://puckeditor.com) pour le canvas drag-and-drop et
[Claude](https://www.anthropic.com/claude) pour la génération et l'édition
de contenu par langage naturel.

## Ce que ça fait

- Canvas Puck avec inspecteur et arborescence de composants.
- Bibliothèque de blocs typés (Hero, Heading, Text, Image, Button, Columns, Spacer).
- Panneau de chat à droite : décris la page ou l'édition souhaitée, Claude
  émet des *tool calls* qui modifient l'arbre Puck.
- Persistance locale (`localStorage`) — suffisant pour essayer.

## Mise en route

```bash
cd editor
cp .env.example .env.local      # remplacer par ta vraie clé Anthropic
npm install
npm run dev
# ouvrir http://localhost:3000
```

Il te faut une clé API Anthropic valide (`ANTHROPIC_API_KEY`). Le modèle
par défaut est `claude-sonnet-4-6` ; modifie `ANTHROPIC_MODEL` pour
utiliser autre chose (ex: `claude-opus-4-7`).

## Comment Claude édite la page

Claude ne renvoie pas du HTML. Il appelle des *tools* typés, définis dans
`lib/ai-tools.ts` :

| Tool              | Effet                                          |
|-------------------|-------------------------------------------------|
| `add_block`       | Ajoute un bloc à une position donnée           |
| `update_block`    | Fusionne des props dans un bloc existant       |
| `delete_block`    | Supprime un bloc                               |
| `move_block`      | Réordonne un bloc                              |
| `set_page_title`  | Change le titre de la page                     |

Chaque *tool call* est traduit en opération JSON par
`lib/apply-operations.ts`, puis appliqué à l'état Puck côté client. Ce
découplage rend les modifications déterministes, validables et
annulables (tu peux y brancher un `undo` trivial plus tard).

## Structure

```
editor/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Canvas Puck + panneau Claude
│   ├── globals.css
│   └── api/claude/route.ts    # Endpoint Claude (tool use + prompt caching)
├── lib/
│   ├── ai-tools.ts            # Schémas des outils + system prompt
│   └── apply-operations.ts    # Exécution des opérations sur l'état Puck
├── puck/
│   ├── config.tsx             # Bibliothèque de composants Puck
│   └── components/*.tsx
└── package.json
```

## Déploiement sur Railway

Le projet est prêt pour Railway. Deux réglages importants parce que
l'app vit dans un **sous-dossier** du repo :

1. **Nouveau service → Deploy from GitHub repo** → choisir le repo
   `cboyaltea/gama` et la branche voulue.
2. Dans les réglages du service :
   - **Root Directory** : `editor`
   - **Branch** : celle que tu veux déployer
   - **Variables** : ajouter `ANTHROPIC_API_KEY` (et optionnellement
     `ANTHROPIC_MODEL`). Railway fournit automatiquement `PORT`.
3. **Networking → Generate Domain** pour obtenir une URL publique.

Railway détecte Next.js via Nixpacks et applique `railway.json` :

- `build` : `npm run build`
- `start` : `npm run start` (écoute sur `$PORT`, bind `0.0.0.0`)
- Healthcheck sur `/`

Pour (re)déployer : `git push` sur la branche configurée, Railway
redéploie tout seul.

### Via la CLI Railway (optionnel)

```bash
npm i -g @railway/cli
railway login
railway link                # associer le projet Railway
railway up                   # build + deploy depuis le dossier courant
railway variables set ANTHROPIC_API_KEY=sk-ant-...
```

### Coûts à prévoir

Railway facture au temps d'exécution + RAM. Une app Next.js idle
consomme peu, mais vérifie ton plan ($5/mois de crédit offert sur le
plan Hobby au moment d'écrire).

## Pistes d'évolution

- **Persistance serveur** : remplacer `localStorage` par une base (Supabase,
  Postgres…), supporter plusieurs pages.
- **Publication** : ajouter une route `/sites/[slug]` qui fait le rendu
  serveur de la page à partir de ses données Puck, puis `next export` ou
  déploiement Cloudflare Pages par projet.
- **Streaming** : passer l'API Claude en `stream: true` et appliquer les
  *tool calls* au fur et à mesure pour une UX plus vivante.
- **Undo/redo** : empiler les snapshots Puck ou les listes d'opérations.
- **Multi-utilisateurs** : Yjs ou Liveblocks sur l'état Puck.
- **Vision** : permettre à l'utilisateur de déposer une image de référence,
  Claude l'analyse et reproduit la structure.
