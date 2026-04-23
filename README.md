# Groupe Gama — Site web

Site web statique pour Groupe Gama. Cinq pages HTML, une feuille de style
partagée et un script d'interactions légères (menu mobile, animations au
défilement, soumission de formulaire côté client).

## Structure

```
.
├── index.html         # Accueil
├── services.html      # Services détaillés
├── projets.html       # Portfolio de réalisations
├── a-propos.html      # Mission, vision, valeurs, historique
├── contact.html       # Formulaire et coordonnées
└── assets/
    ├── css/styles.css
    └── js/main.js
```

## Aperçu local

Aucune étape de compilation. Ouvrir `index.html` dans le navigateur, ou
lancer un serveur statique :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## À personnaliser

Le contenu actuel (textes, projets fictifs, coordonnées) est un gabarit.
Le site de référence `groupegama.ca` n'était pas accessible depuis
l'environnement de construction (restriction réseau). Remplacer les
textes, images et coordonnées par les éléments réels dès leur
disponibilité.
