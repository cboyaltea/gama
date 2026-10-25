// Données du site groupegama.ca — tout le contenu éditable est ici.
'use strict';

const SITE = 'https://groupegama.ca';
const PHONE = '514-424-7936';
const PHONE_TEL = '+15144247936';
const BRAND = 'Groupe Gama';
const UPDATED = '2026-10-25';
const WEBHOOK = 'https://hook.us1.make.com/zmffcg235snr2vmpwbsmb34f8yxkjihm';
const UMAMI = { src: 'https://umami-production-2064.up.railway.app/script.js', id: '8928bb2e-46b5-4808-9945-4415a86117fb', domains: 'groupegama.ca,www.groupegama.ca' };

// Services : clé = slug (URL), utilisée par le menu, l'accueil, le pied de page, le sitemap et le JSON-LD.
const SERVICES = {
  'livraison-urgente-montreal': {
    nav: 'Livraison urgente 24/7',
    title: 'Livraison urgente 24/7 à Montréal, Laval et Rive-Sud | Groupe Gama',
    meta: 'Coursier et livraison urgente 24 h/24, 7 j/7 à Montréal, Laval, Rive-Nord et Rive-Sud, fins de semaine et jours fériés compris. Colis, palettes et marchandises. Devis gratuit : 514-424-7936.',
    h1: 'Livraison urgente 24/24 et 7/7',
    lead: 'Le transport sur mesure, partout au Québec, à la vitesse de vos besoins — fins de semaine et jours fériés compris.',
    image: 'camion-route', imageAlt: 'Camion de livraison Groupe Gama en route sur une route du Québec',
    service: 'Livraison urgente',
    icon: 'bolt',
    intro: 'Une pièce de rechange qui bloque une chaîne de production, un document à remettre avant la fermeture, une commande que votre client attend aujourd’hui : la livraison urgente de Groupe Gama prend le relais quand le délai ne se négocie pas. Nous ramassons et livrons le jour même dans le Grand Montréal, et partout au Québec selon la distance.',
    points: ['Ramassage dans l’heure dans le Grand Montréal, sur appel', 'Service le soir, la nuit, la fin de semaine et les jours fériés', 'Colis, boîtes, palettes et objets volumineux', 'Un seul chauffeur de la prise en charge à la remise, sans transbordement', 'Confirmation de livraison par téléphone ou courriel'],
    how: [['Appelez ou remplissez la demande', 'Dites-nous ce que vous expédiez, d’où et vers où. Nous confirmons le prix et l’heure de ramassage immédiatement.'], ['Nous ramassons', 'Un chauffeur Gama se présente à l’adresse indiquée avec le véhicule adapté au volume.'], ['Livraison directe', 'Votre envoi part directement vers le destinataire. Vous êtes avisé dès la remise.']],
    faq: [['Livrez-vous vraiment la fin de semaine et les jours fériés ?', 'Oui. Le service urgent fonctionne 24 heures sur 24, 7 jours sur 7, y compris les fins de semaine et les jours fériés. Un supplément peut s’appliquer hors des heures ouvrables ; il est annoncé avant la prise en charge.'], ['Quel est le délai pour une livraison le jour même ?', 'Dans le Grand Montréal, un ramassage se fait généralement dans l’heure suivant l’appel et la livraison dans les heures qui suivent, selon la distance et la circulation. Pour le reste du Québec, nous confirmons un créneau au moment de la demande.'], ['Quel type d’objets pouvez-vous transporter en urgence ?', 'Des documents et colis jusqu’aux palettes et objets volumineux. Décrivez-nous les dimensions et le poids : nous envoyons le véhicule qui convient.'], ['Comment est calculé le prix ?', 'Selon la distance, le volume et l’heure du service. Le prix est confirmé avant le ramassage : pas de surprise à l’arrivée.']],
    related: ['livraison-lendemain-quebec', 'livraison-grand-montreal', 'livraison-marque-blanche'],
  },
  'livraison-lendemain-quebec': {
    nav: 'Livraison dès le lendemain',
    title: 'Livraison dès le lendemain (J+1 AM/PM) au Québec | Groupe Gama',
    meta: 'Livraison garantie dès le lendemain, en matinée ou en après-midi, partout au Québec depuis Montréal. Colis et palettes, tournées régulières pour entreprises. Devis gratuit : 514-424-7936.',
    h1: 'Livraison dès le lendemain, AM ou PM',
    lead: 'La prise en charge de vos envois avec l’assurance d’une livraison à J+1, en matinée ou en après-midi.',
    image: 'livraison-colis', imageAlt: 'Remise d’un colis en main propre par un livreur Groupe Gama',
    service: 'Livraison',
    icon: 'calendar',
    intro: 'Pour les envois qui ne sont pas urgents mais qui doivent arriver à une heure précise, notre service J+1 offre le meilleur rapport délai-prix. Vous nous confiez vos colis ou vos palettes aujourd’hui ; nous les livrons demain, dans la plage horaire choisie : avant midi ou en après-midi.',
    points: ['Livraison le lendemain, plage AM (avant 12 h) ou PM (12 h à 17 h)', 'Partout au Québec depuis le Grand Montréal', 'Tournées régulières pour les commerces et distributeurs', 'Livraison sur palette avec transpalette ou hayon selon le lieu', 'Preuve de livraison disponible sur demande'],
    how: [['Planifiez avant 16 h', 'Transmettez votre demande la veille : nombre de colis ou de palettes, poids, adresses et plage horaire souhaitée.'], ['Ramassage le jour même', 'Nous récupérons la marchandise à votre entrepôt, commerce ou domicile en fin de journée.'], ['Livrée le lendemain', 'Votre envoi est remis dans la plage AM ou PM convenue, avec confirmation.']],
    faq: [['Quelle est l’heure limite pour une livraison le lendemain ?', 'Les demandes reçues avant 16 h sont généralement ramassées le jour même et livrées le lendemain. Après cette heure, contactez-nous : il reste souvent de la place.'], ['Livrez-vous à l’extérieur de Montréal ?', 'Oui, partout au Québec. Le délai J+1 s’applique à la majorité des destinations ; pour les régions éloignées, nous confirmons la date au moment de la demande.'], ['Pouvez-vous faire des livraisons récurrentes pour mon entreprise ?', 'Oui. Beaucoup de nos clients commerciaux nous confient une tournée fixe, quotidienne ou hebdomadaire, à un tarif convenu. Parlez-nous de vos volumes.'], ['Acceptez-vous les palettes ?', 'Oui, les palettes standards et hors format. Indiquez si le lieu de livraison dispose d’un quai ; sinon nous venons avec un hayon.']],
    related: ['livraison-urgente-montreal', 'livraison-grand-montreal', 'manutention-dechargement-conteneurs'],
  },
  'demenagement-montreal': {
    nav: 'Déménagement',
    title: 'Déménagement à Montréal, Laval et Rive-Sud, fin de semaine | Groupe Gama',
    meta: 'Déménagement résidentiel et commercial la fin de semaine à Montréal, Laval, Rive-Nord et Rive-Sud : camion équipé, essence et kilométrage inclus, assurance complète, couvertures et tapis protecteurs. Devis gratuit.',
    h1: 'Service de déménagement',
    lead: 'Une équipe de déménageurs professionnels, un camion équipé, l’essence et le kilométrage inclus — la fin de semaine, quand vous êtes disponible.',
    image: 'demenagement', imageAlt: 'Deux déménageurs Groupe Gama transportant un réfrigérateur dans une maison',
    service: 'Déménagement',
    icon: 'home',
    intro: 'Groupe Gama offre un service de déménagement la fin de semaine seulement, pensé pour les particuliers et les petites entreprises qui veulent un prix clair et une équipe soigneuse. Le camion arrive équipé : couvertures de protection pour les meubles, tapis protecteurs pour vos planchers, diables, sangles. L’essence, le kilométrage et une assurance complète sont inclus dans le prix annoncé.',
    points: ['Fin de semaine seulement : samedi et dimanche', 'Camions équipés (couvertures, sangles, diables, tapis protecteurs)', 'Essence (diesel) et kilométrage inclus', 'Assurance complète pendant le transport', 'Couverture protectrice pour tous les meubles et électroménagers', 'Démontage et remontage de mobilier sur demande'],
    how: [['Décrivez votre logement', 'Nombre de pièces, étages aux deux adresses, présence d’ascenseur, objets lourds (piano, réfrigérateur, coffre-fort) et besoin d’emballage.'], ['Recevez votre soumission', 'Nous vous proposons un prix et une plage horaire pour le samedi ou le dimanche choisi.'], ['Jour J', 'L’équipe protège les planchers, emballe les meubles, charge, transporte et réinstalle chez vous.']],
    faq: [['Pourquoi seulement la fin de semaine ?', 'Nos camions et nos équipes sont consacrés à la livraison commerciale du lundi au vendredi. Le samedi et le dimanche, ils sont disponibles pour les déménagements, ce qui nous permet d’offrir des prix tout inclus.'], ['Qu’est-ce qui est inclus dans le prix ?', 'Le camion équipé, l’équipe de déménageurs, le diesel et le kilométrage, l’assurance complète, les couvertures de protection et les tapis pour les planchers. Les boîtes et le service d’emballage sont offerts en option.'], ['Déménagez-vous les appartements sans ascenseur ?', 'Oui. Indiquez le nombre d’étages aux deux adresses dans votre demande : il entre dans le calcul du temps et du prix.'], ['Faites-vous les déménagements commerciaux ?', 'Oui, bureaux et commerces la fin de semaine, ce qui évite d’interrompre vos activités en semaine.'], ['Quels secteurs couvrez-vous ?', 'L’île de Montréal, Laval, la Rive-Nord (Terrebonne, Boisbriand, Blainville…) et la Rive-Sud (Longueuil, Brossard, Saint-Hubert…), ainsi que les déménagements longue distance au Québec sur demande.']],
    related: ['manutention-dechargement-conteneurs', 'livraison-grand-montreal', 'livraison-urgente-montreal'],
  },
  'manutention-dechargement-conteneurs': {
    nav: 'Manutention et conteneurs',
    title: 'Manutention, déchargement de conteneurs et tri à Montréal | Groupe Gama',
    meta: 'Équipe de manutentionnaires pour le déchargement de conteneurs, la palettisation et le tri de marchandises à Montréal, Laval et Rive-Sud, même la fin de semaine. Service rapide et fiable, devis gratuit.',
    h1: 'Service de manutention',
    lead: 'Déchargement de conteneurs, palettisation, tri de vos produits : une équipe rapide et fiable, le jour voulu, y compris la fin de semaine.',
    image: 'entrepot-aerien', imageAlt: 'Vue aérienne d’un entrepôt et de ses quais de chargement',
    service: 'Manutention',
    icon: 'boxes',
    intro: 'Un conteneur de 40 pieds arrive à votre entrepôt et il faut le vider avant que le camionneur reparte ? Une commande importante doit être triée et étiquetée avant expédition ? Groupe Gama met à votre disposition des manutentionnaires expérimentés, en nombre suffisant, pour le temps nécessaire. Nous travaillons en vrac comme sur palettes, avec soin et au rythme que vos délais imposent.',
    points: ['Déchargement et chargement de conteneurs 20 et 40 pieds, en vrac ou palettisés', 'Palettisation, filmage et étiquetage', 'Tri et préparation de commandes', 'Équipe dimensionnée selon le volume : 2 à 10 personnes', 'Disponible la fin de semaine et les jours fériés', 'Transport des palettes vers vos clients dans la foulée si nécessaire'],
    how: [['Décrivez le travail', 'Type de produits, taille et poids, volume approximatif, lieu, date et heure d’arrivée du conteneur.'], ['Nous confirmons l’équipe', 'Nombre de personnes, durée estimée et prix ; nous apportons transpalettes et matériel de filmage au besoin.'], ['Travail fait, dans les temps', 'Conteneur vidé, marchandise rangée ou palettisée, et transport organisé si vous le souhaitez.']],
    faq: [['Combien de temps pour décharger un conteneur de 40 pieds ?', 'En vrac, comptez généralement de 2 à 4 heures avec une équipe de 3 à 4 personnes, selon le type de marchandise. Palettisé, c’est plus rapide. Nous ajustons la taille de l’équipe à votre fenêtre de déchargement.'], ['Fournissez-vous les palettes et le film ?', 'Oui, sur demande. Précisez-le dans votre soumission.'], ['Pouvez-vous intervenir à court préavis ?', 'Souvent, oui — y compris la fin de semaine. Appelez-nous dès que vous connaissez l’heure d’arrivée du conteneur.'], ['Travaillez-vous dans les entrepôts de la Rive-Sud et de Laval ?', 'Oui, dans tous les secteurs industriels du Grand Montréal : Montréal-Est, Anjou, Saint-Laurent, Dorval, Laval, Boucherville, Longueuil, Vaudreuil et les environs.']],
    related: ['livraison-lendemain-quebec', 'demenagement-montreal', 'livraison-marque-blanche'],
    testimonial: true,
  },
  'livraison-marque-blanche': {
    nav: 'Livraison en marque blanche',
    title: 'Livraison en marque blanche pour commerces et e-commerce | Groupe Gama',
    meta: 'Nous livrons sous votre nom : service de livraison en marque blanche pour commerçants, boutiques en ligne et distributeurs du Grand Montréal. Dernier kilomètre, tournées régulières, devis gratuit.',
    h1: 'Livraison en marque blanche',
    lead: 'Votre partenaire de livraison. Nous livrons sous votre nom.',
    image: 'livraison-colis', imageAlt: 'Livreur remettant un colis au client d’un commerçant',
    service: 'Livraison',
    icon: 'tag',
    intro: 'Vos clients connaissent votre marque, pas celle de votre transporteur. Avec la livraison en marque blanche, Groupe Gama devient votre service de livraison : nos chauffeurs se présentent au nom de votre entreprise, suivent vos consignes de remise et vous rapportent les signatures et les retours. Vous offrez la livraison locale sans acheter de camion ni embaucher de chauffeur.',
    points: ['Chauffeurs qui se présentent au nom de votre entreprise', 'Dernier kilomètre pour boutiques en ligne, magasins et distributeurs', 'Tournées fixes ou à la demande, le jour même ou le lendemain', 'Gestion des retours et des échanges', 'Livraison d’électroménagers et de meubles avec installation de base sur demande', 'Facturation mensuelle simple'],
    how: [['Définissons votre service', 'Zones, délais promis à vos clients, consignes de remise, volume hebdomadaire.'], ['Nous intégrons vos commandes', 'Transmission par courriel, fichier ou plateforme : nous planifions les tournées.'], ['Vos clients sont livrés', 'Par un chauffeur Gama qui représente votre marque, avec confirmation de chaque remise.']],
    faq: [['Qu’est-ce que la livraison en marque blanche ?', 'C’est un service où le transporteur livre au nom du commerçant : le client final ne voit que votre marque. Nous nous occupons de la logistique, vous gardez la relation client.'], ['Quel volume minimal faut-il ?', 'Il n’y a pas de minimum strict. Les tournées fixes deviennent avantageuses à partir de quelques livraisons par jour ; en dessous, le service à la demande convient.'], ['Livrez-vous les gros articles (meubles, électroménagers) ?', 'Oui, avec deux personnes et le matériel de protection. L’installation de base (mise en place, raccordement simple) peut être ajoutée.'], ['Comment sont gérés les retours ?', 'Le chauffeur reprend l’article selon vos consignes et le ramène à votre entrepôt ou magasin lors de la tournée.']],
    related: ['livraison-lendemain-quebec', 'livraison-urgente-montreal', 'distribution-publicitaire-montreal'],
  },
  'distribution-publicitaire-montreal': {
    nav: 'Distribution publicitaire',
    title: 'Distribution de circulaires et publicités locales à Montréal | Groupe Gama',
    meta: 'Distribution de circulaires, dépliants et échantillons porte-à-porte ou en commerces à Montréal, Laval, Rive-Nord et Rive-Sud. Ciblage par quartier, rapport de distribution. Devis gratuit.',
    h1: 'Service de distribution',
    lead: 'Nous distribuons vos publicités localement, directement à vos clients.',
    image: 'hero-montreal', imageAlt: 'Vue de Montréal depuis le mont Royal',
    service: 'Distribution',
    icon: 'map',
    intro: 'Pour une ouverture de commerce, une promotion de quartier ou le lancement d’un service, rien ne remplace un message déposé entre les mains des gens que vous voulez joindre. Groupe Gama distribue vos circulaires, dépliants, cartes et échantillons dans les secteurs que vous choisissez — quartier par quartier, rue par rue — et vous confirme la distribution.',
    points: ['Porte-à-porte résidentiel par quartier ou code postal', 'Distribution en commerces, bureaux et immeubles', 'Échantillons et petits objets promotionnels', 'Rapport de distribution avec secteurs couverts et dates', 'Grand Montréal, Laval, Rive-Nord et Rive-Sud'],
    how: [['Choisissez vos secteurs', 'Donnez-nous les quartiers, les codes postaux ou un rayon autour de votre commerce, et la quantité à distribuer.'], ['Nous planifions', 'Nous confirmons le prix, le calendrier et récupérons votre matériel chez vous ou chez l’imprimeur.'], ['Distribution confirmée', 'Vos documents sont distribués et vous recevez un rapport des secteurs couverts.']],
    faq: [['Quelle quantité minimale ?', 'Nous acceptons les petites campagnes de quartier (quelques centaines de pièces) comme les distributions de plusieurs dizaines de milliers d’exemplaires.'], ['Pouvez-vous cibler des types de logements ?', 'Oui : maisons unifamiliales, immeubles à logements, commerces ou bureaux, selon la clientèle visée.'], ['Comment savoir que la distribution a bien été faite ?', 'Chaque campagne se termine par un rapport indiquant les secteurs et les dates de distribution. Des photos peuvent être fournies sur demande.'], ['Faites-vous aussi l’impression ?', 'Non, nous nous concentrons sur la distribution. Nous ramassons volontiers le matériel chez votre imprimeur.']],
    related: ['livraison-marque-blanche', 'livraison-grand-montreal', 'livraison-lendemain-quebec'],
  },
};

