# 👑 Rôle Fondateur - InfluenceCore

## 🎯 Rôle principal du système

Le **rôle Fondateur** est le rôle principal de la plateforme InfluenceCore. Il donne accès à toutes les fonctionnalités et permissions.

---

## ✨ Caractéristiques

### Permissions complètes
- ✅ Toutes les permissions de la plateforme
- ✅ Accès à l'administration complète
- ✅ Gestion des utilisateurs
- ✅ Gestion des rôles
- ✅ Toutes les fonctionnalités métier

### Protection
- 🔒 Rôle système (ne peut pas être supprimé)
- 🔒 Ne peut pas être modifié
- 🔒 Ne peut pas être retiré d'un utilisateur
- 🔒 Créé automatiquement lors de l'initialisation

---

## 🚀 Attribution du rôle Fondateur

### Méthode 1 : Via l'interface (Recommandé)

1. Aller sur `/admin` → Onglet "Utilisateurs"
2. Utiliser le widget "Attribuer le rôle Fondateur" en haut de la page
3. Entrer l'email de l'utilisateur
4. Cliquer sur "Attribuer Fondateur"

### Méthode 2 : Via l'API

```javascript
fetch('/api/admin/users/make-founder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'utilisateur@example.com'
  })
})
```

### Méthode 3 : Via SQL

```sql
INSERT INTO user_roles (id, user_id, role_id, created_at)
SELECT gen_random_uuid(), u.id, r.id, NOW()
FROM users u, roles r
WHERE u.email = 'utilisateur@example.com' AND r.name = 'Fondateur';
```

---

## 📋 Différence avec isAdmin

| Caractéristique | `isAdmin: true` | Rôle Fondateur |
|----------------|----------------|----------------|
| **Permissions** | Toutes automatiquement | Toutes via le rôle |
| **Gestion** | Via champ DB | Via système de rôles |
| **Flexibilité** | Oui/Non uniquement | Fait partie du système de rôles |
| **Recommandation** | Pour accès rapide | Pour gestion fine |

**Recommandation** : Utilisez le rôle Fondateur pour une gestion plus flexible et cohérente avec le système de rôles.

---

## 🔐 Sécurité

- Le rôle Fondateur est **protégé** : ne peut pas être retiré
- Seuls les utilisateurs avec `isAdmin: true` ou le rôle Fondateur peuvent l'attribuer
- Toutes les vérifications de permissions incluent le rôle Fondateur

---

## 📝 Utilisation

Une fois le rôle Fondateur attribué, l'utilisateur peut :
- ✅ Accéder à `/admin`
- ✅ Créer et gérer des rôles
- ✅ Attribuer des rôles aux utilisateurs
- ✅ Gérer tous les utilisateurs
- ✅ Accéder à toutes les fonctionnalités de la plateforme

---

## 🎯 Workflow recommandé

1. **Initialiser le système** : `/api/admin/init`
2. **Marquer votre compte comme admin** : `UPDATE users SET is_admin = true WHERE email = 'votre@email.com';`
3. **Attribuer le rôle Fondateur** : Via l'interface `/admin`
4. **Créer d'autres rôles** : Éditeur, Contributeur, etc.
5. **Attribuer des rôles** : Par email ou via l'interface

---

**Le rôle Fondateur est maintenant le rôle principal de votre plateforme !** 👑

