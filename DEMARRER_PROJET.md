# 🚀 Comment Démarrer le Projet InfluenceCore

Guide complet pour démarrer le projet en local ou sur le serveur.

---

## 📋 Table des matières

1. [Démarrage Local (Développement)](#démarrage-local-développement)
2. [Démarrage sur Serveur (Production)](#démarrage-sur-serveur-production)
3. [Vérification](#vérification)
4. [Dépannage](#dépannage)

---

## 💻 Démarrage Local (Développement)

### Prérequis

- Node.js 20 ou supérieur
- PostgreSQL (ou Docker avec PostgreSQL)
- npm ou yarn

### Étapes

#### 1. Cloner le repository

```bash
git clone https://github.com/Studio-Velysion/influencecore.git
cd influencecore
```

#### 2. Installer les dépendances

```bash
npm install
```

#### 3. Configurer la base de données

**Option A : Avec Docker (Recommandé)**

```bash
# Démarrer PostgreSQL avec Docker
docker compose -f docker-compose.local.yml up -d

# Attendre que PostgreSQL soit prêt (quelques secondes)
```

**Option B : PostgreSQL local**

Assurez-vous que PostgreSQL est installé et en cours d'exécution.

#### 4. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
nano .env
```

Contenu minimal du `.env` :

```env
# Database
DATABASE_URL="postgresql://influencecore:CHANGE_THIS_PASSWORD@localhost:5432/influencecore?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-aleatoire-ici"

# Stripe (optionnel pour le développement)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Node Environment
NODE_ENV=development
```

**Générer NEXTAUTH_SECRET** :

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### 5. Créer la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push
```

#### 6. Démarrer l'application

```bash
# Mode développement (avec hot-reload)
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

---

## 🖥️ Démarrage sur Serveur (Production)

### Méthode 1 : Script Automatique (Recommandé)

```bash
# 1. Cloner le repository
cd /var/www
git clone https://github.com/Studio-Velysion/influencecore.git
cd influencecore

# 2. Exécuter le script de configuration complète
chmod +x scripts/first-time-setup.sh
sudo ./scripts/first-time-setup.sh
```

Le script va :
- ✅ Installer toutes les dépendances
- ✅ Configurer Docker et PostgreSQL
- ✅ Créer le fichier `.env`
- ✅ Installer les dépendances npm
- ✅ Créer la base de données
- ✅ Builder l'application
- ✅ Démarrer avec PM2

### Méthode 2 : Étapes Manuelles

#### 1. Installation du serveur

```bash
cd /var/www/influencecore
chmod +x scripts/auto-deploy-server.sh
sudo ./scripts/auto-deploy-server.sh
```

#### 2. Déploiement de l'application

```bash
cd /var/www/influencecore
chmod +x scripts/deploy-app.sh
./scripts/deploy-app.sh
```

### Méthode 3 : Démarrage Manuel

Si l'application est déjà configurée :

```bash
cd /var/www/influencecore

# 1. Vérifier que PostgreSQL est en cours d'exécution
docker compose -f docker-compose.db.yml up -d

# 2. Vérifier le fichier .env
cat .env

# 3. Installer les dépendances (si nécessaire)
npm ci

# 4. Générer le client Prisma
npm run db:generate

# 5. Mettre à jour la base de données (si nécessaire)
npm run db:push

# 6. Builder l'application
npm run build

# 7. Démarrer avec PM2
pm2 start npm --name influencecore -- start
pm2 save
```

---

## ✅ Vérification

### Vérifier que tout fonctionne

```bash
# Sur le serveur, utilisez le script de vérification
cd /var/www/influencecore
chmod +x scripts/quick-access.sh
./scripts/quick-access.sh
```

### Commandes de vérification manuelle

```bash
# Vérifier PM2
pm2 status

# Vérifier PostgreSQL
docker ps | grep postgres

# Vérifier les logs
pm2 logs influencecore

# Tester l'accès local
curl http://localhost:3000
```

---

## 🔄 Commandes Utiles

### Développement Local

```bash
npm run dev          # Démarrer en mode développement
npm run build        # Builder l'application
npm run start        # Démarrer en mode production
npm run db:generate  # Générer le client Prisma
npm run db:push      # Créer/mettre à jour la base de données
npm run db:studio    # Ouvrir Prisma Studio
```

### Production (Serveur)

```bash
# PM2
pm2 status                    # Voir le statut
pm2 logs influencecore       # Voir les logs
pm2 restart influencecore    # Redémarrer
pm2 stop influencecore       # Arrêter
pm2 delete influencecore     # Supprimer
pm2 monit                    # Monitorer

# Docker
docker compose -f docker-compose.db.yml up -d    # Démarrer PostgreSQL
docker compose -f docker-compose.db.yml down     # Arrêter PostgreSQL
docker compose -f docker-compose.db.yml restart # Redémarrer PostgreSQL
docker logs influencecore-postgres               # Logs PostgreSQL

# Base de données
npm run db:generate  # Générer Prisma Client
npm run db:push      # Mettre à jour la DB
```

---

## 🐛 Dépannage

### L'application ne démarre pas

**Erreur : "Cannot connect to database"**

```bash
# Vérifier que PostgreSQL est en cours d'exécution
docker ps | grep postgres

# Si non, démarrer PostgreSQL
docker compose -f docker-compose.db.yml up -d

# Vérifier DATABASE_URL dans .env
cat .env | grep DATABASE_URL
```

**Erreur : "Port 3000 already in use"**

```bash
# Trouver le processus qui utilise le port
sudo lsof -i :3000

# Arrêter le processus ou changer le port dans package.json
```

**Erreur : "Module not found"**

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### La base de données ne se connecte pas

```bash
# Tester la connexion PostgreSQL
docker exec influencecore-postgres pg_isready -U influencecore

# Vérifier les variables d'environnement
cat .env | grep DATABASE_URL

# Se connecter manuellement à PostgreSQL
docker exec -it influencecore-postgres psql -U influencecore -d influencecore
```

### PM2 ne démarre pas l'application

```bash
# Voir les erreurs
pm2 logs influencecore --err

# Redémarrer
pm2 restart influencecore

# Si ça ne fonctionne pas, supprimer et recréer
pm2 delete influencecore
pm2 start npm --name influencecore -- start
pm2 save
```

---

## 📝 Checklist de Démarrage

### Local (Développement)

- [ ] Repository cloné
- [ ] Dépendances installées (`npm install`)
- [ ] PostgreSQL en cours d'exécution (Docker ou local)
- [ ] Fichier `.env` créé avec les bonnes valeurs
- [ ] Client Prisma généré (`npm run db:generate`)
- [ ] Base de données créée (`npm run db:push`)
- [ ] Application démarrée (`npm run dev`)
- [ ] Accessible sur http://localhost:3000

### Serveur (Production)

- [ ] Serveur configuré (script `auto-deploy-server.sh`)
- [ ] Repository cloné dans `/var/www/influencecore`
- [ ] Fichier `.env` créé avec les bonnes valeurs
- [ ] PostgreSQL en cours d'exécution (Docker)
- [ ] Application buildée (`npm run build`)
- [ ] Application démarrée avec PM2
- [ ] Port 3000 ouvert dans le firewall
- [ ] Application accessible (localement ou publiquement)

---

## 🎯 Accès à l'Application

Une fois démarrée, l'application est accessible sur :

- **Local** : http://localhost:3000
- **Serveur (local)** : http://localhost:3000
- **Serveur (public)** : http://VOTRE_IP:3000
- **Avec domaine** : https://votre-domaine.com

---

## 📚 Documentation Complémentaire

- `ACCES_APPLICATION.md` - Guide d'accès détaillé
- `AUTO_DEPLOY_SERVER.md` - Guide de déploiement serveur
- `INSTALLATION.md` - Guide d'installation complet
- `QUICK_START.md` - Démarrage rapide

---

**🎉 Votre application InfluenceCore est maintenant démarrée !**

