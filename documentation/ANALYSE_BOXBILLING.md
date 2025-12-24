# 📊 Analyse BoxBilling - Logique Métier

## 🎯 Objectif
Extraire la logique métier de BoxBilling pour l'intégrer dans InfluenceCore avec AdminLTE.

## 📦 Modules Analysés

### 1. Invoice (Facture)
**Fichier :** `bb-modules/Invoice/Service.php`, `bb-library/Model/Invoice.php`

**Statuts :**
- `paid` : Payée
- `unpaid` : Non payée
- `refunded` : Remboursée
- `canceled` : Annulée

**Fonctionnalités clés :**
- Génération automatique de factures
- Numérotation unique (ex: INV-2024-001)
- Calcul automatique (subtotal, tax, discount, total)
- Dates importantes : dueDate, paidAt, sentAt, cancelledAt, refundedAt
- Notes internes et publiques
- Association avec abonnements

**Modèle Prisma créé :** ✅ `Invoice`

---

### 2. InvoiceItem (Ligne de Facture)
**Fichier :** `bb-library/Model/InvoiceItem.php`

**Types :**
- `deposit` : Dépôt (ne peut pas être payé avec crédits)
- `custom` : Ligne personnalisée
- `order` : Lien vers une commande
- `hook_call` : Appel de hook système

**Statuts :**
- `pending_payment` : En attente de paiement
- `pending_setup` : En attente de configuration
- `executed` : Exécuté

**Tasks :**
- `void` : Annuler
- `activate` : Activer
- `renew` : Renouveler

**Modèle Prisma créé :** ✅ `InvoiceItem`

---

### 3. Payment (Transaction)
**Fichier :** `bb-library/Payment/Transaction.php`

**Statuts :**
- `unknown` : Inconnu
- `pending` : En attente
- `complete` : Complété
- `failed` : Échoué
- `refunded` : Remboursé

**Types :**
- `payment` : Paiement
- `refund` : Remboursement
- `subscription_create` : Création d'abonnement
- `subscription_cancel` : Annulation d'abonnement

**Fonctionnalités :**
- Support multi-gateway (Stripe, PayPal, etc.)
- Transaction ID unique
- Métadonnées JSON pour données supplémentaires
- Gestion des erreurs

**Modèle Prisma créé :** ✅ `Payment`

---

### 4. Order (Commande)
**Fichier :** `bb-modules/Order/Service.php`, `bb-library/Model/ClientOrder.php`

**Statuts :**
- `pending_setup` : En attente de configuration
- `failed_setup` : Échec de configuration
- `active` : Actif
- `canceled` : Annulé
- `suspended` : Suspendu

**Workflow :**
1. Commande créée → `pending_setup`
2. Configuration réussie → `active`
3. Échec configuration → `failed_setup`
4. Suspension → `suspended`
5. Annulation → `canceled`

**Note :** Dans InfluenceCore, les commandes sont gérées via `UserSubscription`.

---

### 5. Client (Utilisateur)
**Fichier :** `bb-library/Model/Client.php`

**Statuts :**
- `active` : Actif
- `suspended` : Suspendu
- `canceled` : Annulé

**Note :** Dans InfluenceCore, géré via le modèle `User` existant.

---

### 6. Product (Produit/Plan)
**Fichier :** `bb-library/Model/Product.php`

**Statuts :**
- `enabled` : Activé
- `disabled` : Désactivé

**Note :** Dans InfluenceCore, géré via `SubscriptionPlan`.

---

## 💳 Système de Paiement

### Gateways Supportés (BoxBilling)
- Stripe
- PayPal
- Bank Transfer
- Credit (crédit client)
- Et autres via adapters

### Workflow Paiement
1. **Création facture** → Statut `draft`
2. **Envoi facture** → Statut `sent` / `unpaid`
3. **Paiement initié** → Transaction `pending`
4. **Paiement réussi** → Transaction `complete`, Facture `paid`
5. **Paiement échoué** → Transaction `failed`
6. **Remboursement** → Transaction `refund`, Facture `refunded`

---

## 🎟️ Système de Promotions

### Types de Réductions
- **Percentage** : Pourcentage (ex: 10% de réduction)
- **Fixed** : Montant fixe (ex: 50€ de réduction)

### Paramètres
- Code promo unique
- Limite d'utilisation (maxUses)
- Une fois par client (oneTimePerClient)
- Applicable au premier paiement
- Applicable aux renouvellements
- Période de validité (validFrom, validUntil)
- Ciblage par plan (planId) ou global (planId = null)

**Modèle Prisma créé :** ✅ `SubscriptionDiscount` (amélioré)

---

## 📊 Statistiques & Rapports

### Métriques BoxBilling
- Chiffre d'affaires global (MRR/ARR)
- Paiements réussis/échoués
- Impayés
- Revenus par offre/service
- Taux de conversion
- Abonnements actifs/en pause/annulés

---

## 🔄 Workflow Complet

### Création d'Abonnement
1. Utilisateur choisit un plan
2. Application d'un code promo (optionnel)
3. Création de la facture
4. Paiement
5. Activation de l'abonnement
6. Facture marquée comme payée

### Renouvellement
1. Date de renouvellement atteinte
2. Génération automatique de facture
3. Tentative de paiement
4. Si succès → Renouvellement
5. Si échec → Suspension après période de grâce

### Annulation
1. Demande d'annulation
2. Option : Immédiate ou fin de période
3. Si fin de période → Continue jusqu'à la date
4. Si immédiate → Suspension immédiate

---

## ✅ Modèles Prisma Créés

1. ✅ **Invoice** - Factures complètes
2. ✅ **InvoiceItem** - Lignes de facture
3. ✅ **Payment** - Transactions de paiement
4. ✅ **UserSubscription** - Amélioré avec plus de statuts
5. ✅ **SubscriptionDiscount** - Amélioré pour codes promo globaux

---

## 📝 Notes d'Implémentation

### Décimales en SQLite
- Tous les montants stockés comme `String` (ex: "29.99")
- Conversion nécessaire lors des calculs
- Utiliser `Decimal.js` ou similaire pour les calculs précis

### Numérotation Factures
- Format recommandé : `INV-YYYY-NNNN`
- Exemple : `INV-2024-0001`
- Générer automatiquement avec séquence

### Statuts
- Utiliser des enums TypeScript pour la cohérence
- Validation côté serveur et client

---

**Date d'analyse :** 2024-12-21

