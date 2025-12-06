# 🚀 Déploiement Automatique Serveur - InfluenceCore

Guide complet pour le déploiement automatique sur votre serveur VPS.

---

## 📋 Vue d'ensemble

Le système de déploiement automatique comprend 3 scripts principaux :

1. **`scripts/auto-deploy-server.sh`** - Installation initiale du serveur
2. **`scripts/deploy-app.sh`** - Déploiement de l'application
3. **`scripts/first-time-setup.sh`** - Configuration complète en une fois

---

## 🎯 Installation Initiale (Première fois)

### Option 1 : Script complet (Recommandé)

Sur votre serveur VPS, exécutez :

```bash
# Cloner le repository
cd /var/www
git clone https://github.com/Studio-Velysion/influencecore.git
cd influencecore

# Exécuter le script de configuration initiale
chmod +x scripts/first-time-setup.sh
sudo ./scripts/first-time-setup.sh
```

Ce script va :
- ✅ Installer toutes les dépendances (Node.js, Docker, PM2)
- ✅ Configurer PostgreSQL via Docker
- ✅ Créer le fichier `.env` avec les bonnes URLs
- ✅ Installer les dépendances npm
- ✅ Générer le client Prisma
- ✅ Créer la base de données
- ✅ Builder l'application
- ✅ Démarrer l'application avec PM2

### Option 2 : Étapes manuelles

Si vous préférez faire étape par étape :

```bash
# 1. Installation du serveur
sudo ./scripts/auto-deploy-server.sh

# 2. Cloner le repository (si pas déjà fait)
cd /var/www
git clone https://github.com/Studio-Velysion/influencecore.git
cd influencecore

# 3. Déployer l'application
./scripts/deploy-app.sh
```

---

## 🔄 Déploiement Automatique (Après la première installation)

Une fois la configuration initiale terminée, le déploiement se fait automatiquement via **GitHub Actions** à chaque `git push origin main`.

Le workflow GitHub Actions :
1. Build l'application
2. Se connecte au serveur via SSH
3. Met à jour le code (`git pull`)
4. Exécute `deploy-app.sh`
5. Redémarre l'application avec PM2

---

## 📝 Ce que font les scripts

### `auto-deploy-server.sh`

Installe et configure :
- ✅ Mise à jour du système
- ✅ Node.js 20
- ✅ Docker et Docker Compose
- ✅ PM2
- ✅ PostgreSQL via Docker
- ✅ Variables d'environnement (`.env`)
- ✅ Génération automatique des mots de passe sécurisés

**Variables générées automatiquement :**
- `DATABASE_URL` - URL de connexion PostgreSQL
- `NEXTAUTH_SECRET` - Secret NextAuth (généré aléatoirement)
- `DB_PASSWORD` - Mot de passe PostgreSQL (généré aléatoirement)

**Variables à fournir :**
- `NEXTAUTH_URL` - URL de votre application (ex: `https://votre-domaine.com`)
- `STRIPE_SECRET_KEY` - Clé secrète Stripe (optionnel)
- `STRIPE_WEBHOOK_SECRET` - Secret webhook Stripe (optionnel)

### `deploy-app.sh`

Déploie l'application :
- ✅ Vérifie que PostgreSQL est en cours d'exécution
- ✅ Installe les dépendances npm
- ✅ Génère le client Prisma
- ✅ Crée/met à jour la base de données (`prisma db push`)
- ✅ Build l'application Next.js
- ✅ Démarre/redémarre avec PM2

---

## 🔧 Configuration Manuelle

### Modifier les variables d'environnement

Éditez le fichier `.env` dans `/var/www/influencecore/` :

```bash
nano /var/www/influencecore/.env
```

Variables importantes :
```env
DATABASE_URL="postgresql://influencecore:MOT_DE_PASSE@localhost:5432/influencecore?schema=public"
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-nextauth"
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NODE_ENV=production
```

### Redémarrer l'application

```bash
cd /var/www/influencecore
pm2 restart influencecore
```

### Voir les logs

```bash
pm2 logs influencecore
```

### Arrêter l'application

```bash
pm2 stop influencecore
```

---

## 🗄️ Gestion de la Base de Données

### Accéder à PostgreSQL

```bash
docker exec -it influencecore-postgres psql -U influencecore -d influencecore
```

### Redémarrer PostgreSQL

```bash
cd /var/www/influencecore
docker-compose -f docker-compose.db.yml restart
```

### Voir les logs PostgreSQL

```bash
docker logs influencecore-postgres
```

### Sauvegarder la base de données

```bash
docker exec influencecore-postgres pg_dump -U influencecore influencecore > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurer la base de données

```bash
docker exec -i influencecore-postgres psql -U influencecore -d influencecore < backup.sql
```

---

## 🔍 Vérification

### Vérifier que tout fonctionne

```bash
# Vérifier PM2
pm2 status

# Vérifier Docker
docker ps

# Vérifier PostgreSQL
docker exec influencecore-postgres pg_isready -U influencecore

# Vérifier l'application
curl http://localhost:3000
```

### Vérifier les logs

```bash
# Logs de l'application
pm2 logs influencecore

# Logs PostgreSQL
docker logs influencecore-postgres

# Logs système
journalctl -u pm2-root -f
```

---

## 🐛 Dépannage

### L'application ne démarre pas

1. Vérifier les logs : `pm2 logs influencecore`
2. Vérifier que `.env` existe et est correct
3. Vérifier que PostgreSQL est en cours d'exécution
4. Vérifier que le port 3000 n'est pas utilisé

### PostgreSQL ne démarre pas

1. Vérifier les logs : `docker logs influencecore-postgres`
2. Vérifier que le port 5432 n'est pas utilisé
3. Redémarrer : `docker-compose -f docker-compose.db.yml restart`

### Erreur de connexion à la base de données

1. Vérifier `DATABASE_URL` dans `.env`
2. Vérifier que PostgreSQL est en cours d'exécution
3. Tester la connexion : `docker exec influencecore-postgres pg_isready -U influencecore`

### Le déploiement GitHub Actions échoue

1. Vérifier les secrets GitHub (Settings > Secrets > Actions)
2. Vérifier que la clé SSH est correcte
3. Vérifier les logs dans GitHub Actions

---

## 📚 Commandes Utiles

```bash
# PM2
pm2 status                    # Statut
pm2 logs influencecore       # Logs
pm2 restart influencecore    # Redémarrer
pm2 stop influencecore       # Arrêter
pm2 delete influencecore     # Supprimer
pm2 monit                    # Monitorer

# Docker
docker ps                     # Containers en cours
docker logs influencecore-postgres  # Logs PostgreSQL
docker-compose -f docker-compose.db.yml restart  # Redémarrer

# Git
git pull origin main          # Mettre à jour le code
git status                    # État du repository

# Base de données
npm run db:generate          # Générer Prisma Client
npm run db:push              # Créer/mettre à jour la DB
npm run db:studio            # Ouvrir Prisma Studio
```

---

## ✅ Checklist de Déploiement

- [ ] Serveur VPS configuré
- [ ] Repository cloné dans `/var/www/influencecore`
- [ ] Script `auto-deploy-server.sh` exécuté
- [ ] Fichier `.env` créé avec les bonnes valeurs
- [ ] PostgreSQL en cours d'exécution
- [ ] Application buildée et démarrée avec PM2
- [ ] GitHub Actions configuré avec les secrets
- [ ] Test de déploiement automatique réussi

---

**🎉 Votre application est maintenant prête pour le déploiement automatique !**

