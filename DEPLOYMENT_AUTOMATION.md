# 🚀 Déploiement Automatique - InfluenceCore

Guide complet pour configurer le déploiement automatique depuis GitHub vers votre serveur VPS.

---

## 📋 Table des matières

1. [Avantages de GitHub](#avantages-de-github)
2. [Méthode 1 : GitHub Actions (Recommandé)](#méthode-1--github-actions-recommandé)
3. [Méthode 2 : Git Hooks (Alternative)](#méthode-2--git-hooks-alternative)
4. [Configuration PM2](#configuration-pm2)
5. [Configuration des secrets GitHub](#configuration-des-secrets-github)

---

## ✅ Avantages de GitHub

### Pourquoi utiliser GitHub ?

1. **Versioning** : Historique complet de toutes les modifications
2. **Backup** : Code sauvegardé automatiquement dans le cloud
3. **Collaboration** : Facile de travailler en équipe
4. **Déploiement automatique** : Mise à jour automatique du serveur
5. **Rollback facile** : Retour en arrière en un clic
6. **Branches** : Tester des fonctionnalités sans affecter la production

---

## 🎯 Méthode 1 : GitHub Actions (Recommandé)

### Avantages
- ✅ Déploiement automatique à chaque push
- ✅ Build et tests avant déploiement
- ✅ Logs détaillés dans GitHub
- ✅ Déclenchement manuel possible
- ✅ Pas besoin de configurer Git sur le serveur

### Configuration

#### 1. Créer le repository GitHub

```bash
# Sur votre machine locale
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/influencecore.git
git push -u origin main
```

#### 2. Configurer les secrets GitHub

1. Allez sur votre repository GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Ajoutez les secrets suivants :

```
VPS_HOST          # IP ou domaine de votre serveur (ex: 123.45.67.89)
VPS_USER          # Utilisateur SSH (ex: root ou ubuntu)
VPS_SSH_KEY       # Clé privée SSH pour se connecter au serveur
VPS_PORT          # Port SSH (généralement 22)
VPS_APP_PATH      # Chemin de l'application (ex: /var/www/influencecore)
DATABASE_URL      # URL de votre base de données PostgreSQL
NEXTAUTH_SECRET   # Secret NextAuth
NEXTAUTH_URL      # URL de votre application (ex: https://votre-domaine.com)
STRIPE_SECRET_KEY # Clé secrète Stripe
STRIPE_WEBHOOK_SECRET # Secret webhook Stripe
```

#### 3. Générer une clé SSH pour GitHub Actions

Sur votre **serveur VPS** :

```bash
# Créer un utilisateur dédié (recommandé)
sudo adduser deploy
sudo usermod -aG sudo deploy

# Se connecter en tant que deploy
su - deploy

# Créer le répertoire .ssh
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Générer une paire de clés
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""

# Ajouter la clé publique à authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Afficher la clé privée (à copier dans GitHub Secrets)
cat ~/.ssh/github_actions
```

**Copiez la clé privée** et collez-la dans `VPS_SSH_KEY` dans GitHub Secrets.

#### 4. Préparer le serveur

Sur votre **serveur VPS** :

```bash
# Installer Node.js et npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2

# Créer le répertoire de l'application
sudo mkdir -p /var/www/influencecore
sudo chown -R deploy:deploy /var/www/influencecore

# Cloner le repository (une seule fois)
cd /var/www/influencecore
git clone https://github.com/votre-username/influencecore.git .

# Installer les dépendances
npm ci --production

# Créer le fichier .env
nano .env
# (Copiez vos variables d'environnement)

# Générer Prisma
npm run db:generate

# Build
npm run build

# Démarrer avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Pour démarrer au boot
```

#### 5. Tester le déploiement

1. Faites une modification dans votre code
2. Commitez et poussez sur GitHub :
   ```bash
   git add .
   git commit -m "Test déploiement automatique"
   git push origin main
   ```
3. Allez sur GitHub → **Actions** pour voir le déploiement en cours
4. Vérifiez que votre site est mis à jour !

---

## 🔧 Méthode 2 : Git Hooks (Alternative)

### Avantages
- ✅ Déploiement instantané
- ✅ Pas besoin de GitHub Actions
- ✅ Plus simple à configurer

### Configuration

#### 1. Créer un repository Git bare sur le serveur

```bash
# Sur le serveur VPS
sudo mkdir -p /var/www/influencecore.git
sudo chown -R deploy:deploy /var/www/influencecore.git
cd /var/www/influencecore.git
git init --bare
```

#### 2. Configurer le hook post-receive

```bash
# Copier le script
sudo cp scripts/post-receive.sh /var/www/influencecore.git/hooks/post-receive
sudo chmod +x /var/www/influencecore.git/hooks/post-receive
sudo chown deploy:deploy /var/www/influencecore.git/hooks/post-receive
```

#### 3. Configurer le repository local

```bash
# Sur votre machine locale
git remote add production deploy@votre-serveur:/var/www/influencecore.git
```

#### 4. Déployer

```bash
# À chaque push, l'application se met à jour automatiquement
git push production main
```

---

## ⚙️ Configuration PM2

PM2 gère l'application en production (redémarrage automatique, logs, etc.).

### Installation

```bash
sudo npm install -g pm2
```

### Commandes utiles

```bash
# Démarrer l'application
pm2 start ecosystem.config.js

# Voir les logs
pm2 logs influencecore

# Redémarrer
pm2 restart influencecore

# Arrêter
pm2 stop influencecore

# Statut
pm2 status

# Sauvegarder la configuration
pm2 save

# Démarrer au boot
pm2 startup
```

---

## 🔐 Configuration des secrets GitHub

### Comment obtenir chaque secret

1. **VPS_HOST** : IP ou domaine de votre serveur
2. **VPS_USER** : Utilisateur SSH (généralement `root` ou `ubuntu`)
3. **VPS_SSH_KEY** : Clé privée SSH (voir section 3 ci-dessus)
4. **VPS_PORT** : Port SSH (généralement `22`)
5. **VPS_APP_PATH** : `/var/www/influencecore`
6. **DATABASE_URL** : `postgresql://user:password@host:5432/database`
7. **NEXTAUTH_SECRET** : Générez avec `openssl rand -base64 32`
8. **NEXTAUTH_URL** : `https://votre-domaine.com`
9. **STRIPE_SECRET_KEY** : Depuis Stripe Dashboard
10. **STRIPE_WEBHOOK_SECRET** : Depuis Stripe Dashboard → Webhooks

---

## 📝 Checklist de déploiement

- [ ] Repository GitHub créé
- [ ] Code poussé sur GitHub
- [ ] Secrets GitHub configurés
- [ ] Clé SSH générée et ajoutée
- [ ] Serveur préparé (Node.js, PM2, etc.)
- [ ] Application clonée sur le serveur
- [ ] Fichier `.env` créé avec toutes les variables
- [ ] Base de données configurée
- [ ] PM2 configuré et application démarrée
- [ ] Next.js configuré pour écouter sur `0.0.0.0` (accès externe)
- [ ] Port ouvert dans le firewall (serveur et provider)
- [ ] Scripts de gestion rendus exécutables
- [ ] Test de déploiement réussi
- [ ] Application accessible depuis l'extérieur

---

## 🐛 Dépannage

### Erreur de connexion SSH
- Vérifiez que la clé SSH est correcte
- Vérifiez que l'utilisateur a les permissions
- Testez la connexion manuellement : `ssh deploy@votre-serveur`

### Erreur lors du build
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez les logs GitHub Actions

### Application ne redémarre pas
- Vérifiez que PM2 est installé
- Vérifiez les logs : `pm2 logs influencecore`

---

## 🛠️ Scripts de Gestion et Dépannage

Plusieurs scripts ont été créés pour faciliter la gestion et le dépannage de l'application sur le serveur.

### Scripts Disponibles

#### 1. `fix-all.sh` - Correction Automatique (Recommandé)

Script tout-en-un qui résout automatiquement les problèmes courants :

```bash
cd /var/www/influencecore
chmod +x scripts/fix-all.sh
./scripts/fix-all.sh
```

**Fonctionnalités :**
- ✅ Résout les conflits Git automatiquement
- ✅ Met à jour le code depuis GitHub
- ✅ Configure Next.js pour écouter sur `0.0.0.0` (accès externe)
- ✅ Vérifie et ouvre le port dans le firewall
- ✅ Redémarre l'application avec PM2

#### 2. `update-url-port.sh` - Modifier l'URL et le Port

Permet de modifier facilement l'URL et le port de l'application :

```bash
cd /var/www/influencecore
chmod +x scripts/update-url-port.sh

# Mode interactif
./scripts/update-url-port.sh

# Avec paramètres
./scripts/update-url-port.sh "http://123.45.67.89" 3000
```

**Fonctionnalités :**
- ✅ Affiche l'URL et le port actuels
- ✅ Met à jour `.env` (NEXTAUTH_URL et PORT)
- ✅ Met à jour `ecosystem.config.js` si présent
- ✅ Crée une sauvegarde automatique
- ✅ Démarrer/redémarre l'application avec PM2

#### 3. `start-app.sh` - Démarrer l'Application

Démarre l'application avec PM2 :

```bash
cd /var/www/influencecore
chmod +x scripts/start-app.sh
./scripts/start-app.sh
```

**Fonctionnalités :**
- ✅ Vérifie que le fichier `.env` existe
- ✅ Vérifie si PM2 est installé
- ✅ Démarre l'application si elle n'est pas en cours
- ✅ Redémarre l'application si elle tourne déjà (optionnel)
- ✅ Affiche le statut et les commandes utiles

#### 4. `check-accessibility.sh` - Vérifier l'Accessibilité

Vérifie complètement l'accessibilité de l'application :

```bash
cd /var/www/influencecore
chmod +x scripts/check-accessibility.sh
./scripts/check-accessibility.sh
```

**Vérifications :**
- ✅ Configuration (URL, Port)
- ✅ Statut PM2
- ✅ Port en écoute
- ✅ Configuration du firewall
- ✅ Connexion locale
- ✅ IP publique

#### 5. `fix-git-and-update.sh` - Résoudre les Conflits Git

Résout les conflits Git et met à jour le code :

```bash
cd /var/www/influencecore
chmod +x scripts/fix-git-and-update.sh
./scripts/fix-git-and-update.sh
```

**Fonctionnalités :**
- ✅ Détecte les modifications locales
- ✅ Propose de sauvegarder ou écraser
- ✅ Met à jour depuis GitHub
- ✅ Rend les scripts exécutables

### Problèmes Courants et Solutions

#### Conflit Git lors du pull

```bash
# Solution rapide
git stash
git pull origin main

# Ou utiliser le script
./scripts/fix-git-and-update.sh
```

#### Application non accessible depuis l'extérieur

**Cause :** Next.js écoute sur `127.0.0.1` au lieu de `0.0.0.0`

**Solution :** Le `package.json` a été configuré pour écouter sur `0.0.0.0` :
```json
"start": "next start -H 0.0.0.0"
```

Si le problème persiste :
```bash
./scripts/fix-all.sh
```

#### PM2 ne trouve pas l'application

```bash
# Démarrer l'application
./scripts/start-app.sh

# Ou manuellement
pm2 start npm --name influencecore -- start
pm2 save
```

#### Port bloqué par le firewall

```bash
# Pour UFW (Ubuntu/Debian)
sudo ufw allow 3000/tcp
sudo ufw reload

# Vérifier
sudo ufw status
```

### Configuration Next.js pour Accès Externe

L'application est maintenant configurée pour être accessible depuis l'extérieur :

- **`package.json`** : Script `start` modifié pour écouter sur `0.0.0.0`
- **`.env`** : Variable `HOSTNAME=0.0.0.0` ajoutée automatiquement par les scripts

### Documentation Complémentaire

- **`RESOUDRE_PROBLEMES.md`** : Guide complet de résolution des problèmes
- **`MODIFIER_URL.md`** : Guide pour modifier l'URL et le port
- **`DEMARRER_APPLICATION.md`** : Guide pour démarrer l'application
- **`ACCES_APPLICATION.md`** : Guide d'accès à l'application

---

## 📚 Commandes Utiles

### Gestion Git
```bash
# Voir l'état
git status

# Résoudre les conflits
git stash
git pull origin main

# Mettre à jour avec le script
./scripts/fix-git-and-update.sh
```

### Gestion PM2
```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs influencecore

# Redémarrer avec variables d'environnement
pm2 restart influencecore --update-env

# Démarrer l'application
./scripts/start-app.sh
```

### Configuration
```bash
# Modifier URL et port
./scripts/update-url-port.sh "http://123.45.67.89" 3000

# Vérifier l'accessibilité
./scripts/check-accessibility.sh

# Tout corriger automatiquement
./scripts/fix-all.sh
```

### Vérification
```bash
# Vérifier le port
netstat -tlnp | grep 3000
# Ou
ss -tlnp | grep 3000

# Tester localement
curl http://localhost:3000

# Vérifier le firewall
sudo ufw status
```

---

## 🎉 Résultat

Une fois configuré, chaque fois que vous faites :

```bash
git add .
git commit -m "Ma nouvelle fonctionnalité"
git push origin main
```

Votre serveur se met à jour **automatiquement** ! 🚀

---

**Besoin d'aide ?** Consultez les logs GitHub Actions ou les logs PM2 sur votre serveur.

