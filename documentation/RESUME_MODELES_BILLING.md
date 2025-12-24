# ✅ Modèles Prisma Billing - Résumé

## 🎯 Modèles Créés/Améliorés

### 1. Invoice (Facture) ✅
**Nouveau modèle complet inspiré de BoxBilling**

**Champs principaux :**
- `number` : Numéro unique (ex: INV-2024-001)
- `status` : draft, sent, paid, unpaid, overdue, cancelled, refunded
- `subtotal`, `tax`, `discount`, `total` : Montants
- `dueDate` : Date d'échéance
- `paidAt`, `sentAt`, `cancelledAt`, `refundedAt` : Dates importantes
- `notes`, `notesPublic` : Notes internes et publiques

**Relations :**
- `user` : Utilisateur propriétaire
- `subscription` : Abonnement associé (optionnel)
- `items` : Lignes de facture
- `payments` : Paiements associés

---

### 2. InvoiceItem (Ligne de Facture) ✅
**Nouveau modèle pour les lignes de facture**

**Champs principaux :**
- `type` : custom, order, deposit, hook_call
- `title`, `description` : Description de la ligne
- `quantity`, `unitPrice`, `total` : Calculs
- `orderId` : Référence à une commande (si type = order)
- `task` : void, activate, renew
- `status` : pending_payment, pending_setup, executed

**Relations :**
- `invoice` : Facture parente

---

### 3. Payment (Transaction) ✅
**Nouveau modèle pour les paiements**

**Champs principaux :**
- `amount`, `currency` : Montant et devise
- `method` : stripe, paypal, bank_transfer, credit, etc.
- `type` : payment, refund, subscription_create, subscription_cancel
- `status` : pending, completed, failed, refunded, unknown
- `transactionId` : ID unique de transaction
- `gateway`, `gatewayTransactionId` : Informations gateway
- `metadata` : JSON pour données supplémentaires
- `errorMessage` : Message d'erreur si échec
- `processedAt`, `refundedAt` : Dates importantes

**Relations :**
- `invoice` : Facture associée
- `user` : Utilisateur

---

### 4. UserSubscription (Amélioré) ✅
**Modèle existant amélioré avec plus de statuts**

**Nouveaux champs :**
- `status` : active, paused, cancelled, expired, suspended
- `nextBillingDate` : Prochaine date de facturation
- `suspendedAt`, `pausedAt` : Dates de suspension/pause

**Nouvelles relations :**
- `invoices` : Factures générées pour cet abonnement

---

### 5. SubscriptionDiscount (Amélioré) ✅
**Modèle existant amélioré pour codes promo globaux**

**Nouveaux champs :**
- `planId` : Maintenant nullable (permet codes promo globaux)
- `oneTimePerClient` : Une seule fois par client
- `applicableToFirstPayment` : Applicable au premier paiement
- `applicableToRenewals` : Applicable aux renouvellements

**Relations :**
- `plan` : Maintenant optionnel (null = code global)

---

## 📊 Structure Complète

```
User
├── subscriptions (UserSubscription[])
├── invoices (Invoice[])
└── payments (Payment[])

UserSubscription
├── plan (SubscriptionPlan)
├── discount (SubscriptionDiscount?)
└── invoices (Invoice[])

Invoice
├── user (User)
├── subscription (UserSubscription?)
├── items (InvoiceItem[])
└── payments (Payment[])

InvoiceItem
└── invoice (Invoice)

Payment
├── invoice (Invoice)
└── user (User)

SubscriptionPlan
├── discounts (SubscriptionDiscount[])
└── subscriptions (UserSubscription[])

SubscriptionDiscount
├── plan (SubscriptionPlan?) // Nullable pour codes globaux
└── subscriptions (UserSubscription[])
```

---

## 🔄 Workflow Implémentable

### Création d'Abonnement
1. User choisit SubscriptionPlan
2. Application SubscriptionDiscount (optionnel)
3. Création UserSubscription
4. Génération Invoice avec InvoiceItems
5. Paiement via Payment
6. Mise à jour Invoice.status = "paid"
7. Activation UserSubscription.status = "active"

### Renouvellement
1. Vérification nextBillingDate
2. Génération nouvelle Invoice
3. Tentative paiement automatique
4. Si succès → Renouvellement
5. Si échec → Suspension après période de grâce

### Gestion Factures
- Génération automatique
- Numérotation unique
- Calcul automatique (subtotal, tax, discount, total)
- Statuts multiples
- Historique complet

---

## ⚠️ Action Requise

**Générer le client Prisma :**
```bash
# Arrêter le serveur si en cours d'exécution
npm run db:generate
npm run db:push  # Pour appliquer les changements à la base de données
```

---

**Date de création :** 2024-12-21

