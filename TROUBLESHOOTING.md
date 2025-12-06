# 🔧 Dépannage - Erreur de connexion PostgreSQL

## ❌ Erreur rencontrée

```
Error: P1001: Can't reach database server at `localhost:5432`
```

Cette erreur signifie que PostgreSQL n'est pas accessible sur votre machine locale.

---

## ✅ Solutions

### Option 1 : Installer PostgreSQL localement (Windows)

#### Étape 1 : Télécharger PostgreSQL

1. Allez sur : https://www.postgresql.org/download/windows/
2. Téléchargez l'installateur officiel (version 15+ recommandée)
3. Ou utilisez le lien direct : https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

#### Étape 2 : Installer

1. Lancez l'installateur
2. Suivez l'assistant d'installation
3. **Important** : Notez le mot de passe que vous définissez pour l'utilisateur `postgres`
4. Port par défaut : `5432` (gardez-le)
5. Installation complète

#### Étape 3 : Vérifier l'installation

```powershell
# Vérifier que le service tourne
Get-Service -Name "*postgres*"

# Ou via pgAdmin (interface graphique incluse)
# Cherchez "pgAdmin 4" dans le menu Démarrer
```

#### Étape 4 : Créer la base de données

**Via pgAdmin (recommandé) :**
1. Ouvrez pgAdmin 4
2. Connectez-vous avec le mot de passe défini
3. Clic droit sur "Databases" → "Create" → "Database"
4. Nom : `influencecore`
5. Cliquez sur "Save"

**Via ligne de commande :**
```powershell
# Trouver le chemin de psql (généralement dans Program Files)
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres

# Dans psql, exécutez :
CREATE DATABASE influencecore;
\q
```

#### Étape 5 : Mettre à jour `.env`

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/influencecore?schema=public"
```

Remplacez `VOTRE_MOT_DE_PASSE` par le mot de passe défini lors de l'installation.

---

### Option 2 : Utiliser Docker (Plus simple) ⭐ Recommandé

#### Étape 1 : Installer Docker Desktop

1. Téléchargez Docker Desktop pour Windows : https://www.docker.com/products/docker-desktop/
2. Installez et redémarrez votre PC
3. Lancez Docker Desktop

#### Étape 2 : Lancer PostgreSQL avec Docker

Créez un fichier `docker-compose.local.yml` à la racine du projet :

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: influencecore-postgres-local
    restart: always
    environment:
      POSTGRES_USER: influencecore
      POSTGRES_PASSWORD: influencecore123
      POSTGRES_DB: influencecore
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Étape 3 : Lancer le conteneur

```powershell
docker compose -f docker-compose.local.yml up -d
```

#### Étape 4 : Mettre à jour `.env`

```env
DATABASE_URL="postgresql://influencecore:influencecore123@localhost:5432/influencecore?schema=public"
```

#### Étape 5 : Vérifier que ça fonctionne

```powershell
npm run db:push
```

---

### Option 3 : Utiliser Supabase (Cloud - Gratuit) ⭐⭐ Très simple

#### Étape 1 : Créer un compte Supabase

1. Allez sur : https://supabase.com
2. Créez un compte gratuit
3. Créez un nouveau projet

#### Étape 2 : Récupérer la connection string

1. Dans votre projet Supabase, allez dans **Settings** → **Database**
2. Copiez la **Connection string** (URI)
3. Format : `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

#### Étape 3 : Mettre à jour `.env`

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"
```

Remplacez par votre connection string complète.

#### Étape 4 : Tester

```powershell
npm run db:push
```

**Avantages :**
- ✅ Pas d'installation
- ✅ Gratuit jusqu'à 500MB
- ✅ Accessible de partout
- ✅ Backups automatiques

---

### Option 4 : Utiliser votre VPS

Si vous avez déjà configuré PostgreSQL sur votre VPS :

#### Étape 1 : Récupérer la connection string

Depuis votre VPS, la connection string est :
```
postgresql://influencecore:VOTRE_MOT_DE_PASSE@VOTRE_IP_VPS:5432/influencecore?schema=public
```

#### Étape 2 : Mettre à jour `.env`

```env
DATABASE_URL="postgresql://influencecore:VOTRE_MOT_DE_PASSE@VOTRE_IP_VPS:5432/influencecore?schema=public"
```

**⚠️ Sécurité :** Pour la production, utilisez un tunnel SSH au lieu d'exposer le port publiquement.

---

## 🔍 Vérification de la connexion

### Test 1 : Vérifier que PostgreSQL tourne

**Windows Service :**
```powershell
Get-Service -Name "*postgres*"
```

**Docker :**
```powershell
docker ps | Select-String postgres
```

### Test 2 : Tester la connexion

```powershell
# Si PostgreSQL local
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d influencecore

# Si Docker
docker exec -it influencecore-postgres-local psql -U influencecore -d influencecore
```

### Test 3 : Vérifier Prisma

```powershell
# Générer le client
npm run db:generate

# Tester la connexion
npm run db:push
```

---

## 🐛 Problèmes courants

### Problème 1 : Port 5432 déjà utilisé

**Solution :**
```powershell
# Trouver quel processus utilise le port
netstat -ano | findstr :5432

# Ou changer le port dans docker-compose.yml
ports:
  - "5433:5432"  # Utiliser 5433 au lieu de 5432
```

Puis mettre à jour `.env` :
```env
DATABASE_URL="postgresql://...@localhost:5433/..."
```

### Problème 2 : Mot de passe incorrect

**Vérifiez :**
- Le mot de passe dans `.env` correspond à celui de PostgreSQL
- Pas d'espaces avant/après dans `.env`
- Les guillemets sont corrects

### Problème 3 : Base de données n'existe pas

**Solution :**
```sql
-- Se connecter à PostgreSQL
psql -U postgres

-- Créer la base
CREATE DATABASE influencecore;

-- Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE influencecore TO postgres;
```

### Problème 4 : Firewall bloque la connexion

**Solution :**
```powershell
# Autoriser PostgreSQL dans le firewall Windows
New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -LocalPort 5432 -Protocol TCP -Action Allow
```

---

## 📋 Checklist de résolution

- [ ] PostgreSQL est installé OU Docker est installé OU compte Supabase créé
- [ ] Le service PostgreSQL tourne (ou conteneur Docker)
- [ ] La base de données `influencecore` existe
- [ ] Le fichier `.env` contient la bonne `DATABASE_URL`
- [ ] Le mot de passe dans `.env` est correct
- [ ] Le port 5432 est accessible
- [ ] `npm run db:generate` fonctionne
- [ ] `npm run db:push` fonctionne

---

## 🚀 Solution rapide recommandée

**Pour commencer rapidement, utilisez Supabase :**

1. Créez un compte sur https://supabase.com (2 minutes)
2. Créez un projet
3. Copiez la connection string
4. Mettez à jour `.env`
5. `npm run db:push`

**C'est la solution la plus rapide et la plus simple !** ⚡

---

## 📚 Liens utiles

- **PostgreSQL Windows** : https://www.postgresql.org/download/windows/
- **Docker Desktop** : https://www.docker.com/products/docker-desktop/
- **Supabase** : https://supabase.com
- **pgAdmin** : https://www.pgadmin.org/

---

Une fois la connexion établie, vous pourrez lancer `npm run db:push` sans erreur ! 🎉

