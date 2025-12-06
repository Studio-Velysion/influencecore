# 🔐 Configuration du Système d'Administration

## 📋 Étapes d'installation

### 1. Mettre à jour la base de données

```bash
# Générer le client Prisma avec les nouveaux modèles
npm run db:generate

# Appliquer les changements à la base de données
npm run db:push
```

### 2. Marquer votre utilisateur comme admin

**Option A - Via SQL direct :**
```sql
UPDATE users SET is_admin = true WHERE email = 'votre@email.com';
```

**Option B - Via Prisma Studio :**
```bash
npm run db:studio
```
Puis modifier manuellement le champ `is_admin` à `true` pour votre utilisateur.

### 3. Initialiser les permissions

**Option A - Via l'API (recommandé) :**
1. Connectez-vous avec votre compte admin
2. Ouvrez la console du navigateur sur `/admin`
3. Exécutez :
```javascript
fetch('/api/admin/init', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

**Option B - Via script Node.js :**
```bash
npx ts-node scripts/init-admin.ts
```

### 4. Attribuer le rôle Fondateur

**Option A - Via l'interface (recommandé) :**
1. Allez sur `/admin` → Onglet "Utilisateurs"
2. Utilisez le widget "Attribuer le rôle Fondateur"
3. Entrez votre email et cliquez sur "Attribuer Fondateur"

**Option B - Via SQL :**
```sql
INSERT INTO user_roles (id, user_id, role_id, created_at)
SELECT gen_random_uuid(), u.id, r.id, NOW()
FROM users u, roles r
WHERE u.email = 'votre@email.com' AND r.name = 'Fondateur';
```

### 5. Vérifier que tout fonctionne

1. Allez sur `/admin`
2. Vous devriez voir l'interface d'administration
3. Le rôle "Fondateur" devrait être créé automatiquement
4. Votre compte devrait avoir le rôle Fondateur

---

## 🎯 Utilisation

### Créer un rôle personnalisé

1. Aller sur `/admin` → Onglet "Rôles"
2. Cliquer sur "+ Créer un rôle"
3. Remplir :
   - **Nom** : Ex. "Éditeur", "Contributeur", "Modérateur"
   - **Description** : Description du rôle
   - **Permissions** : Sélectionner les permissions souhaitées
4. Cliquer sur "Créer le rôle"

### Attribuer un rôle par email

1. Aller sur `/admin` → Onglet "Utilisateurs"
2. Cliquer sur "+ Ajouter un utilisateur"
3. Entrer l'**email** de la personne
4. Sélectionner le **rôle** à attribuer
5. Cliquer sur "Attribuer le rôle"

**Important :**
- Si l'utilisateur n'existe pas, un compte sera créé automatiquement
- L'utilisateur devra définir son mot de passe lors de la première connexion
- Le rôle est attribué immédiatement

### Gérer les rôles d'un utilisateur existant

1. Aller sur `/admin` → Onglet "Utilisateurs"
2. Cliquer sur "Gérer les rôles" pour un utilisateur
3. Ajouter ou retirer des rôles

---

## 🔑 Permissions disponibles

### Administration
- `admin.access` - Accès à l'interface admin
- `admin.users` - Gérer les utilisateurs
- `admin.roles` - Gérer les rôles

### Idées Vidéos
- `ideas.view` - Voir les idées
- `ideas.create` - Créer des idées
- `ideas.edit` - Modifier les idées
- `ideas.delete` - Supprimer les idées

### Scripts
- `scripts.view` - Voir les scripts
- `scripts.create` - Créer des scripts
- `scripts.edit` - Modifier les scripts
- `scripts.delete` - Supprimer les scripts

### Calendrier
- `calendar.view` - Voir le calendrier
- `calendar.edit` - Modifier le calendrier

### Notes
- `notes.view` - Voir les notes
- `notes.create` - Créer des notes
- `notes.edit` - Modifier les notes
- `notes.delete` - Supprimer les notes

---

## 📝 Exemples de rôles

### Rôle "Éditeur"
- Permissions :
  - ✅ ideas.view, ideas.create, ideas.edit
  - ✅ scripts.view, scripts.create, scripts.edit
  - ✅ notes.view, notes.create, notes.edit
  - ✅ calendar.view

### Rôle "Contributeur"
- Permissions :
  - ✅ ideas.view, ideas.create
  - ✅ scripts.view, scripts.create
  - ✅ notes.view, notes.create

### Rôle "Lecteur"
- Permissions :
  - ✅ ideas.view
  - ✅ scripts.view
  - ✅ notes.view
  - ✅ calendar.view

---

## ⚠️ Important

1. **Premier fondateur** : Marquez votre compte comme admin et attribuez le rôle Fondateur
2. **Rôle Fondateur** : Le rôle "Fondateur" est protégé (ne peut pas être modifié/supprimé/retiré)
3. **Permissions** : 
   - Les utilisateurs avec `isAdmin: true` ont automatiquement toutes les permissions
   - Le rôle Fondateur a toutes les permissions attribuées
4. **Sécurité** : Toutes les routes admin vérifient les permissions
5. **Rôle principal** : Le rôle Fondateur est le rôle principal pour gérer toute la plateforme

---

## 🐛 Dépannage

### Erreur "Accès refusé"
- Vérifiez que votre utilisateur a `is_admin = true`
- Vérifiez que les permissions sont initialisées

### Rôle "Administrateur" non créé
- Exécutez `/api/admin/init` manuellement
- Vérifiez les logs de la console

### Permissions non initialisées
- Exécutez le script d'initialisation
- Vérifiez que la table `permissions` contient des données

---

**Le système est maintenant prêt !** 🎉

