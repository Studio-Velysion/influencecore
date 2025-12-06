# 💳 Système d'Abonnements - InfluenceCore

## ✅ Système complet de gestion des abonnements

Système d'abonnements avec gestion des prix, réductions et attribution manuelle depuis l'administration.

---

## 🎯 Fonctionnalités

### 1. Gestion des plans d'abonnement
- ✅ Créer des plans personnalisés
- ✅ Modifier les prix en temps réel
- ✅ Plans illimités (gratuits)
- ✅ Gestion des fonctionnalités par plan
- ✅ Ordre d'affichage personnalisable

### 2. Système de réductions
- ✅ Réductions par pourcentage ou montant fixe
- ✅ Codes promo optionnels
- ✅ Dates de validité
- ✅ Limite d'utilisations
- ✅ Réductions automatiques ou avec code

### 3. Attribution manuelle
- ✅ Attribuer un abonnement à un utilisateur
- ✅ Abonnement illimité gratuit
- ✅ Gestion depuis la page administration
- ✅ Seul le fondateur peut attribuer

### 4. Pages publiques
- ✅ Page `/subscribe` avec prix dynamiques
- ✅ Affichage automatique des réductions
- ✅ Prix mis à jour en temps réel

---

## 📊 Modèles de base de données

### Nouveaux modèles

1. **SubscriptionPlan** - Plans d'abonnement
   - name, slug, description, price, currency, interval
   - features (JSON), isActive, isUnlimited
   - displayOrder pour l'ordre d'affichage

2. **SubscriptionDiscount** - Réductions
   - planId, code (optionnel), name, description
   - type (percentage/fixed), value
   - validFrom, validUntil, maxUses, currentUses

3. **UserSubscription** - Abonnements utilisateurs
   - userId, planId, status
   - isUnlimited, pricePaid
   - startedAt, expiresAt, cancelledAt

---

## 🔑 Permissions

Seul le **Fondateur** peut :
- Créer/modifier/supprimer des plans
- Créer/modifier/supprimer des réductions
- Attribuer des abonnements aux utilisateurs
- Donner des abonnements illimités

---

## 🚀 Utilisation

### 1. Créer un plan d'abonnement

1. Aller sur `/admin/subscriptions` → Onglet "Plans"
2. Cliquer sur "+ Créer un plan"
3. Remplir :
   - **Nom** : Ex. "Starter", "Pro", "Premium"
   - **Slug** : Identifiant unique (starter, pro, premium)
   - **Prix** : Montant en euros
   - **Période** : Mensuel ou Annuel
   - **Fonctionnalités** : Liste des fonctionnalités incluses
4. Cliquer sur "Créer le plan"

### 2. Créer une réduction

1. Aller sur `/admin/subscriptions` → Onglet "Réductions"
2. Cliquer sur "+ Créer une réduction"
3. Remplir :
   - **Plan** : Sélectionner le plan concerné
   - **Type** : Pourcentage ou montant fixe
   - **Valeur** : Pourcentage (ex: 20) ou montant (ex: 10)
   - **Code promo** : Optionnel (laissez vide pour réduction automatique)
   - **Dates de validité** : Optionnel
   - **Nombre max d'utilisations** : Optionnel
4. Cliquer sur "Créer la réduction"

### 3. Attribuer un abonnement

1. Aller sur `/admin/subscriptions` → Onglet "Attributions"
2. Cliquer sur "Attribuer un abonnement" pour un utilisateur
3. Choisir :
   - **Plan** : Sélectionner un plan
   - **OU** : Cocher "Abonnement illimité" (gratuit)
   - **Date d'expiration** : Optionnel
4. Cliquer sur "Attribuer l'abonnement"

**Important :**
- Les autres abonnements actifs seront automatiquement annulés
- L'abonnement illimité est gratuit et sans expiration
- Seul le fondateur peut attribuer des abonnements

