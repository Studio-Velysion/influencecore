# 🔌 Documentation API - InfluenceCore

Ce document centralise toutes les routes API du projet InfluenceCore.

## 📋 Table des matières

1. [Authentification](#authentification)
2. [API Admin](#api-admin)
3. [API Client](#api-client)
4. [API Publique](#api-publique)
5. [API Stripe](#api-stripe)

---

## 🔐 Authentification

### POST `/api/auth/register`
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nom Utilisateur"
}
```

**Réponse:**
```json
{
  "success": true,
  "user": { ... }
}
```

### POST `/api/auth/[...nextauth]`
Routes NextAuth pour l'authentification (login, logout, session).

---

## 👨‍💼 API Admin

### Utilisateurs

#### GET `/api/admin/users`
Récupérer la liste de tous les utilisateurs.

#### GET `/api/admin/users/[id]`
Récupérer les détails d'un utilisateur spécifique.

#### PUT `/api/admin/users/[id]`
Mettre à jour un utilisateur.

#### DELETE `/api/admin/users/[id]`
Supprimer un utilisateur.

#### POST `/api/admin/users/[id]/roles`
Assigner un rôle à un utilisateur.

#### DELETE `/api/admin/users/[id]/roles`
Retirer un rôle d'un utilisateur.

### Rôles & Permissions

#### GET `/api/admin/roles`
Récupérer tous les rôles.

#### POST `/api/admin/roles`
Créer un nouveau rôle.

#### GET `/api/admin/roles/[id]`
Récupérer un rôle spécifique.

#### PUT `/api/admin/roles/[id]`
Mettre à jour un rôle.

#### DELETE `/api/admin/roles/[id]`
Supprimer un rôle.

#### GET `/api/admin/permissions`
Récupérer toutes les permissions.

### Billing - Plans

#### GET `/api/admin/billing/plans`
Récupérer tous les plans d'abonnement.

#### POST `/api/admin/billing/plans`
Créer un nouveau plan.

#### GET `/api/admin/billing/plans/[id]`
Récupérer un plan spécifique.

#### PUT `/api/admin/billing/plans/[id]`
Mettre à jour un plan.

#### DELETE `/api/admin/billing/plans/[id]`
Supprimer un plan.

### Billing - Abonnements

#### GET `/api/admin/billing/subscriptions`
Récupérer tous les abonnements.

#### POST `/api/admin/billing/subscriptions`
Créer un nouvel abonnement.

#### GET `/api/admin/billing/subscriptions/[id]`
Récupérer un abonnement spécifique.

#### PUT `/api/admin/billing/subscriptions/[id]`
Mettre à jour un abonnement.

#### DELETE `/api/admin/billing/subscriptions/[id]`
Supprimer un abonnement.

### Billing - Factures

#### GET `/api/admin/billing/invoices`
Récupérer toutes les factures.

#### POST `/api/admin/billing/invoices`
Créer une nouvelle facture.

#### GET `/api/admin/billing/invoices/[id]`
Récupérer une facture spécifique.

#### PUT `/api/admin/billing/invoices/[id]`
Mettre à jour une facture.

#### DELETE `/api/admin/billing/invoices/[id]`
Supprimer une facture.

### Billing - Paiements

#### GET `/api/admin/billing/payments`
Récupérer tous les paiements.

#### POST `/api/admin/billing/payments`
Créer un nouveau paiement.

#### GET `/api/admin/billing/payments/[id]`
Récupérer un paiement spécifique.

#### PUT `/api/admin/billing/payments/[id]`
Mettre à jour un paiement.

#### DELETE `/api/admin/billing/payments/[id]`
Supprimer un paiement.

### Billing - Promotions

#### GET `/api/admin/billing/promotions`
Récupérer toutes les promotions.

#### POST `/api/admin/billing/promotions`
Créer une nouvelle promotion.

#### GET `/api/admin/billing/promotions/[id]`
Récupérer une promotion spécifique.

#### PUT `/api/admin/billing/promotions/[id]`
Mettre à jour une promotion.

#### DELETE `/api/admin/billing/promotions/[id]`
Supprimer une promotion.

### CMS

#### GET `/api/admin/cms/homepage/load`
Charger le contenu de la page d'accueil.

#### POST `/api/admin/cms/homepage/save`
Sauvegarder le contenu de la page d'accueil.

#### POST `/api/admin/cms/homepage/store`
Stockage automatique GrapesJS.

#### GET `/api/admin/cms/pricing/load`
Charger le contenu de la page tarifs.

#### POST `/api/admin/cms/pricing/save`
Sauvegarder le contenu de la page tarifs.

#### POST `/api/admin/cms/pricing/store`
Stockage automatique GrapesJS pour la page tarifs.

---

## 👤 API Client

### Idées Vidéos

#### GET `/api/ideas`
Récupérer toutes les idées de l'utilisateur connecté.

#### POST `/api/ideas`
Créer une nouvelle idée.

**Body:**
```json
{
  "title": "Titre de l'idée",
  "concept": "Concept",
  "platform": "YouTube",
  "format": "Vlog",
  "status": "draft",
  "priority": "medium"
}
```

#### GET `/api/ideas/[id]`
Récupérer une idée spécifique.

#### PUT `/api/ideas/[id]`
Mettre à jour une idée.

#### DELETE `/api/ideas/[id]`
Supprimer une idée.

### Scripts

#### GET `/api/scripts`
Récupérer tous les scripts de l'utilisateur connecté.

#### POST `/api/scripts`
Créer un nouveau script.

#### GET `/api/scripts/[id]`
Récupérer un script spécifique.

#### PUT `/api/scripts/[id]`
Mettre à jour un script.

#### DELETE `/api/scripts/[id]`
Supprimer un script.

### Notes

#### GET `/api/notes`
Récupérer toutes les notes de l'utilisateur connecté.

#### POST `/api/notes`
Créer une nouvelle note.

**Body:**
```json
{
  "content": "Contenu de la note",
  "tags": ["tag1", "tag2"]
}
```

#### GET `/api/notes/[id]`
Récupérer une note spécifique.

#### PUT `/api/notes/[id]`
Mettre à jour une note.

#### DELETE `/api/notes/[id]`
Supprimer une note.

### Calendrier

#### GET `/api/calendar`
Récupérer les événements du calendrier de l'utilisateur connecté.

#### POST `/api/calendar`
Créer un nouvel événement.

### Abonnements Utilisateur

#### GET `/api/user/subscription`
Récupérer l'abonnement actuel de l'utilisateur connecté.

---

## 🌐 API Publique

### Plans

#### GET `/api/public/plans`
Récupérer tous les plans d'abonnement actifs (pour la page tarifs publique).

---

## 💳 API Stripe

### Checkout

#### POST `/api/stripe/checkout`
Créer une session de checkout Stripe.

**Body:**
```json
{
  "planId": "plan_id",
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

### Webhook

#### POST `/api/stripe/webhook`
Endpoint webhook pour les événements Stripe (paiements, abonnements, etc.).

### Abonnements

#### GET `/api/stripe/subscription/[subscriptionId]`
Récupérer les détails d'un abonnement Stripe.

---

## 🔒 Authentification requise

Toutes les routes API (sauf `/api/public/*` et `/api/auth/*`) nécessitent une authentification via NextAuth.

Pour les routes admin, l'utilisateur doit avoir le rôle `admin` ou la permission appropriée.

---

## 📝 Notes importantes

- Toutes les dates sont au format ISO 8601
- Les montants sont en centimes (ex: 1000 = 10.00€)
- Les réponses d'erreur suivent le format :
  ```json
  {
    "error": "Message d'erreur",
    "details": "..."
  }
  ```

