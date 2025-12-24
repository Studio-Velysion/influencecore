# 📚 Guide Complet - InfluenceCore

Guide unique et complet pour installer, configurer et utiliser InfluenceCore.

---

## 📋 Table des matières

1. [Installation](#-installation)
2. [Configuration Supabase](#-configuration-supabase)
3. [Mode de Test](#-mode-de-test)
4. [Authentification](#-authentification)
5. [Système d'Administration](#-système-dadministration)
6. [Déploiement](#-déploiement)
7. [Commandes Utiles](#-commandes-utiles)
8. [Dépannage](#-dépannage)

---

## 🚀 Installation

### Prérequis

- Node.js 20 ou supérieur
- npm ou yarn
- Un compte [Supabase](https://supabase.com) (gratuit)

### Étapes d'installation

1. **Installer les dépendances**
   ```powershell
   npm install
   ```

2. **Configurer Supabase** (voir section suivante)

3. **Installer la base de données**
   ```powershell
   npm run db:setup
   ```

4. **Lancer l'application**
   ```powershell
   npm run dev
   ```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

---

## 🧪 Base de Données Temporaire pour Tests

### Option : Base de données SQLite temporaire (Sans Docker) ⭐

Si vous voulez tester rapidement sans configurer Supabase ou Docker, vous pouvez utiliser une base de données SQLite temporaire :

**Avantages :**
- ✅ Pas besoin de Docker
- ✅ Pas besoin de Supabase
- ✅ Installation en quelques secondes
- ✅ Fichier simple à supprimer

**Étapes :**

1. **Créer la base de données temporaire :**
   ```powershell
   npm run test:setup
   ```

   Cette commande :
   - ✅ Crée un fichier SQLite local (`test.db`)
   - ✅ Crée toutes les tables
   - ✅ Crée les utilisateurs de test
   - ✅ Configure `.env.local` automatiquement
   - ✅ Sauvegarde votre ancien `.env.local` si existant

2. **Tester l'application :**
   ```powershell
   npm run dev
   ```

3. **Après les tests, supprimer la base de données :**
   ```powershell
   npm run test:cleanup
   ```

   Cette commande :
   - ✅ Supprime le fichier `test.db`
   - ✅ Restaure votre `.env.local` précédent
   - ✅ Restaure le schéma Prisma original
   - ✅ Nettoie tous les fichiers temporaires

⚠️ **Important :** La base de données temporaire est complètement supprimée après `test:cleanup`. Toutes les données seront perdues.

### Option : Base de données Docker (Si Docker est installé)

Si vous avez Docker Desktop installé, vous pouvez utiliser PostgreSQL via Docker :

```powershell
npm run test:setup:docker
```

Cette commande utilise un conteneur PostgreSQL temporaire (port 5433).

---

## ☁️ Configuration Supabase (Production)

### Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub (recommandé) ou créez un compte email
4. Cliquez sur **"New Project"**
5. Remplissez les informations :
   - **Nom du projet** : `influencecore` (ou ce que vous voulez)
   - **Mot de passe de la base de données** : Choisissez un mot de passe fort (⚠️ **Notez-le !**)
   - **Région** : Choisissez la plus proche (Europe recommandé)
   - **Plan** : Free (gratuit)
6. Cliquez sur **"Create new project"**
7. ⏳ Attendez 2-3 minutes que le projet soit créé

### Récupérer la Connection String

1. Dans votre projet Supabase, allez dans **Settings** (icône engrenage en bas à gauche)
2. Cliquez sur **Database** dans le menu de gauche
3. Faites défiler jusqu'à la section **"Connection string"**
4. Sélectionnez l'onglet **"URI"**
5. Copiez la connection string (elle ressemble à ça) :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. ⚠️ **Important** : Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez défini

### Configurer le fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet :

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-aleatoire-ici"

# Node Environment
NODE_ENV=development

# Mode de test (optionnel - pour bypasser l'authentification)
BYPASS_AUTH=false
TEST_USER_TYPE=normal

# Stripe (optionnel)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

**Remplacez :**
- `VOTRE_MOT_DE_PASSE` par le mot de passe de votre projet Supabase
- `db.xxxxx.supabase.co` par l'URL de votre projet Supabase
- `votre-secret-aleatoire-ici` par un secret généré (voir ci-dessous)

### Générer NEXTAUTH_SECRET

**Option A - PowerShell :**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Option B - En ligne :**
- Allez sur https://generate-secret.vercel.app/32
- Copiez le secret généré

### Installer la base de données

```powershell
npm run db:setup
```

Cette commande fait automatiquement :
- ✅ Vérifie la connexion à Supabase
- ✅ Génère le client Prisma
- ✅ Crée toutes les tables
- ✅ Crée les utilisateurs de test

---

## 🧪 Mode de Test

### Utilisateurs de Test Disponibles

Deux utilisateurs de test sont créés automatiquement :

**Utilisateur Normal :**
- Email : `test@example.com`
- Mot de passe : `test123`
- Admin : `false`

**Utilisateur Admin :**
- Email : `admin@example.com`
- Mot de passe : `test123`
- Admin : `true`

### Activer le Mode Test (Bypass Authentification)

Pour tester sans passer par la connexion :

1. Ajoutez dans `.env.local` :
   ```env
   BYPASS_AUTH=true
   TEST_USER_TYPE=normal  # ou 'admin' pour tester en mode admin
   ```

2. Redémarrez le serveur :
   ```powershell
   npm run dev
   ```

3. Accédez directement aux pages :
   - http://localhost:3000/dashboard
   - http://localhost:3000/ideas
   - http://localhost:3000/scripts
   - http://localhost:3000/admin (si `TEST_USER_TYPE=admin`)

### Se connecter avec les utilisateurs de test

Même sans activer `BYPASS_AUTH`, vous pouvez vous connecter normalement avec les identifiants de test.

⚠️ **IMPORTANT** : Ne jamais activer `BYPASS_AUTH=true` en production !

---

## 🔐 Authentification

### Fonctionnalités

- ✅ Inscription (Register) - `/register`
- ✅ Connexion (Login) - `/login`
- ✅ Déconnexion (Logout)
- ✅ Protection des routes via middleware
- ✅ Sessions JWT sécurisées
- ✅ Hashage des mots de passe (bcryptjs)

### Routes protégées

Les routes suivantes nécessitent une authentification :
- `/dashboard/*`
- `/ideas/*`
- `/scripts/*`
- `/calendar/*`
- `/notes/*`
- `/admin/*`

### Structure des fichiers

```
app/
├── api/auth/
│   ├── [...nextauth]/route.ts    # Configuration NextAuth
│   └── register/route.ts         # API d'inscription
├── login/page.tsx                 # Page de connexion
├── register/page.tsx              # Page d'inscription
└── dashboard/page.tsx             # Dashboard (protégé)

components/auth/
├── LoginForm.tsx                  # Formulaire de connexion
├── RegisterForm.tsx               # Formulaire d'inscription
└── LogoutButton.tsx               # Bouton de déconnexion

lib/auth.ts                        # Utilitaires d'authentification
middleware.ts                      # Protection des routes
```

---

## 👑 Système d'Administration

### Accès Admin

Pour accéder à l'interface d'administration :
1. Connectez-vous avec l'utilisateur admin : `admin@example.com` / `test123`
2. Allez sur `/admin`

### Fonctionnalités Admin

- ✅ **Gestion des rôles** : Créer, modifier, supprimer des rôles personnalisés
- ✅ **Gestion des permissions** : 20+ permissions prédéfinies organisées par catégories
- ✅ **Gestion des utilisateurs** : Liste, recherche, attribution de rôles par email
- ✅ **Création automatique** : Création de compte si l'utilisateur n'existe pas

### Initialiser le système admin

1. Connectez-vous avec votre compte admin
2. Allez sur `/admin`
3. Le système initialise automatiquement les permissions et le rôle "Fondateur"

### Créer un rôle personnalisé

1. Allez sur `/admin` → Onglet "Rôles"
2. Cliquez sur "+ Créer un rôle"
3. Remplissez le nom et la description
4. Sélectionnez les permissions
5. Cliquez sur "Créer"

### Attribuer un rôle par email

1. Allez sur `/admin` → Onglet "Utilisateurs"
2. Utilisez le widget "Attribuer un rôle par email"
3. Entrez l'email et sélectionnez le rôle
4. Cliquez sur "Attribuer"

Si l'utilisateur n'existe pas, un compte sera créé automatiquement.

---

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé) ⭐

**Avantages :**
- Gratuit pour commencer
- Optimisé pour Next.js
- Déploiement automatique depuis Git
- CDN global
- SSL automatique

**Étapes :**

1. **Préparer le projet :**
   ```bash
   npm run build
   ```

2. **Créer un compte Vercel :**
   - Allez sur https://vercel.com
   - Connectez-vous avec GitHub

3. **Importer le projet :**
   - Cliquez sur "New Project"
   - Importez votre repository

4. **Configurer les variables d'environnement :**
   - Dans les paramètres du projet → Environment Variables
   - Ajoutez :
     ```
     DATABASE_URL=votre_connection_string_supabase
     NEXTAUTH_URL=https://votre-domaine.vercel.app
     NEXTAUTH_SECRET=votre_secret
     NODE_ENV=production
     ```

5. **Déployer :**
   - Vercel déploie automatiquement à chaque push sur la branche principale

### Option 2 : Railway

1. Créez un projet sur Railway
2. Ajoutez PostgreSQL (ou utilisez Supabase)
3. Déployez depuis Git
4. Configurez les variables d'environnement

### Option 3 : VPS avec Docker

1. Utilisez `docker-compose.yml`
2. Configurez Nginx
3. Déployez avec PM2 ou Docker

---

## 🛠️ Commandes Utiles

```powershell
# Développement
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run start            # Serveur de production
npm run lint             # Linter ESLint

# Base de données
npm run db:setup         # Installation automatique (Supabase + tables + utilisateurs test)
npm run db:generate      # Générer le client Prisma
npm run db:push          # Appliquer le schéma (dev)
npm run db:migrate       # Créer une migration
npm run db:studio        # Interface graphique Prisma
npm run test:create-users # Créer les utilisateurs de test

# Base de données temporaire pour tests
npm run test:setup       # Créer une base de données temporaire locale (Docker)
npm run test:cleanup     # Supprimer la base de données temporaire et nettoyer
```

---

## 🆘 Dépannage

### Erreur : "Can't reach database server"

**Problème** : La base de données n'est pas accessible.

**Solutions :**
1. Vérifiez que votre `DATABASE_URL` est correcte dans `.env.local`
2. Vérifiez que le mot de passe est bien remplacé (pas `[YOUR-PASSWORD]`)
3. Vérifiez que votre projet Supabase est actif (pas en pause)
4. Vérifiez que vous avez bien remplacé `db.xxxxx.supabase.co` par l'URL de votre projet

### Erreur : "password authentication failed"

**Problème** : Le mot de passe est incorrect.

**Solutions :**
1. Vérifiez que vous avez remplacé `[YOUR-PASSWORD]` par votre vrai mot de passe
2. Le mot de passe peut contenir des caractères spéciaux, assurez-vous qu'il est bien encodé dans l'URL
3. Si le mot de passe contient des caractères spéciaux, vous devrez peut-être l'encoder en URL

### Erreur : "database does not exist"

**Problème** : Le nom de la base de données est incorrect.

**Solution :** Supabase crée automatiquement la base `postgres`. Utilisez `postgres` comme nom de base dans la connection string (pas `influencecore`).

### Le script `db:setup` échoue

**Solutions :**
1. Vérifiez que votre `.env.local` existe et contient `DATABASE_URL`
2. Vérifiez que la connection string est correcte
3. Vérifiez que votre projet Supabase est actif
4. Essayez de vous connecter manuellement via l'interface Supabase pour vérifier vos identifiants

### Erreur Prisma

```bash
npm run db:generate
npm run db:push
```

### Port 3000 utilisé

```bash
npm run dev -- -p 3001
```

---

## 📚 Ressources

- **Documentation Supabase** : https://supabase.com/docs
- **Dashboard Supabase** : https://app.supabase.com
- **Support Supabase** : https://supabase.com/docs/support
- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation Prisma** : https://www.prisma.io/docs

---

## 🎉 C'est prêt !

Votre application est maintenant configurée et prête à être utilisée. Vous pouvez :

- ✅ Créer des idées vidéo
- ✅ Écrire des scripts
- ✅ Gérer votre calendrier éditorial
- ✅ Prendre des notes rapides
- ✅ Accéder à l'interface admin
- ✅ Gérer les rôles et permissions

**Bon développement ! 🚀**

