# 🏗️ Architecture Fonctionnelle - InfluenceCore
## Système Administrateur + Page d'Accueil Publique + Billing (BoxBilling)

---

## 📋 TABLE DES MATIÈRES

1. [Page d'Accueil Publique](#page-daccueil-publique)
2. [Espace Administrateur](#espace-administrateur)
3. [Module Billing (BoxBilling)](#module-billing-boxbilling)
4. [Flux Utilisateur Complet](#flux-utilisateur-complet)
5. [Vision Produit & Roadmap](#vision-produit--roadmap)

---

## 🌍 PAGE D'ACCUEIL PUBLIQUE

### Vue d'Ensemble
Page vitrine accessible sans authentification, entièrement administrable depuis l'espace ADMIN. Design moderne, responsive, optimisé pour la conversion.

### 🎨 Section Hero

**Éléments configurables (Admin) :**
- **Nom du site** : InfluenceCore (modifiable)
- **Slogan principal** : Texte personnalisable, multi-langue
- **Sous-titre** : Description courte de la plateforme
- **Image/Vidéo hero** : Upload, URL, ou vidéo YouTube/Vimeo
- **Couleur de fond** : Gradient, image, ou couleur unie
- **CTA Principal** : 
  - Texte du bouton (ex: "Démarrer gratuitement")
  - Lien (inscription, tarifs, démo)
  - Style (primaire, secondaire, outline)
- **CTA Secondaire** : 
  - Texte (ex: "Voir les tarifs")
  - Lien
- **Visibilité** : Activer/Désactiver la section

**Comportement :**
- Animation d'entrée (fade-in, slide-up)
- Responsive : image adaptative mobile/desktop
- A/B Testing possible (variantes de slogans/CTAs)

---

### 🧩 Section Services

**Structure :**
- **Titre de section** : "Nos Services" (personnalisable)
- **Sous-titre** : Description optionnelle
- **Layout** : Grille 2/3/4 colonnes (configurable)

**Service (entité) :**
- **Nom** : Ex: "Gestion de Contenu"
- **Description** : Texte court (150-200 caractères)
- **Avantages** : Liste à puces (3-5 points)
- **Icône** : 
  - Bibliothèque d'icônes intégrée
  - Upload personnalisé (SVG, PNG)
  - Emoji
- **Visuel** : Image optionnelle
- **Lien** : Vers page détail ou section
- **Badge** : "Populaire", "Nouveau", "Bientôt" (optionnel)
- **Ordre d'affichage** : Drag & drop dans l'admin
- **Statut** : Actif / Masqué

**Gestion Admin :**
- CRUD complet (Créer, Lire, Modifier, Supprimer)
- Prévisualisation en temps réel
- Duplication de service
- Templates de services prédéfinis

---

### 💰 Section Tarifs & Abonnements

**Affichage dynamique depuis le module Billing :**

**Configuration :**
- **Titre** : "Nos Tarifs" (personnalisable)
- **Sous-titre** : Ex: "Choisissez l'offre qui vous convient"
- **Layout** : 
  - 3 colonnes (recommandé)
  - 4 colonnes (si beaucoup d'offres)
  - Comparatif tableau
- **Mise en avant** : Badge "Recommandé" sur une offre

**Offre (depuis Billing) :**
- **Nom** : Ex: "Starter", "Pro", "Enterprise"
- **Prix** : 
  - Montant
  - Période (mensuel/annuel)
  - "Gratuit" ou "Sur devis"
- **Description** : Texte court
- **Fonctionnalités** : Liste à puces (limitées/illimitées)
- **CTA** : "Commencer" / "S'abonner" / "Contacter"
- **Badge** : "Populaire", "Meilleure valeur", "Nouveau"
- **Promotion active** : Affichage du code promo ou réduction

**Types d'offres :**
1. **Gratuit** : Essai ou version limitée permanente
2. **Mensuel** : Abonnement récurrent mensuel
3. **Annuel** : Abonnement récurrent annuel (avec réduction)
4. **Sur devis** : Contact commercial

**Comportement :**
- Tri automatique par prix (croissant)
- Filtre par type (gratuit, payant, sur devis)
- Comparateur visuel (tableau comparatif)
- Calcul automatique économies annuel vs mensuel

---

### 📦 Section Offres & Packs

**Packs prédéfinis :**

**1. Pack Créateurs**
- Cible : Influenceurs individuels
- Services inclus : Liste depuis Billing
- Limites : Nombre de projets, stockage, etc.
- Prix : Depuis Billing

**2. Pack Managers**
- Cible : Gestionnaires de plusieurs créateurs
- Services inclus : Multi-utilisateurs, analytics avancés
- Limites : Plus élevées
- Prix : Depuis Billing

**3. Pack Agences / Réseaux**
- Cible : Agences, MCNs
- Services inclus : API, white-label, support prioritaire
- Limites : Illimitées ou très élevées
- Prix : Sur devis ou tarif dégressif

**Affichage :**
- Tableau comparatif visuel
- Colonnes : Fonctionnalités vs Packs
- Cases cochées/croix pour chaque fonctionnalité
- Mise en avant du pack recommandé

---

### 📞 Section Contact & Infos

**Sous-sections :**

**1. Présentation rapide**
- Texte éditable (markdown supporté)
- Image optionnelle
- Lien vers "En savoir plus"

**2. Contact**
- Formulaire de contact (nom, email, message)
- Email de destination (configurable admin)
- Notifications admin
- Auto-réponse optionnelle

**3. FAQ**
- Questions/Réponses éditable depuis admin
- Catégories : Général, Tarifs, Technique, Facturation
- Recherche dans FAQ
- Accordéon ou liste

**4. Mentions légales**
- Page dédiée ou modal
- Contenu éditable (RGPD, CGV, CGU)
- Date de dernière mise à jour

**5. Réseaux sociaux**
- Liens configurables (Facebook, Twitter, LinkedIn, etc.)
- Icônes avec liens
- Ordre personnalisable

---

### 🎛️ Gestion Admin de la Page d'Accueil

**Interface CMS :**

**1. Éditeur visuel**
- WYSIWYG pour sections texte
- Upload d'images avec redimensionnement automatique
- Gestionnaire de médias
- Prévisualisation mobile/tablette/desktop

**2. Activation / Masquage**
- Toggle par section (Hero, Services, Tarifs, etc.)
- Ordre des sections (drag & drop)
- Conditions d'affichage (ex: masquer tarifs si pas d'offres)

**3. Prévisualisation**
- Mode brouillon vs publié
- Prévisualisation avant publication
- Historique des versions
- Restauration d'une version précédente

**4. Versioning**
- Sauvegarde automatique à chaque modification
- Historique avec dates et auteur
- Comparaison entre versions
- Notes de version (changelog)

**5. SEO & Métadonnées**
- Meta title, description
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Schema.org markup
- Sitemap automatique

**6. Analytics intégrés**
- Taux de clic par CTA
- Scroll depth (profondeur de scroll)
- Temps sur page
- Taux de conversion (visiteur → inscription)

---

## 🎛️ ESPACE ADMINISTRATEUR

### Vue d'Ensemble
Dashboard centralisé pour gérer toute la plateforme : utilisateurs, contenu, billing, analytics, sécurité.

### 📊 Tableau de Bord Principal

**Métriques clés (widgets) :**
- **Utilisateurs actifs** : MAU, DAU
- **Abonnements** : Actifs, nouveaux, annulés
- **Revenus** : MRR, ARR, ce mois, ce jour
- **Taux de conversion** : Visiteur → Inscription → Abonnement
- **Taux de rétention** : Churn rate
- **Paiements** : Réussis, échoués, en attente
- **Support** : Tickets ouverts, résolus

**Graphiques :**
- Évolution MRR (6 derniers mois)
- Nouveaux abonnements (timeline)
- Répartition par plan
- Top services utilisés
- Carte géographique des utilisateurs

**Actions rapides :**
- Créer un utilisateur
- Créer une offre
- Créer une promotion
- Voir les alertes
- Accéder aux logs

---

### 🛠️ Gestion de la Page d'Accueil (CMS)

**Voir section précédente "Gestion Admin de la Page d'Accueil"**

**Fonctionnalités supplémentaires :**
- **Templates** : Modèles prédéfinis de page d'accueil
- **A/B Testing** : Tester différentes versions
- **Multilingue** : Gestion de plusieurs langues
- **Thèmes** : Changer le thème visuel (couleurs, polices)

---

### 👥 Gestion des Utilisateurs

**Liste des utilisateurs :**
- Filtres : Rôle, Statut, Plan, Date d'inscription
- Recherche : Nom, email, ID
- Tri : Par date, nom, revenus générés
- Export : CSV, Excel

**Détails utilisateur :**
- **Profil** : Nom, email, téléphone, avatar
- **Rôle** : Admin, Manager, Créateur
- **Permissions** : Granulaires par fonctionnalité
- **Abonnement** : Plan actuel, statut, dates
- **Historique** : Paiements, factures, actions
- **Logs** : Connexions, actions importantes
- **Support** : Tickets associés

**Actions admin :**
- Créer un utilisateur
- Modifier le profil
- Changer le rôle/permissions
- Suspendre/Réactiver
- Supprimer (avec confirmation)
- Réinitialiser le mot de passe
- Envoyer un email
- Forcer la connexion (impersonation)

**Rôles & Permissions :**
- **Admin** : Accès total
- **Manager** : Gestion équipe, analytics, billing limité
- **Créateur** : Accès à ses propres données
- **Support** : Accès support uniquement
- Permissions personnalisables par fonctionnalité

---

### 🔐 Sécurité & Conformité

**Logs de connexion :**
- Date/heure
- IP
- User-Agent
- Statut (succès/échec)
- Localisation (géolocalisation IP)
- Export CSV

**Alertes activités suspectes :**
- Tentatives de connexion multiples échouées
- Connexions depuis IP inhabituelle
- Changements de mot de passe
- Modifications sensibles (billing, permissions)
- Notifications email/SMS en temps réel

**Sauvegardes :**
- Automatiques (quotidiennes)
- Manuelles (à la demande)
- Rétention : 30 jours (configurable)
- Restauration : Point dans le temps
- Export complet (base de données + fichiers)

**RGPD :**
- Consentement cookies
- Droit à l'oubli (suppression données)
- Export données utilisateur
- Anonymisation automatique après X jours
- Journalisation des consentements

---

### 🧠 IA & Optimisation

**Analyse du tunnel de conversion :**
- **Étape 1** : Visiteur → Inscription
  - Taux de conversion
  - Points de friction identifiés
  - Suggestions d'amélioration
- **Étape 2** : Inscription → Abonnement
  - Taux de conversion
  - Temps moyen avant abonnement
  - Offres les plus converties
- **Étape 3** : Abonnement → Renouvellement
  - Taux de rétention
  - Raisons d'annulation
  - Opportunités de upsell

**Suggestions automatiques :**
- **Prix** : Analyse concurrentielle, élasticité prix
- **Offres** : Gaps dans l'offre, demandes utilisateurs
- **Promotions** : Timing optimal, montant optimal
- **Contenu** : Optimisation page d'accueil

**Alertes intelligentes :**
- Baisse de conversion (> 10% sur 7 jours)
- Hausse échecs paiement (> 5%)
- Pic d'annulations
- Opportunité d'upsell (utilisateur proche limite)

---

## 💳 MODULE BILLING (BASÉ SUR BoxBilling)

### Architecture Générale

Le système reprend la logique fonctionnelle de BoxBilling, adaptée à InfluenceCore :
- Gestion complète des offres/plans
- Abonnements récurrents
- Facturation automatique
- Promotions & codes promo
- Paiements multi-gateways
- Gestion des impayés

---

### 📊 Tableau de Bord Paiements

**Métriques financières :**

**Revenus :**
- **MRR** (Monthly Recurring Revenue) : Revenus récurrents mensuels
- **ARR** (Annual Recurring Revenue) : MRR × 12
- **Revenus totaux** : MRR + one-time
- **Projection** : Prévision sur 12 mois
- **Croissance** : % vs mois précédent

**Paiements :**
- **Réussis** : Nombre, montant, ce mois/année
- **Échoués** : Nombre, montant, raisons
- **En attente** : Paiements en cours
- **Remboursés** : Nombre, montant

**Impayés :**
- Nombre d'abonnements en retard
- Montant total dû
- Délai moyen de retard
- Actions à prendre (relances)

**Répartition :**
- Par offre/plan (graphique camembert)
- Par période (mensuel vs annuel)
- Par gateway (Stripe, PayPal, etc.)
- Par pays/région

**Graphiques :**
- Évolution MRR (timeline)
- Paiements réussis/échoués (timeline)
- Top offres (revenus générés)
- Prévision vs réel

---

### 🧾 Facturation

**Types de factures :**

**1. Factures one-time**
- Paiement unique
- Ex: Achat de crédits, service ponctuel
- Génération immédiate

**2. Factures récurrentes**
- Abonnement mensuel/annuel
- Génération automatique à la date d'échéance
- Renouvellement automatique

**3. Factures manuelles**
- Créées par admin
- Montant personnalisé
- Description libre

**Statuts :**
- **Brouillon** : En cours de création
- **Envoyée** : Email envoyé au client
- **Payée** : Paiement reçu
- **En retard** : Date d'échéance dépassée
- **Annulée** : Facture annulée
- **Remboursée** : Remboursement effectué

**Génération automatique :**
- **Cron job** : Vérification quotidienne des échéances
- **X jours avant échéance** : Facture générée (ex: 7 jours)
- **Email automatique** : Envoi au client
- **Rappel** : Si non payée après X jours

**Contenu facture :**
- En-tête : Logo, informations entreprise
- Client : Nom, adresse, email
- Détails : Services, période, montant
- Taxes : TVA si applicable
- Total : HT, TTC
- Conditions : Paiement, échéance
- QR Code : Pour paiement mobile

**Avoirs / Crédits :**
- Crédit client : Solde disponible
- Application automatique : Sur prochaine facture
- Création manuelle : Par admin (remboursement partiel)
- Historique : Tous les crédits/débits

**Export :**
- **CSV** : Liste des factures
- **PDF** : Facture individuelle ou batch
- **Excel** : Avec formules (totaux, etc.)

---

### 🔁 Gestion des Abonnements

**Plans disponibles :**

**1. Gratuit**
- Aucun paiement
- Fonctionnalités limitées
- Durée : Illimitée ou limitée (essai)

**2. Essai**
- Gratuit pendant X jours
- Conversion automatique en payant après essai
- Notification avant fin d'essai

**3. Mensuel**
- Paiement récurrent mensuel
- Renouvellement automatique
- Facturation le même jour chaque mois

**4. Annuel**
- Paiement récurrent annuel
- Réduction par rapport au mensuel (ex: -20%)
- Facturation le même jour chaque année

**5. Sur devis**
- Prix personnalisé
- Négociation commerciale
- Facturation manuelle

**Statuts d'abonnement :**

**Actif**
- Paiement à jour
- Accès complet aux services
- Renouvellement automatique

**En pause**
- Suspendu temporairement (par admin ou client)
- Pas de facturation
- Données conservées
- Reprise possible

**Annulé**
- Annulation demandée
- Fin à la période payée
- Pas de renouvellement
- Données conservées X jours

**Expiré**
- Période payée terminée
- Pas de renouvellement
- Accès limité ou coupé
- Réactivation possible

**Suspendu pour impayé**
- Paiement en retard
- Accès limité ou coupé
- Relances automatiques
- Réactivation après paiement

**Actions admin :**

**Activer / Suspendre**
- Activer : Réactiver un abonnement suspendu
- Suspendre : Mettre en pause (raison requise)

**Prolonger**
- Ajouter X jours/mois
- Gratuit ou payant
- Notification client

**Changer de plan**
- Migration vers autre plan
- Calcul prorata
- Facture d'ajustement
- Notification client

**Annuler**
- Immédiat : Fin immédiate, remboursement prorata
- Fin de période : Fin à la date d'échéance
- Raison requise
- Offre de rétention (optionnel)

**Historique complet :**
- Toutes les modifications
- Changements de plan
- Paiements
- Factures
- Actions admin
- Logs système

---

### 🎟️ PROMOTIONS & CODES PROMO (LOGIQUE BoxBilling)

**Types de réductions :**

**1. Montant fixe**
- Ex: -10€ sur l'abonnement
- Appliqué une fois ou à chaque renouvellement

**2. Pourcentage**
- Ex: -20% sur l'abonnement
- Calculé sur le montant HT ou TTC
- Plafond optionnel (ex: max -50€)

**Paramètres avancés :**

**Code promo**
- Format : Alphanumérique (ex: WELCOME2024)
- Génération automatique ou manuel
- Vérification unicité
- Case sensitive (configurable)

**Actif / Inactif**
- Toggle activation
- Désactivation immédiate (arrête nouvelles utilisations)
- Utilisations en cours conservées

**Valeur**
- Montant fixe (€) ou pourcentage (%)
- Montant minimum d'achat (optionnel)
- Montant maximum de réduction (optionnel)

**Limite d'utilisation**
- **Totale** : Nombre max d'utilisations (ex: 100)
- **Par client** : Une fois par email/IP
- **Par période** : X utilisations par jour/mois

**Applicabilité :**

**Au premier paiement**
- Réduction sur l'inscription
- Essai gratuit prolongé
- Remise premier mois

**Aux renouvellements**
- Réduction récurrente
- Ex: -10% à vie
- Période limitée (ex: 3 premiers mois)

**Services / packs ciblés**
- Tous les services
- Services spécifiques (sélection multiple)
- Packs spécifiques
- Exclusion de services (liste noire)

**Période de validité**
- Date début : Activation automatique
- Date fin : Désactivation automatique
- Fuseau horaire : UTC ou local

**Promotions automatiques (sans code)**
- Promotion appliquée automatiquement
- Conditions : Nouveau client, plan spécifique, etc.
- Notification client (optionnel)

**Dashboard Promotions :**

**Vue d'ensemble :**
- Promos actives : Nombre, CA généré
- Promos expirées : Historique
- Promos programmées : À venir

**Métriques par promotion :**
- Nombre d'utilisations
- Taux de conversion (vues → utilisations)
- CA généré (revenus avec promo)
- CA perdu (montant réduit)
- ROI (retour sur investissement)

**Logs admin :**
- Qui a utilisé (email, ID)
- Quand (date/heure)
- Sur quel plan/service
- Montant économisé
- IP (pour sécurité)

**Actions :**
- Créer une promotion
- Modifier (si pas d'utilisations)
- Dupliquer
- Désactiver/Activer
- Supprimer (avec confirmation)
- Export CSV

**Exemples de promotions :**

**1. Code "WELCOME20"**
- Type : Pourcentage
- Valeur : -20%
- Limite : 1 utilisation par client
- Applicable : Premier paiement
- Services : Tous
- Validité : 3 mois

**2. Code "ANNUAL50"**
- Type : Montant fixe
- Valeur : -50€
- Limite : 100 utilisations totales
- Applicable : Renouvellements
- Services : Plans annuels uniquement
- Validité : 1 mois

**3. Promotion automatique "NOUVEAU_CLIENT"**
- Type : Pourcentage
- Valeur : -15%
- Sans code : Automatique
- Conditions : Nouveau client, plan mensuel
- Validité : Permanente

---

## 🔄 FLUX UTILISATEUR COMPLET

### 1. Visiteur → Inscription

**Étape 1 : Arrivée sur page d'accueil**
- Landing page publique
- Sections : Hero, Services, Tarifs
- CTA : "S'inscrire" / "Démarrer gratuitement"

**Étape 2 : Clic sur CTA**
- Redirection vers `/register`
- Formulaire d'inscription :
  - Nom, prénom
  - Email (vérification)
  - Mot de passe (force requise)
  - Acceptation CGU/CGV
  - Newsletter (optionnel)

**Étape 3 : Validation email**
- Email de confirmation envoyé
- Lien de vérification
- Expiration : 24h

**Étape 4 : Connexion**
- Redirection vers `/login`
- Connexion avec email/mot de passe
- Option "Se souvenir de moi"

**Étape 5 : Onboarding**
- Choix du plan (gratuit, essai, payant)
- Saisie code promo (optionnel)
- Validation du code promo (vérification en temps réel)

---

### 2. Inscription → Offre → Promo → Paiement

**Étape 1 : Choix de l'offre**
- Affichage des plans disponibles
- Comparaison visuelle
- Recommandation (badge "Populaire")
- Détails fonctionnalités

**Étape 2 : Application code promo**
- Champ "Code promo"
- Vérification en temps réel :
  - Code valide : Affichage réduction
  - Code invalide : Message d'erreur
  - Code expiré : Message explicite
- Calcul prix final (avant/après)

**Étape 3 : Récapitulatif**
- Plan sélectionné
- Période (mensuel/annuel)
- Prix initial
- Réduction (si code promo)
- Prix final
- Prochaine facturation

**Étape 4 : Paiement**
- Choix gateway (Stripe, PayPal, etc.)
- Formulaire sécurisé
- Validation 3D Secure si requis
- Confirmation en temps réel

**Étape 5 : Activation**
- Abonnement activé immédiatement
- Email de confirmation
- Facture générée automatiquement
- Accès aux services

---

### 3. Abonnement → Renouvellement

**Étape 1 : Approche échéance**
- **7 jours avant** : Email rappel + facture générée
- **3 jours avant** : Email rappel
- **Jour J** : Tentative de paiement automatique

**Étape 2 : Paiement réussi**
- Facture marquée "Payée"
- Abonnement prolongé
- Email confirmation
- Accès maintenu

**Étape 3 : Paiement échoué**
- **Jour J** : Tentative échouée
- Email notification client
- Statut : "En retard"
- **J+3** : Relance email
- **J+7** : Relance email + SMS (si configuré)
- **J+14** : Suspension accès (si configuré)
- **J+30** : Annulation automatique (si configuré)

**Étape 4 : Récupération**
- Client paie manuellement
- Réactivation automatique
- Email confirmation
- Accès restauré

---

## 🚀 VISION PRODUIT & ROADMAP

### Phase 1 : MVP (3 mois)
- ✅ Page d'accueil publique basique
- ✅ CMS admin pour page d'accueil
- ✅ Système d'authentification
- ✅ Module billing basique (plans, abonnements)
- ✅ Paiements Stripe
- ✅ Facturation automatique
- ✅ Codes promo simples

### Phase 2 : Amélioration (3 mois)
- ✅ Dashboard admin complet
- ✅ Analytics avancés
- ✅ Promotions avancées
- ✅ Multi-gateways (PayPal, etc.)
- ✅ Gestion impayés automatisée
- ✅ A/B Testing page d'accueil

### Phase 3 : Scale (6 mois)
- ✅ Marketplace de services
- ✅ API publique
- ✅ White-label
- ✅ Multi-langue
- ✅ Multi-devises
- ✅ Intégration CreatorHub

### Phase 4 : IA & Optimisation (6 mois)
- ✅ Suggestions IA prix/offres
- ✅ Prédiction churn
- ✅ Optimisation automatique tunnel
- ✅ Chatbot support
- ✅ Recommandations personnalisées

---

## 📊 MÉTRIQUES DE SUCCÈS

**Business :**
- MRR croissance : +20% par mois
- Taux de conversion : > 5% (visiteur → abonnement)
- Taux de rétention : > 90% (mois 1), > 80% (mois 6)
- Churn rate : < 5% par mois
- LTV/CAC : > 3:1

**Technique :**
- Temps de chargement : < 2s
- Uptime : > 99.9%
- Temps de réponse API : < 200ms
- Sécurité : 0 faille critique

**UX :**
- NPS : > 50
- Taux de complétion onboarding : > 80%
- Temps moyen avant premier abonnement : < 24h
- Satisfaction support : > 4.5/5

---

## 🎯 CONCLUSION

Cette architecture fournit une base solide pour InfluenceCore, avec :
- ✅ Page d'accueil publique entièrement administrable
- ✅ Système de billing complet inspiré de BoxBilling
- ✅ Espace admin puissant et intuitif
- ✅ Flux utilisateur optimisés pour la conversion
- ✅ Scalabilité et évolutivité

Le système est conçu pour évoluer avec les besoins de la plateforme, de la phase MVP à la scale internationale.

---

**Document créé le :** 2024-12-21  
**Version :** 1.0  
**Auteur :** Architecture InfluenceCore

