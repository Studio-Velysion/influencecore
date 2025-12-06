# 💳 Intégration Stripe - InfluenceCore

## ✅ Système de paiement Stripe complet

Intégration complète de Stripe pour gérer les paiements d'abonnements.

---

## 🎯 Fonctionnalités

### 1. Stripe Checkout
- ✅ Paiement sécurisé via Stripe Checkout
- ✅ Redirection automatique après paiement
- ✅ Gestion des codes promo
- ✅ Support des abonnements récurrents

### 2. Webhooks Stripe
- ✅ Synchronisation automatique des abonnements
- ✅ Gestion des paiements réussis/échoués
- ✅ Mise à jour des statuts en temps réel
- ✅ Annulation et réactivation d'abonnements

### 3. Gestion des abonnements
- ✅ Création automatique de clients Stripe
- ✅ Synchronisation des prix avec Stripe
- ✅ Gestion des périodes d'abonnement
- ✅ Annulation à la fin de période

---

## 🔧 Configuration

### 1. Installer les dépendances

```bash
npm install stripe
```

### 2. Variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
# Stripe
STRIPE_SECRET_KEY="sk_test_..." # Clé secrète Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..." # Clé publique Stripe (optionnel pour le frontend)
STRIPE_WEBHOOK_SECRET="whsec_..." # Secret du webhook Stripe
NEXT_PUBLIC_APP_URL="http://localhost:3000" # URL de votre application
```

### 3. Configuration Stripe

1. **Créer un compte Stripe** : https://stripe.com
2. **Récupérer les clés API** :
   - Dashboard Stripe → Developers → API keys
   - Copier `Secret key` → `STRIPE_SECRET_KEY`
   - Copier `Publishable key` → `STRIPE_PUBLISHABLE_KEY` (optionnel)

3. **Configurer le webhook** :
   - Dashboard Stripe → Developers → Webhooks
   - Ajouter un endpoint : `https://votre-domaine.com/api/stripe/webhook`
   - Sélectionner les événements :
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copier le `Signing secret` → `STRIPE_WEBHOOK_SECRET`

### 4. Mettre à jour la base de données

```bash
npm run db:generate
npm run db:push
```

---

## 🚀 Utilisation

### 1. Créer un plan avec Stripe

1. Aller sur `/admin/subscriptions` → Onglet "Plans"
2. Créer un nouveau plan
3. Le système créera automatiquement :
   - Un produit Stripe
   - Un prix Stripe
   - Les IDs seront sauvegardés dans la base de données

### 2. Processus de paiement

1. L'utilisateur va sur `/subscribe`
2. Clique sur "S'abonner" pour un plan
3. Redirection vers Stripe Checkout
4. Paiement sécurisé
5. Redirection vers `/subscribe/success`
6. Webhook Stripe met à jour l'abonnement automatiquement

### 3. Gérer les abonnements

Les webhooks Stripe gèrent automatiquement :
- ✅ Création d'abonnement après paiement
- ✅ Mise à jour des statuts
- ✅ Renouvellement automatique
- ✅ Gestion des paiements échoués
- ✅ Annulation d'abonnement

---

## 📁 Structure créée

```
lib/
└── stripe.ts                    # Utilitaires Stripe

app/api/stripe/
├── checkout/
│   └── route.ts                 # Créer une session checkout
├── webhook/
│   └── route.ts                 # Webhooks Stripe
└── subscription/
    └── [subscriptionId]/
        └── route.ts             # Annuler/réactiver abonnement

app/subscribe/
└── success/
    └── page.tsx                 # Page de succès après paiement
```

---

## 🔒 Sécurité

- ✅ Vérification des signatures webhook
- ✅ Validation des utilisateurs authentifiés
- ✅ Vérification de propriété des abonnements
- ✅ Gestion sécurisée des clés API

---

## 📝 Événements Stripe gérés

### `checkout.session.completed`
- Crée l'abonnement dans la base de données
- Annule les autres abonnements actifs

### `customer.subscription.updated`
- Met à jour le statut de l'abonnement
- Synchronise les dates de période

### `customer.subscription.deleted`
- Marque l'abonnement comme annulé

### `invoice.payment_succeeded`
- Active l'abonnement
- Met à jour les dates de période

### `invoice.payment_failed`
- Marque l'abonnement comme "past_due"

---

## 🧪 Mode test

Stripe fournit des cartes de test :

**Carte de test réussie :**
- Numéro : `4242 4242 4242 4242`
- Date : N'importe quelle date future
- CVC : N'importe quel 3 chiffres
- Code postal : N'importe quel code postal

**Carte de test échouée :**
- Numéro : `4000 0000 0000 0002`

Voir plus de cartes de test : https://stripe.com/docs/testing

---

## ✅ Checklist de configuration

- [ ] Compte Stripe créé
- [ ] Clés API récupérées et ajoutées dans `.env`
- [ ] Webhook configuré dans Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` ajouté dans `.env`
- [ ] Base de données migrée
- [ ] Tester avec une carte de test
- [ ] Vérifier que les webhooks fonctionnent

---

## 🐛 Dépannage

### Webhook non reçu
- Vérifier que `STRIPE_WEBHOOK_SECRET` est correct
- Vérifier l'URL du webhook dans Stripe Dashboard
- Utiliser Stripe CLI pour tester en local :
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  ```

### Abonnement non créé après paiement
- Vérifier les logs du webhook
- Vérifier que les métadonnées (userId, planId) sont présentes
- Vérifier que le webhook est bien configuré

### Erreur "Plan not found"
- Vérifier que le plan existe dans la base de données
- Vérifier que `stripePriceId` est bien créé

---

**L'intégration Stripe est maintenant complète !** 🎉

