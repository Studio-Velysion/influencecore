# 📐 Spécifications Techniques - InfluenceCore
## Détails d'Implémentation & Diagrammes de Flux

---

## 📋 TABLE DES MATIÈRES

1. [Architecture Technique](#architecture-technique)
2. [Modèles de Données](#modèles-de-données)
3. [Diagrammes de Flux](#diagrammes-de-flux)
4. [Intégrations Externes](#intégrations-externes)
5. [Sécurité & Performance](#sécurité--performance)

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack Technologique Recommandée

**Frontend :**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Shadcn/ui (composants)
- React Hook Form (formulaires)
- Zod (validation)

**Backend :**
- Next.js API Routes
- Prisma ORM
- PostgreSQL (production) / SQLite (dev)
- NextAuth.js (authentification)

**Billing & Paiements :**
- Stripe (principal)
- PayPal (secondaire)
- Webhooks pour événements

**Infrastructure :**
- Vercel (hébergement)
- Upstash (Redis, si nécessaire)
- AWS S3 (stockage fichiers)
- SendGrid / Resend (emails)

**Monitoring & Analytics :**
- Vercel Analytics
- Sentry (erreurs)
- PostHog / Mixpanel (analytics)

---

## 📊 MODÈLES DE DONNÉES

### Modèle : Page (Page d'Accueil)

```typescript
Page {
  id: string (UUID)
  slug: string ("home", "about", etc.)
  title: string
  status: "draft" | "published" | "archived"
  
  // Sections
  sections: Section[]
  
  // SEO
  metaTitle: string
  metaDescription: string
  ogImage: string
  
  // Versioning
  version: number
  parentVersionId: string | null
  
  // Audit
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  publishedAt: DateTime | null
}
```

### Modèle : Section (Page d'Accueil)

```typescript
Section {
  id: string (UUID)
  pageId: string
  type: "hero" | "services" | "pricing" | "contact" | "faq"
  order: number
  isActive: boolean
  
  // Configuration
  config: JSON {
    // Hero
    title?: string
    subtitle?: string
    ctaPrimary?: { text, link, style }
    ctaSecondary?: { text, link }
    backgroundImage?: string
    
    // Services
    title?: string
    layout?: "2cols" | "3cols" | "4cols"
    services?: Service[]
    
    // Pricing
    title?: string
    highlightPlan?: string (planId)
    
    // Contact
    email?: string
    formFields?: string[]
  }
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Modèle : Service (Page d'Accueil)

```typescript
Service {
  id: string (UUID)
  name: string
  description: string
  advantages: string[] // Liste à puces
  icon: string // URL ou nom icône
  image: string | null
  link: string | null
  badge: "popular" | "new" | "coming-soon" | null
  order: number
  isActive: boolean
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Modèle : Plan (Billing)

```typescript
Plan {
  id: string (UUID)
  name: string // "Starter", "Pro", "Enterprise"
  slug: string // "starter", "pro", "enterprise"
  description: string
  
  // Pricing
  type: "free" | "trial" | "monthly" | "annual" | "custom"
  price: Decimal // Montant HT
  currency: string // "EUR", "USD"
  trialDays: number | null // Si type = "trial"
  
  // Features
  features: PlanFeature[]
  limits: JSON {
    projects?: number
    storage?: number (GB)
    users?: number
    apiCalls?: number
    // ... autres limites
  }
  
  // Visibility
  isActive: boolean
  isPublic: boolean // Visible sur page d'accueil
  order: number
  
  // Billing
  billingCycle: "month" | "year" | "one-time"
  setupFee: Decimal | null
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Modèle : PlanFeature

```typescript
PlanFeature {
  id: string (UUID)
  planId: string
  name: string
  value: string | number | boolean
  // Ex: "10 projets", "100GB", true (illimité)
  
  order: number
}
```

### Modèle : Subscription (Abonnement)

```typescript
Subscription {
  id: string (UUID)
  userId: string
  planId: string
  
  // Status
  status: "active" | "paused" | "cancelled" | "expired" | "suspended"
  
  // Dates
  startedAt: DateTime
  expiresAt: DateTime | null
  cancelledAt: DateTime | null
  pauseStartedAt: DateTime | null
  
  // Pricing
  price: Decimal
  currency: string
  promotionId: string | null
  
  // Billing
  billingCycle: "month" | "year"
  nextBillingDate: DateTime
  lastPaymentDate: DateTime | null
  
  // Gateway
  gateway: "stripe" | "paypal" | "manual"
  gatewaySubscriptionId: string | null
  
  // Metadata
  metadata: JSON
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Modèle : Invoice (Facture)

```typescript
Invoice {
  id: string (UUID)
  number: string // "INV-2024-001"
  userId: string
  subscriptionId: string | null
  
  // Type
  type: "one-time" | "recurring" | "manual"
  
  // Status
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled" | "refunded"
  
  // Amounts
  subtotal: Decimal
  tax: Decimal
  total: Decimal
  currency: string
  
  // Dates
  issueDate: DateTime
  dueDate: DateTime
  paidAt: DateTime | null
  
  // Items
  items: InvoiceItem[]
  
  // Payment
  paymentMethod: string | null
  paymentGateway: string | null
  paymentId: string | null
  
  // PDF
  pdfUrl: string | null
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Modèle : InvoiceItem

```typescript
InvoiceItem {
  id: string (UUID)
  invoiceId: string
  description: string
  quantity: number
  unitPrice: Decimal
  total: Decimal
  tax: Decimal
}
```

### Modèle : Promotion (Code Promo)

```typescript
Promotion {
  id: string (UUID)
  code: string // "WELCOME20"
  name: string // "Bienvenue -20%"
  
  // Type
  type: "percentage" | "fixed"
  value: Decimal // 20 (si %) ou 10 (si €)
  
  // Limits
  maxUses: number | null // Total
  maxUsesPerUser: number // Par client (généralement 1)
  currentUses: number
  
  // Applicability
  appliesTo: "first_payment" | "renewals" | "both"
  planIds: string[] // Plans ciblés (vide = tous)
  serviceIds: string[] // Services ciblés
  
  // Validity
  startsAt: DateTime
  endsAt: DateTime | null
  isActive: boolean
  
  // Auto-apply
  isAutoApply: boolean // Sans code, automatique
  autoApplyConditions: JSON {
    newUsersOnly?: boolean
    minAmount?: Decimal
    // ... autres conditions
  }
  
  // Metadata
  metadata: JSON
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Modèle : Payment (Paiement)

```typescript
Payment {
  id: string (UUID)
  invoiceId: string
  subscriptionId: string | null
  userId: string
  
  // Amount
  amount: Decimal
  currency: string
  
  // Status
  status: "pending" | "processing" | "succeeded" | "failed" | "refunded"
  
  // Gateway
  gateway: "stripe" | "paypal" | "manual"
  gatewayPaymentId: string | null
  gatewayResponse: JSON
  
  // Dates
  attemptedAt: DateTime
  succeededAt: DateTime | null
  failedAt: DateTime | null
  
  // Error
  errorCode: string | null
  errorMessage: string | null
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Modèle : UserCredit (Crédit Client)

```typescript
UserCredit {
  id: string (UUID)
  userId: string
  
  // Amount
  amount: Decimal
  currency: string
  
  // Type
  type: "refund" | "manual" | "promotion" | "adjustment"
  
  // Usage
  usedAmount: Decimal
  availableAmount: Decimal // amount - usedAmount
  
  // Expiry
  expiresAt: DateTime | null
  
  // Metadata
  description: string
  invoiceId: string | null
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## 🔄 DIAGRAMMES DE FLUX

### Flux 1 : Visiteur → Inscription → Abonnement

```
[Visiteur]
    ↓
[Page d'Accueil Publique]
    ↓
[Clic "S'inscrire"]
    ↓
[Formulaire Inscription]
    ├─ Email
    ├─ Mot de passe
    └─ CGU/CGV
    ↓
[Validation Email]
    ↓
[Email Confirmation]
    ↓
[Lien de Vérification]
    ↓
[Compte Activé]
    ↓
[Onboarding]
    ├─ Choix Plan
    ├─ Code Promo (optionnel)
    └─ Récapitulatif
    ↓
[Paiement]
    ├─ Stripe
    ├─ PayPal
    └─ Autre
    ↓
[Paiement Réussi]
    ↓
[Abonnement Activé]
    ├─ Facture Générée
    ├─ Email Confirmation
    └─ Accès Services
```

### Flux 2 : Renouvellement Abonnement

```
[Cron Job Quotidien]
    ↓
[Vérification Échéances]
    ├─ J-7 : Génération Facture
    ├─ J-3 : Email Rappel
    └─ J-0 : Tentative Paiement
    ↓
[Paiement Automatique]
    ├─ [Succès]
    │   ├─ Facture "Payée"
    │   ├─ Abonnement Prolongé
    │   └─ Email Confirmation
    │
    └─ [Échec]
        ├─ Statut "En Retard"
        ├─ Email Notification
        ├─ J+3 : Relance Email
        ├─ J+7 : Relance Email + SMS
        ├─ J+14 : Suspension Accès
        └─ J+30 : Annulation Auto
```

### Flux 3 : Application Code Promo

```
[Client Saisit Code]
    ↓
[Vérification en Temps Réel]
    ├─ Code Existe ?
    ├─ Code Actif ?
    ├─ Date Valide ?
    ├─ Limite Atteinte ?
    └─ Applicable au Plan ?
    ↓
[Calcul Réduction]
    ├─ Type : % ou €
    ├─ Montant Initial
    ├─ Réduction
    └─ Montant Final
    ↓
[Affichage Prix Final]
    ↓
[Paiement]
    ↓
[Enregistrement Utilisation]
    ├─ Promotion.currentUses++
    └─ Log Utilisation
```

### Flux 4 : Gestion Impayés

```
[Paiement Échoué]
    ↓
[Statut "En Retard"]
    ↓
[Relance Automatique]
    ├─ J+0 : Email Notification
    ├─ J+3 : Email Relance
    ├─ J+7 : Email + SMS
    └─ J+14 : Email Final
    ↓
[Actions Admin]
    ├─ Suspendre Accès
    ├─ Prolonger Délai
    ├─ Offrir Crédit
    └─ Contacter Client
    ↓
[Paiement Manuel]
    ↓
[Paiement Réussi]
    ↓
[Réactivation]
    ├─ Statut "Actif"
    ├─ Accès Restauré
    └─ Email Confirmation
```

---

## 🔌 INTÉGRATIONS EXTERNES

### Stripe

**Événements Webhooks :**
- `payment_intent.succeeded` : Paiement réussi
- `payment_intent.payment_failed` : Paiement échoué
- `customer.subscription.created` : Abonnement créé
- `customer.subscription.updated` : Abonnement modifié
- `customer.subscription.deleted` : Abonnement annulé
- `invoice.payment_succeeded` : Facture payée
- `invoice.payment_failed` : Facture impayée

**Actions :**
- Créer client
- Créer abonnement
- Créer paiement
- Rembourser
- Annuler abonnement

### PayPal

**Événements Webhooks :**
- `PAYMENT.SALE.COMPLETED` : Paiement réussi
- `PAYMENT.SALE.DENIED` : Paiement refusé
- `BILLING.SUBSCRIPTION.CREATED` : Abonnement créé
- `BILLING.SUBSCRIPTION.CANCELLED` : Abonnement annulé

### SendGrid / Resend (Emails)

**Templates :**
- Inscription (confirmation email)
- Bienvenue
- Facture générée
- Paiement réussi
- Paiement échoué
- Relance impayé
- Abonnement annulé
- Code promo appliqué

---

## 🔒 SÉCURITÉ & PERFORMANCE

### Sécurité

**Authentification :**
- NextAuth.js avec JWT
- Sessions sécurisées
- Refresh tokens
- 2FA (optionnel, phase 2)

**Autorisation :**
- RBAC (Role-Based Access Control)
- Permissions granulaires
- Middleware de protection routes

**Données sensibles :**
- Chiffrement au repos (base de données)
- Chiffrement en transit (HTTPS)
- Tokens API avec expiration
- Secrets dans variables d'environnement

**Paiements :**
- PCI DSS compliance (via Stripe)
- Pas de stockage numéros carte
- Webhooks vérifiés (signature)
- Idempotence des paiements

**Protection :**
- Rate limiting (API)
- CSRF protection
- XSS protection
- SQL injection (Prisma ORM)
- Validation côté serveur

### Performance

**Frontend :**
- SSR/SSG (Next.js)
- Code splitting automatique
- Image optimization
- Lazy loading
- Cache CDN (Vercel)

**Backend :**
- Cache Redis (si nécessaire)
- Database indexing
- Query optimization (Prisma)
- Pagination
- Rate limiting

**Monitoring :**
- Uptime monitoring
- Error tracking (Sentry)
- Performance metrics
- Alertes automatiques

---

## 📈 MÉTRIQUES & ANALYTICS

### Métriques Business

**Dashboard Admin :**
- MRR / ARR
- Nouveaux abonnements
- Churn rate
- Taux de conversion
- LTV (Lifetime Value)
- CAC (Customer Acquisition Cost)

**Par Plan :**
- Nombre d'abonnements
- Revenus générés
- Taux de conversion
- Taux de rétention

**Par Promotion :**
- Utilisations
- CA généré
- CA perdu (réductions)
- ROI

### Métriques Techniques

**Performance :**
- Temps de chargement page
- Temps de réponse API
- Taux d'erreur
- Uptime

**Utilisation :**
- Pages vues
- Sessions
- Taux de rebond
- Profondeur de scroll

---

## 🎯 CONCLUSION

Ces spécifications techniques fournissent :
- ✅ Modèles de données complets
- ✅ Flux détaillés
- ✅ Intégrations externes
- ✅ Sécurité & performance
- ✅ Base solide pour l'implémentation

Le système est conçu pour être :
- **Scalable** : Architecture modulaire
- **Sécurisé** : Best practices
- **Performant** : Optimisations intégrées
- **Maintenable** : Code propre, documenté

---

**Document créé le :** 2024-12-21  
**Version :** 1.0  
**Auteur :** Architecture InfluenceCore