// Zones de livraison : les trois URL existantes (à conserver telles quelles, elles sont référencées).
const ZONES = {
  'livraison-grand-montreal': {
    nav: 'Grand Montréal',
    title: 'Livraison Grand Montréal : express, planifiée et sur palette | Groupe Gama',
    meta: 'Service de livraison dans le Grand Montréal : coursier express en quelques heures, livraison planifiée et transport de palettes. Île de Montréal, Laval, Longueuil, Brossard. Devis gratuit : 514-424-7936.',
    h1: 'Livraison Grand Montréal',
    lead: 'Simple, rapide, fiable, partout en ville, sur la Rive-Sud et la Rive-Nord — au meilleur prix.',
    image: 'hero-montreal', imageAlt: 'Centre-ville de Montréal vu du mont Royal',
    area: 'dans le Grand Montréal',
    cities: ['Montréal (tous les arrondissements)', 'Westmount', 'Mont-Royal', 'Côte-Saint-Luc', 'Hampstead', 'Montréal-Est', 'Anjou', 'Saint-Léonard', 'Saint-Laurent', 'Lachine', 'LaSalle', 'Verdun', 'Dorval', 'Pointe-Claire', 'Kirkland', 'Beaconsfield', 'Dollard-des-Ormeaux', 'Pierrefonds-Roxboro', 'Sainte-Anne-de-Bellevue', 'Laval', 'Longueuil', 'Brossard'],
    zoneText: 'Nous couvrons l’ensemble de l’île de Montréal, Laval, Longueuil, Brossard et la Rive-Nord. Notre service s’étend aussi à la Rive-Sud et aux secteurs industriels. Contactez-nous pour tout besoin particulier : nous évaluons chaque demande pour répondre à toutes les situations logistiques de la région métropolitaine.',
    faq: [['Combien coûte une livraison à Montréal ?', 'Le prix dépend de la distance, du volume et du délai (express ou planifié). Il est confirmé avant le ramassage. Pour les envois réguliers, nous proposons un tarif convenu.'], ['En combien de temps pouvez-vous livrer sur l’île de Montréal ?', 'En express, un coursier ramasse généralement dans l’heure et livre dans les heures qui suivent. En planifié, vous choisissez le créneau, le jour même ou le lendemain.'], ['Livrez-vous les palettes en ville ?', 'Oui, avec hayon et transpalette pour les adresses sans quai de chargement.'], ['Travaillez-vous avec les commerces et les entreprises ?', 'C’est le cœur de notre activité : distributeurs, commerces, boutiques en ligne, ateliers et bureaux du Grand Montréal, en tournées régulières ou à la demande.']],
    related: ['livraison-rive-nord-montreal', 'livraison-rive-sud-montreal'],
  },
  'livraison-rive-nord-montreal': {
    nav: 'Rive-Nord',
    title: 'Livraison Rive-Nord de Montréal : Laval, Terrebonne, Boisbriand | Groupe Gama',
    meta: 'Livraison express, planifiée et sur palette sur la Rive-Nord de Montréal : Laval, Terrebonne, Boisbriand, Blainville, Mascouche, Repentigny, Saint-Eustache, Mirabel. Coursiers 7 jours sur 7. Devis gratuit.',
    h1: 'Livraison Rive-Nord de Montréal',
    lead: 'Laval, Terrebonne, Boisbriand, Blainville, Repentigny : nos coursiers couvrent toute la couronne nord, 7 jours sur 7.',
    image: 'camion-route', imageAlt: 'Camion Groupe Gama roulant vers la Rive-Nord',
    area: 'sur la Rive-Nord de Montréal',
    cities: ['Laval', 'Terrebonne', 'Mascouche', 'Repentigny', 'L’Assomption', 'Boisbriand', 'Sainte-Thérèse', 'Blainville', 'Rosemère', 'Lorraine', 'Bois-des-Filion', 'Saint-Eustache', 'Deux-Montagnes', 'Mirabel', 'Saint-Jérôme', 'Charlemagne'],
    zoneText: 'Depuis Laval jusqu’à Saint-Jérôme et de Mirabel à Repentigny, nous livrons dans toutes les villes de la Rive-Nord, y compris les parcs industriels de Boisbriand, Blainville, Terrebonne et Mirabel. Les livraisons entre la Rive-Nord et l’île de Montréal ou la Rive-Sud se font dans la même journée.',
    faq: [['Livrez-vous entre la Rive-Nord et Montréal le jour même ?', 'Oui. La traversée des ponts fait partie de notre quotidien ; en express, une livraison Laval–Montréal ou Terrebonne–Montréal se fait dans la journée.'], ['Couvrez-vous Saint-Jérôme et Mirabel ?', 'Oui, ainsi que les villes des Laurentides plus au nord sur demande, en planifié ou en J+1.'], ['Faites-vous le déménagement sur la Rive-Nord ?', 'Oui, la fin de semaine, avec camion équipé, essence et kilométrage inclus. Voir notre page déménagement.'], ['Pouvez-vous décharger un conteneur dans un entrepôt de Boisbriand ou de Terrebonne ?', 'Oui, notre équipe de manutention se déplace dans tous les parcs industriels de la Rive-Nord.']],
    related: ['livraison-grand-montreal', 'livraison-rive-sud-montreal'],
  },
  'livraison-rive-sud-montreal': {
    nav: 'Rive-Sud',
    title: 'Livraison Rive-Sud de Montréal : Longueuil, Brossard, Boucherville | Groupe Gama',
    meta: 'Livraison express, planifiée et sur palette sur la Rive-Sud de Montréal : Longueuil, Brossard, Boucherville, Saint-Hubert, La Prairie, Châteauguay, Saint-Jean-sur-Richelieu. Coursiers 7 jours sur 7. Devis gratuit.',
    h1: 'Livraison Rive-Sud de Montréal',
    lead: 'Longueuil, Brossard, Boucherville, Saint-Hubert, La Prairie : nos coursiers couvrent toute la couronne sud, 7 jours sur 7.',
    image: 'entrepot-aerien', imageAlt: 'Vue aérienne d’un parc industriel de la Rive-Sud',
    area: 'sur la Rive-Sud de Montréal',
    cities: ['Longueuil', 'Saint-Hubert', 'Greenfield Park', 'Brossard', 'Saint-Lambert', 'Boucherville', 'Varennes', 'Sainte-Julie', 'Saint-Bruno-de-Montarville', 'La Prairie', 'Candiac', 'Delson', 'Saint-Constant', 'Châteauguay', 'Chambly', 'Beloeil', 'Saint-Jean-sur-Richelieu'],
    zoneText: 'De Châteauguay à Varennes et de Saint-Lambert à Saint-Jean-sur-Richelieu, nous livrons dans toutes les villes de la Rive-Sud, y compris les secteurs industriels de Boucherville, Longueuil, Saint-Hubert et Candiac. Les livraisons entre la Rive-Sud et l’île de Montréal ou la Rive-Nord se font dans la même journée.',
    faq: [['Livrez-vous entre la Rive-Sud et Montréal le jour même ?', 'Oui. En express, une livraison Brossard–Montréal ou Boucherville–Laval se fait dans la journée, ponts compris.'], ['Couvrez-vous Saint-Jean-sur-Richelieu et Châteauguay ?', 'Oui, ainsi que la Montérégie plus au sud ou à l’est sur demande, en planifié ou en J+1.'], ['Faites-vous le déménagement sur la Rive-Sud ?', 'Oui, la fin de semaine, avec camion équipé, essence et kilométrage inclus. Voir notre page déménagement.'], ['Pouvez-vous décharger un conteneur dans un entrepôt de Boucherville ?', 'Oui, notre équipe de manutention se déplace dans tous les parcs industriels de la Rive-Sud.']],
    related: ['livraison-grand-montreal', 'livraison-rive-nord-montreal'],
  },
};

