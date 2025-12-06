# 🔐 Système d'Administration - InfluenceCore

## ✅ Système de rôles et permissions complet

Système d'administration avancé avec création de rôles personnalisables et attribution par email.

---

## 🎯 Fonctionnalités

### 1. Gestion des rôles
- ✅ Créer des rôles personnalisés
- ✅ Modifier les rôles (sauf rôles système)
- ✅ Supprimer les rôles
- ✅ Attribuer des permissions par rôle
- ✅ Voir le nombre d'utilisateurs par rôle

### 2. Gestion des permissions
- ✅ 20+ permissions prédéfinies
- ✅ Organisées par catégories (Admin, Idées, Scripts, Calendrier, Notes)
- ✅ Permissions granulaires (view, create, edit, delete)

### 3. Gestion des utilisateurs
- ✅ Liste de tous les utilisateurs
- ✅ Recherche par email, nom, pseudo
- ✅ Attribution de rôles par email
- ✅ Création automatique de compte si l'utilisateur n'existe pas
- ✅ Gestion des rôles par utilisateur

### 4. Interface d'administration
- ✅ Page `/admin` dédiée
- ✅ Onglets Rôles et Utilisateurs
- ✅ Modales pour création/édition
- ✅ Confirmations de suppression

---

## 📊 Modèles de base de données

### Nouveaux modèles

1. **Role** - Rôles personnalisables
   - name, description, isSystem
   - Relations avec permissions et users

2. **Permission** - Permissions disponibles
   - key (unique), name, description, category
   - Ex: "ideas.create", "admin.access"

3. **RolePermission** - Lien rôle ↔ permission
   - Many-to-many entre Role et Permission

4. **UserRole** - Attribution rôle ↔ utilisateur
   - Many-to-many entre User et Role

### Modifications User
- Ajout du champ `isAdmin` (boolean)

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

## 🚀 Utilisation

### 1. Initialiser le système

**Important :** La première fois, vous devez initialiser les permissions.

1. Connectez-vous en tant qu'admin
2. Allez sur `/admin`
3. Exécutez dans la console du navigateur :
```javascript
fetch('/api/admin/init', { method: 'POST' })
```

Ou créez un script d'initialisation (voir ci-dessous).

### 2. Créer un rôle

1. Aller sur `/admin` → Onglet "Rôles"
2. Cliquer sur "+ Créer un rôle"
3. Remplir le nom et la description
4. Sélectionner les permissions souhaitées
5. Cliquer sur "Créer le rôle"

### 3. Attribuer un rôle à un utilisateur

**Option A - Par email (création automatique) :**
1. Aller sur `/admin` → Onglet "Utilisateurs"
2. Cliquer sur "+ Ajouter un utilisateur"
3. Entrer l'email
4. Sélectionner le rôle
5. Si l'utilisateur n'existe pas, un compte sera créé automatiquement

**Option B - Utilisateur existant :**
1. Aller sur `/admin` → Onglet "Utilisateurs"
2. Cliquer sur "Gérer les rôles" pour un utilisateur
3. Sélectionner un rôle et cliquer sur "Ajouter"

---

## 📁 Structure créée

```
app/api/admin/
├── roles/
│   ├── route.ts              # GET, POST /api/admin/roles
│   └── [id]/route.ts         # GET, PUT, DELETE
├── permissions/
│   └── route.ts              # GET /api/admin/permissions
├── users/
│   ├── route.ts              # GET /api/admin/users
│   ├── [id]/roles/
│   │   └── route.ts          # GET, POST, DELETE
│   └── by-email/
│       └── route.ts          # POST (création auto)
└── init/
    └── route.ts              # POST (initialisation)

components/admin/
├── AdminDashboard.tsx        # Dashboard principal
├── RolesList.tsx             # Liste des rôles
├── RoleForm.tsx              # Formulaire création/édition rôle
├── UsersList.tsx             # Liste des utilisateurs
├── UserRoleManager.tsx       # Gestion des rôles d'un utilisateur
└── AddUserByEmail.tsx        # Ajouter utilisateur par email

lib/
└── permissions.ts            # Système de permissions

types/
└── admin.ts                  # Types TypeScript
```

