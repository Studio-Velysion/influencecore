# 🗄️ Configuration de la Base de Données - InfluenceCore

## Type de serveur requis

**InfluenceCore nécessite un serveur PostgreSQL** pour stocker toutes les données (utilisateurs, idées, scripts, notes, etc.).

---

## 🎯 Options de serveur PostgreSQL

### Option 1 : PostgreSQL Local (Développement) ⭐ Recommandé pour commencer

**Avantages :**
- Gratuit
- Rapide pour le développement
- Contrôle total
- Pas de limite de données

**Installation sur Windows :**

1. **Télécharger PostgreSQL :**
   - Allez sur https://www.postgresql.org/download/windows/
   - Téléchargez l'installateur officiel
   - Version recommandée : PostgreSQL 14+

2. **Installer :**
   - Lancez l'installateur
   - Notez le mot de passe du superutilisateur `postgres` (vous en aurez besoin)
   - Port par défaut : `5432`

3. **Créer la base de données :**
   ```powershell
   # Via pgAdmin (interface graphique incluse)
   # Ou via ligne de commande :
   psql -U postgres
   CREATE DATABASE influencecore;
   \q
   ```

4. **Configuration `.env` :**
   ```env
   DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/influencecore?schema=public"
   ```

---

### Option 2 : Supabase (Cloud - Gratuit jusqu'à 500MB) ⭐ Recommandé pour production

**Avantages :**
- Gratuit pour commencer (500MB de base de données)
- Hébergement cloud (pas d'installation locale)
- Interface graphique incluse
- Backups automatiques
- API REST incluse
- Storage pour fichiers

**Configuration :**

1. **Créer un compte :**
   - Allez sur https://supabase.com
   - Créez un compte gratuit

2. **Créer un projet :**
   - Cliquez sur "New Project"
   - Choisissez un nom (ex: "influencecore")
   - Choisissez une région (Europe recommandé)
   - Attendez la création (2-3 minutes)

3. **Récupérer la connection string :**
   - Allez dans Settings → Database
   - Copiez la "Connection string" (URI)
   - Format : `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

4. **Configuration `.env` :**
   ```env
   DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"
   ```

**Limites gratuites :**
- 500MB de base de données
- 2GB de bande passante
- Parfait pour commencer et tester

---

### Option 3 : Railway (Cloud - Payant après crédit gratuit)

**Avantages :**
- $5 de crédit gratuit au départ
- Simple à configurer
- Bon pour production

**Configuration :**
1. Créez un compte sur https://railway.app
2. Créez un nouveau projet
3. Ajoutez PostgreSQL
4. Récupérez la connection string

---

### Option 4 : Neon (Cloud - Gratuit jusqu'à 3GB)

**Avantages :**
- 3GB gratuits (plus généreux que Supabase)
- PostgreSQL serverless
- Bon pour production

**Configuration :**
1. Créez un compte sur https://neon.tech
2. Créez un projet
3. Récupérez la connection string

---

### Option 5 : Votre propre serveur VPS

**Si vous avez un serveur :**
- Installez PostgreSQL sur votre VPS
- Configurez les accès
- Utilisez la connection string

---

## 📋 Comparaison rapide

| Solution | Coût | Complexité | Recommandation |
|----------|------|------------|----------------|
| **PostgreSQL Local** | Gratuit | Moyenne | ⭐ Développement |
| **Supabase** | Gratuit (500MB) | Facile | ⭐⭐ Production/Développement |
| **Neon** | Gratuit (3GB) | Facile | ⭐⭐ Production |
| **Railway** | Payant après crédit | Facile | Production |
| **VPS Personnel** | Variable | Élevée | Avancé |

---

## 🚀 Recommandation selon votre cas

### Pour commencer / Développement local
→ **PostgreSQL Local** ou **Supabase**

### Pour tester en production
→ **Supabase** (gratuit, facile, fiable)

### Pour production réelle
→ **Supabase** (plan payant) ou **Neon** (plus généreux en gratuit)

---

## ⚙️ Configuration après choix du serveur

### 1. Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet :

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-ici-généré-avec-openssl-rand-base64-32"

# App
NODE_ENV="development"
```

### 2. Générer le secret NextAuth

```powershell
# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))

# Ou utilisez un générateur en ligne : https://generate-secret.vercel.app/32
```

### 3. Initialiser la base de données

```powershell
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push
```

### 4. Vérifier que tout fonctionne

```powershell
# Ouvrir Prisma Studio (interface graphique)
npm run db:studio
```

Cela ouvrira http://localhost:5555 où vous pourrez voir vos tables.

---

## 🐛 Dépannage

### Erreur de connexion

**Vérifiez :**
1. Que le serveur PostgreSQL tourne
2. Que la connection string est correcte dans `.env`
3. Que le firewall autorise le port 5432 (si local)
4. Que les identifiants sont corrects

**Test de connexion :**
```powershell
# Si PostgreSQL local
psql -U postgres -d influencecore

# Si Supabase/Cloud
# Testez via l'interface web de votre provider
```

### Erreur "database does not exist"

Créez la base de données :
```sql
CREATE DATABASE influencecore;
```

### Erreur Prisma

```powershell
# Régénérer le client
npm run db:generate

# Réappliquer le schéma
npm run db:push
```

---

## 📚 Ressources

- **PostgreSQL Local :** https://www.postgresql.org/download/
- **Supabase :** https://supabase.com
- **Neon :** https://neon.tech
- **Railway :** https://railway.app
- **Documentation Prisma :** https://www.prisma.io/docs

---

## ✅ Checklist de configuration

- [ ] Serveur PostgreSQL choisi et configuré
- [ ] Base de données créée
- [ ] Fichier `.env` créé avec `DATABASE_URL` correct
- [ ] `NEXTAUTH_SECRET` généré et ajouté
- [ ] `npm run db:generate` exécuté
- [ ] `npm run db:push` exécuté avec succès
- [ ] Prisma Studio accessible (optionnel)
- [ ] Application démarre sans erreur DB

Une fois ces étapes complétées, votre application InfluenceCore sera prête à fonctionner ! 🚀

