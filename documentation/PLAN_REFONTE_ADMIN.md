# 🎯 Plan de Refonte Complète - Admin InfluenceCore

## 📋 Objectif
Refaire complètement le système d'administration en combinant :
- **AdminLTE 4.0.0-rc4** : Interface moderne et responsive
- **BoxBilling** : Logique métier pour paiements, abonnements, factures

## 🗑️ Fichiers à Supprimer

### Pages Admin
- `app/admin/page.tsx`
- `app/admin/subscriptions/page.tsx`

### Composants Admin
- `components/admin/AdminDashboard.tsx`
- `components/admin/RolesList.tsx`
- `components/admin/UsersList.tsx`
- `components/admin/UserRoleManager.tsx`
- `components/admin/QuickMakeFounder.tsx`
- `components/admin/AddUserByEmail.tsx`
- `components/admin/RoleForm.tsx`
- `components/admin/subscriptions/SubscriptionsAdmin.tsx`
- `components/admin/subscriptions/AssignSubscription.tsx`
- `components/admin/subscriptions/PlanForm.tsx`
- `components/admin/subscriptions/DiscountForm.tsx`

### API Routes Admin (à remplacer)
- `app/api/admin/**/*` (toutes les routes)

## 🏗️ Nouvelle Structure

```
app/
├── admin/
│   ├── layout.tsx              # Layout AdminLTE
│   ├── page.tsx                # Dashboard principal
│   ├── billing/
│   │   ├── page.tsx            # Vue d'ensemble billing
│   │   ├── plans/
│   │   │   ├── page.tsx        # Gestion des plans
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Édition plan
│   │   ├── subscriptions/
│   │   │   ├── page.tsx        # Liste abonnements
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Détail abonnement
│   │   ├── invoices/
│   │   │   ├── page.tsx        # Liste factures
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Détail facture
│   │   ├── payments/
│   │   │   ├── page.tsx        # Transactions
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Détail transaction
│   │   └── promotions/
│   │       ├── page.tsx        # Codes promo
│   │       └── [id]/
│   │           └── page.tsx    # Édition promo
│   ├── users/
│   │   ├── page.tsx            # Liste utilisateurs
│   │   └── [id]/
│   │       └── page.tsx        # Détail utilisateur
│   └── settings/
│       └── page.tsx            # Paramètres système

components/
├── admin/
│   ├── layout/
│   │   ├── AdminLayout.tsx     # Layout AdminLTE wrapper
│   │   ├── AdminSidebar.tsx    # Sidebar navigation
│   │   ├── AdminHeader.tsx     # Header avec user menu
│   │   └── AdminFooter.tsx     # Footer
│   ├── billing/
│   │   ├── BillingDashboard.tsx
│   │   ├── PlansList.tsx
│   │   ├── PlanForm.tsx
│   │   ├── SubscriptionsList.tsx
│   │   ├── SubscriptionDetail.tsx
│   │   ├── InvoicesList.tsx
│   │   ├── InvoiceDetail.tsx
│   │   ├── PaymentsList.tsx
│   │   ├── PaymentDetail.tsx
│   │   ├── PromotionsList.tsx
│   │   └── PromotionForm.tsx
│   └── users/
│       ├── UsersList.tsx
│       └── UserDetail.tsx

app/api/admin/
├── billing/
│   ├── plans/
│   │   ├── route.ts            # GET, POST
│   │   └── [id]/
│   │       └── route.ts        # GET, PUT, DELETE
│   ├── subscriptions/
│   │   ├── route.ts            # GET, POST
│   │   └── [id]/
│   │       └── route.ts        # GET, PUT, DELETE
│   ├── invoices/
│   │   ├── route.ts            # GET, POST
│   │   └── [id]/
│   │       └── route.ts        # GET, PUT, DELETE
│   ├── payments/
│   │   ├── route.ts            # GET, POST
│   │   └── [id]/
│   │       └── route.ts        # GET, PUT
│   └── promotions/
│       ├── route.ts            # GET, POST
│       └── [id]/
│           └── route.ts        # GET, PUT, DELETE
└── users/
    ├── route.ts                # GET, POST
    └── [id]/
        └── route.ts            # GET, PUT, DELETE
```

## 📦 Intégration AdminLTE

### 1. Installation
```bash
npm install admin-lte@4.0.0-rc4
```