const ZONE_SERVICES = [
  ['Livraison express', 'Nos coursiers livrent vos colis en quelques heures, 7 jours sur 7.', 'livraison-urgente-montreal'],
  ['Livraison planifiée', 'Choisissez le créneau qui vous convient pour vos envois : le jour même ou le lendemain, AM ou PM.', 'livraison-lendemain-quebec'],
  ['Livraison sur palette', 'Nous déplaçons vos palettes partout au Québec, avec hayon et transpalette si besoin.', 'livraison-lendemain-quebec'],
];

const HOME = {
  title: 'Livraison, déménagement et manutention à Montréal, Laval, Rive-Sud | Groupe Gama',
  meta: 'Groupe Gama : livraison urgente 24/7, livraison dès le lendemain, déménagement la fin de semaine, déchargement de conteneurs et livraison en marque blanche à Montréal, Laval, Rive-Nord et Rive-Sud. 25 ans d’expérience. Devis gratuit : 514-424-7936.',
  kicker: 'Depuis plus de 25 ans au Québec',
  h1: 'La maîtrise de la livraison, du tri à la distribution.',
  lead: 'Livraison, distribution, déménagement et manutention partout au Québec : une équipe réactive, disponible 24 h/24 et 7 j/7, qui s’adapte à vos contraintes.',
  stats: [['25+', 'ans d’expérience'], ['24/7', 'livraison urgente'], ['J+1', 'livraison AM ou PM garantie'], ['7/7', 'y compris jours fériés']],
  whyTitle: 'Fiabilité et expertise',
  whyLead: 'Dans un monde où la rapidité et la flexibilité sont devenues incontournables, choisir une logistique performante est une nécessité. Groupe Gama est votre partenaire de confiance, réactif et expérimenté, capable de s’adapter à vos contraintes les plus spécifiques sur l’ensemble du Québec.',
  why: [['Un seul interlocuteur', 'Vous parlez à quelqu’un qui connaît votre dossier et qui peut décider : prix, horaire, véhicule.'], ['Des délais tenus', 'Express dans l’heure, J+1 en matinée ou en après-midi : le délai annoncé est le délai livré.'], ['Soin de la marchandise', 'Couvertures, sangles, tapis protecteurs, transpalettes : le matériel voyage avec nous.'], ['Prix confirmé avant le départ', 'Le prix est établi selon la distance, le volume et le délai, et confirmé avant la prise en charge.']],
  testimonial: { quote: 'Un service rapide et efficace. L’équipe de Gama est toujours disponible pour notre besoin de déchargement de conteneurs, même les fins de semaine !', author: 'C. Boy', org: 'Kanartic' },
  faq: [
    ['Quels sont vos tarifs de déménagement ?', 'Nos tarifs varient selon la distance, le volume, le nombre d’étages et la date. Le camion équipé, l’essence, le kilométrage et l’assurance sont inclus. Demandez une soumission gratuite : nous répondons rapidement.'],
    ['Couvrez-vous tout le Québec ?', 'Oui. Nous desservons la grande région de Montréal au quotidien (île de Montréal, Laval, Rive-Nord, Rive-Sud) et nous livrons partout au Québec en planifié ou dès le lendemain.'],
    ['Proposez-vous un devis gratuit ?', 'Absolument. Remplissez le formulaire de demande ou appelez-nous au 514-424-7936 : la soumission est gratuite et sans engagement.'],
    ['Livrez-vous la fin de semaine et les jours fériés ?', 'Oui, 24 heures sur 24 et 7 jours sur 7 pour la livraison urgente. Le déménagement se fait justement la fin de semaine.'],
    ['Faites-vous le déchargement de conteneurs ?', 'Oui : déchargement et chargement de conteneurs 20 et 40 pieds, palettisation et tri, à Montréal, Laval et sur les deux rives, même la fin de semaine.'],
  ],
};

const FORM = {
  title: 'Demande de soumission',
  meta: 'Demandez une soumission gratuite pour une livraison, un déménagement ou un service de manutention à Montréal, Laval, Rive-Nord ou Rive-Sud. Réponse rapide, 7 jours sur 7.',
  h1: 'Que pouvons-nous faire pour vous ?',
  lead: 'Décrivez votre besoin : nous vous répondons rapidement avec un prix et une date. Pour une urgence, appelez directement le ' + PHONE + '.',
  services: ['Livraison', 'Livraison Rapide', 'Déménagement', 'Manutention'],
};

module.exports = { SITE, PHONE, PHONE_TEL, BRAND, UPDATED, WEBHOOK, UMAMI, SERVICES, ZONES, ZONE_SERVICES, HOME, FORM };