### 4. Modifier les prix

1. Aller sur `/admin/subscriptions` → Onglet "Plans"
2. Cliquer sur ✏️ pour modifier un plan
3. Modifier le prix
4. Cliquer sur "Mettre à jour"

**Les prix se mettent à jour automatiquement sur la page `/subscribe` !**

---

## 📁 Structure créée

```
app/api/admin/subscriptions/
├── plans/
│   ├── route.ts              # GET, POST /api/admin/subscriptions/plans
│   └── [id]/route.ts         # GET, PUT, DELETE
├── discounts/
│   ├── route.ts              # GET, POST
│   └── [id]/route.ts         # PUT, DELETE
└── users/
    └── [userId]/route.ts     # GET, POST (attribution)

app/api/subscriptions/
└── plans/
    └── route.ts              # GET (public - avec prix calculés)

components/admin/subscriptions/
├── SubscriptionsAdmin.tsx    # Dashboard principal
├── PlanForm.tsx              # Formulaire plan
├── DiscountForm.tsx           # Formulaire réduction
└── AssignSubscription.tsx     # Attribution d'abonnement

components/subscriptions/
└── SubscriptionPlans.tsx     # Affichage public des plans

app/
├── admin/subscriptions/
│   └── page.tsx              # Page admin abonnements
└── subscribe/
    └── page.tsx               # Page publique abonnements
```

---

## 💰 Calcul des prix

Le système calcule automatiquement :
1. **Prix de base** : Défini dans le plan
2. **Réductions actives** : Appliquées automatiquement
3. **Prix final** : Affiché sur la page publique

**Exemple :**
- Plan Pro : 29.99€/mois
- Réduction active : -20%
- Prix affiché : 23.99€/mois (économisez 6€)

---

## 🎨 Interface

### Page Administration (`/admin/subscriptions`)

- **Onglet Plans** :
  - Liste des plans avec prix
  - Création/édition/suppression
  - Badge "Illimité" pour les plans gratuits

- **Onglet Réductions** :
  - Liste des réductions
  - Filtrage par plan
  - Gestion des codes promo

- **Onglet Attributions** :
  - Liste de tous les utilisateurs
  - Bouton d'attribution par utilisateur
  - Support abonnement illimité

### Page Publique (`/subscribe`)

- Affichage de tous les plans actifs
- Prix avec réductions automatiques
- Badge de réduction visible
- Prix barré si réduction active
- Calcul automatique des économies

---

## 🔒 Sécurité

- Toutes les routes admin vérifient les permissions
- Seul le fondateur peut gérer les abonnements
- Les prix sont calculés côté serveur
- Les réductions sont validées (dates, utilisations)

---

## 📝 Exemples

### Plan "Starter"
- Prix : 9.99€/mois
- Fonctionnalités :
  - 10 idées de vidéos
  - 5 scripts
  - Calendrier éditorial
  - Notes rapides

### Plan "Pro"
- Prix : 29.99€/mois
- Réduction : -20% (automatique)
- Prix final : 23.99€/mois
- Fonctionnalités :
  - Idées illimitées
  - Scripts illimités
  - Calendrier avancé
  - Export PDF

### Plan "Premium"
- Prix : 49.99€/mois
- Réduction : Code "PREMIUM2024" (-15€)
- Prix final : 34.99€/mois
- Fonctionnalités :
  - Tout du Pro
  - Support prioritaire
  - API access

---

## ✅ Checklist de configuration

- [ ] Base de données migrée avec les nouveaux modèles
- [ ] Créer vos premiers plans d'abonnement
- [ ] Créer des réductions (optionnel)
- [ ] Tester l'affichage sur `/subscribe`
- [ ] Attribuer un abonnement test à un utilisateur
- [ ] Vérifier que les prix se mettent à jour automatiquement

---

**Le système d'abonnements est maintenant complet et prêt à l'emploi !** 🎉