### 2. Assets
- Copier les CSS/JS depuis `AdminLTE-4.0.0-rc4/dist/`
- Ou utiliser via CDN

### 3. Layout Structure
- Header avec navigation
- Sidebar avec menu
- Main content area
- Footer

## 💳 Logique BoxBilling

### Modules à Analyser
1. **Invoice** (`bb-modules/Invoice/`)
   - Génération factures
   - Statuts (brouillon, envoyée, payée, en retard, annulée, remboursée)
   - Avoirs/credits

2. **Order** (`bb-modules/Order/`)
   - Gestion commandes
   - Workflow commande → facture → paiement

3. **Client** (`bb-modules/Client/`)
   - Gestion clients
   - Balance/credits

4. **Product** (`bb-modules/Product/`)
   - Gestion produits/services

5. **Payment** (`bb-library/Payment/`)
   - Adapters paiement
   - Transactions

### Modèles Prisma à Créer/Adapter

```prisma
model SubscriptionPlan {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal
  currency    String   @default("EUR")
  interval    String   // monthly, yearly, one-time
  features    Json?    // Liste des fonctionnalités
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  subscriptions UserSubscription[]
  discounts     SubscriptionDiscount[]
}

model UserSubscription {
  id            String   @id @default(cuid())
  userId        String
  planId        String
  status        String   // active, paused, cancelled, expired, suspended
  startDate     DateTime
  endDate       DateTime?
  nextBillingDate DateTime?
  discountId    String?
  createdAt     DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  user     User             @relation(fields: [userId], references: [id])
  plan     SubscriptionPlan @relation(fields: [planId], references: [id])
  discount SubscriptionDiscount? @relation(fields: [discountId], references: [id])
  invoices Invoice[]
}

model Invoice {
  id            String   @id @default(cuid())
  userId        String
  subscriptionId String?
  number        String   @unique
  status        String   // draft, sent, paid, overdue, cancelled, refunded
  amount        Decimal
  tax           Decimal  @default(0)
  total         Decimal
  currency      String   @default("EUR")
  dueDate       DateTime
  paidAt        DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user         User            @relation(fields: [userId], references: [id])
  subscription UserSubscription? @relation(fields: [subscriptionId], references: [id])
  payments     Payment[]
  items        InvoiceItem[]
}

model InvoiceItem {
  id        String   @id @default(cuid())
  invoiceId String
  description String
  quantity  Int      @default(1)
  price     Decimal
  total     Decimal
  createdAt DateTime @default(now())
  
  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
}

model Payment {
  id            String   @id @default(cuid())
  invoiceId     String
  amount        Decimal
  currency      String   @default("EUR")
  method        String   // stripe, paypal, bank_transfer, etc.
  status        String   // pending, completed, failed, refunded
  transactionId String?
  metadata      Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  invoice Invoice @relation(fields: [invoiceId], references: [id])
}

model SubscriptionDiscount {
  id          String   @id @default(cuid())
  code        String   @unique
  name        String
  description String?
  type        String   // percentage, fixed
  value       Decimal
  planId      String?
  isActive    Boolean  @default(true)
  maxUses     Int?
  usedCount   Int      @default(0)
  validFrom   DateTime?
  validUntil  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  plan         SubscriptionPlan? @relation(fields: [planId], references: [id])
  subscriptions UserSubscription[]
}
```

## 🎨 Design AdminLTE

### Couleurs
- Primary: #0d6efd (Bootstrap blue)
- Success: #20c997
- Warning: #ffc107
- Danger: #dc3545
- Info: #0dcaf0

### Composants Utilisés
- Cards
- Tables (avec DataTables)
- Forms
- Modals
- Charts (ApexCharts)
- Small Box widgets
- Info Box widgets

## 📝 Étapes d'Implémentation

1. ✅ Supprimer ancien admin
2. ⏳ Installer AdminLTE
3. ⏳ Créer layout AdminLTE
4. ⏳ Créer schéma Prisma pour billing
5. ⏳ Implémenter module Plans
6. ⏳ Implémenter module Subscriptions
7. ⏳ Implémenter module Invoices
8. ⏳ Implémenter module Payments
9. ⏳ Implémenter module Promotions
10. ⏳ Créer API routes
11. ⏳ Tests et ajustements

---

**Date de création :** 2024-12-21