---

## 🔒 Sécurité

### Vérification des permissions

Toutes les routes admin vérifient les permissions :

```typescript
const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ROLES)
if (!hasAccess) {
  return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
}
```

### Rôles système

Les rôles marqués `isSystem: true` ne peuvent pas être :
- Modifiés
- Supprimés

Le rôle **"Fondateur"** est créé automatiquement comme rôle système principal. Ce rôle :
- A toutes les permissions
- Ne peut pas être retiré d'un utilisateur
- Est le rôle principal pour gérer toute la plateforme

### Admin et Fondateur

- **Utilisateurs avec `isAdmin: true`** : Ont automatiquement toutes les permissions
- **Rôle Fondateur** : Rôle principal avec toutes les permissions, ne peut pas être retiré
- **Recommandation** : Utilisez le rôle Fondateur plutôt que `isAdmin` pour une gestion plus fine

---

## 🎨 Interface utilisateur

### Page Administration (`/admin`)

- **Onglet Rôles** :
  - Liste des rôles avec statistiques
  - Création/édition/suppression
  - Sélection de permissions par catégorie

- **Onglet Utilisateurs** :
  - Liste de tous les utilisateurs
  - Recherche en temps réel
  - Attribution de rôles
  - Ajout par email

### Composants

- **RoleForm** - Formulaire complet avec sélection de permissions
- **UsersList** - Tableau avec recherche
- **UserRoleManager** - Gestion des rôles d'un utilisateur
- **AddUserByEmail** - Ajout rapide par email

---

## 📝 Exemples d'utilisation

### Créer un rôle "Éditeur"

1. Nom : "Éditeur"
2. Description : "Peut créer et modifier du contenu"
3. Permissions :
   - ✅ ideas.view
   - ✅ ideas.create
   - ✅ ideas.edit
   - ✅ scripts.view
   - ✅ scripts.create
   - ✅ scripts.edit
   - ✅ notes.view
   - ✅ notes.create
   - ✅ notes.edit

### Créer un rôle "Contributeur"

1. Nom : "Contributeur"
2. Description : "Peut seulement créer du contenu"
3. Permissions :
   - ✅ ideas.view
   - ✅ ideas.create
   - ✅ scripts.view
   - ✅ scripts.create
   - ✅ notes.view
   - ✅ notes.create

### Attribuer un rôle

1. Email : `nouveau@example.com`
2. Rôle : "Éditeur"
3. → Si l'utilisateur n'existe pas, un compte est créé automatiquement
4. → Le rôle est attribué immédiatement

---

## 🔧 Initialisation

### Script d'initialisation automatique

Créez un fichier `scripts/init-admin.ts` :

```typescript
import { prisma } from '../lib/prisma'
import { PERMISSIONS_BY_CATEGORY } from '../lib/permissions'

async function init() {
  // Créer les permissions
  const permissions = Object.values(PERMISSIONS_BY_CATEGORY).flat()
  // ... code d'initialisation
}

init()
```

Ou utilisez l'endpoint `/api/admin/init` (nécessite d'être admin).

---

## ✅ Checklist de configuration

- [ ] Base de données migrée avec les nouveaux modèles
- [ ] Permissions initialisées
- [ ] Rôle Admin créé
- [ ] Premier utilisateur marqué comme admin
- [ ] Interface `/admin` accessible
- [ ] Test de création de rôle
- [ ] Test d'attribution de rôle par email

---

## 🚀 Prochaines étapes

Une fois le système configuré :

1. **Marquer le premier utilisateur comme admin** :
```sql
UPDATE users SET is_admin = true WHERE email = 'votre@email.com';
```

2. **Initialiser les permissions** :
- Aller sur `/admin`
- Appeler `/api/admin/init`

3. **Créer vos premiers rôles** :
- Éditeur, Contributeur, Modérateur, etc.

4. **Attribuer des rôles** :
- Par email pour les nouveaux utilisateurs
- Via l'interface pour les utilisateurs existants

---

**Le système d'administration est maintenant complet et prêt à l'emploi !** 🎉

