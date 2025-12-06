# ⚡ Démarrage Rapide - InfluenceCore

## 🎯 Solution la plus rapide : Supabase (2 minutes)

### Étape 1 : Créer un compte Supabase

1. Allez sur https://supabase.com
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub (ou créez un compte)
4. Cliquez sur "New Project"

### Étape 2 : Configurer le projet

1. **Nom du projet** : `influencecore` (ou ce que vous voulez)
2. **Mot de passe** : Choisissez un mot de passe fort (notez-le !)
3. **Région** : Choisissez la plus proche (Europe recommandé)
4. Cliquez sur "Create new project"
5. Attendez 2-3 minutes que le projet soit créé

### Étape 3 : Récupérer la connection string

1. Dans votre projet Supabase, allez dans **Settings** (icône engrenage en bas à gauche)
2. Cliquez sur **Database**
3. Dans la section "Connection string", choisissez **URI**
4. Copiez la connection string (elle ressemble à ça) :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### Étape 4 : Configurer votre projet

1. Créez un fichier `.env` à la racine du projet (s'il n'existe pas)
2. Ajoutez :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-32-caracteres-ici"
NODE_ENV="development"
```

**Remplacez :**
- `VOTRE_MOT_DE_PASSE` par le mot de passe que vous avez défini dans Supabase
- `db.xxxxx.supabase.co` par l'URL de votre projet Supabase
- `votre-secret-32-caracteres-ici` par un secret généré (voir ci-dessous)

### Étape 5 : Générer NEXTAUTH_SECRET

**Option A - En ligne :**
- Allez sur https://generate-secret.vercel.app/32
- Copiez le secret généré

**Option B - PowerShell :**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Étape 6 : Initialiser la base de données

```powershell
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push
```

Si tout fonctionne, vous verrez :
```
✔ Your database is now in sync with your Prisma schema.
```

### Étape 7 : Lancer l'application

```powershell
npm run dev
```

Ouvrez http://localhost:3000 dans votre navigateur ! 🎉

---

## 🐳 Alternative : Docker (si vous avez Docker Desktop)

### Étape 1 : Installer Docker Desktop

1. Téléchargez : https://www.docker.com/products/docker-desktop/
2. Installez et redémarrez
3. Lancez Docker Desktop

### Étape 2 : Lancer PostgreSQL

```powershell
docker compose -f docker-compose.local.yml up -d
```

### Étape 3 : Configurer `.env`

```env
DATABASE_URL="postgresql://influencecore:influencecore123@localhost:5432/influencecore?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-32-caracteres"
NODE_ENV="development"
```

### Étape 4 : Initialiser

```powershell
npm run db:generate
npm run db:push
npm run dev
```

---

## ✅ Vérification

Une fois configuré, vous devriez pouvoir :

1. ✅ Créer un compte : http://localhost:3000/register
2. ✅ Vous connecter : http://localhost:3000/login
3. ✅ Accéder au dashboard : http://localhost:3000/dashboard
4. ✅ Créer des idées, scripts, notes, etc.

---

## 🆘 Si ça ne fonctionne pas

Consultez `TROUBLESHOOTING.md` pour résoudre les problèmes courants.

---

**Recommandation : Utilisez Supabase pour commencer rapidement ! C'est gratuit et très simple.** ⚡

