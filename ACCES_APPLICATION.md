# 🌐 Accéder à l'Application InfluenceCore

Guide complet pour accéder à votre application après le déploiement.

---

## 🔍 Vérification de l'État

### 1. Vérifier que l'application est en cours d'exécution

```bash
# Vérifier PM2
pm2 status

# Vous devriez voir "influencecore" avec le statut "online"
```

### 2. Vérifier les logs

```bash
# Voir les logs de l'application
pm2 logs influencecore

# Voir les dernières lignes
pm2 logs influencecore --lines 50
```

### 3. Vérifier que PostgreSQL fonctionne

```bash
# Vérifier que PostgreSQL est en cours d'exécution
docker ps | grep postgres

# Ou
docker ps -a | grep influencecore-postgres
```

---

## 🌐 Accès Local (depuis le serveur)

### Option 1 : Accès direct sur le serveur

Si vous êtes connecté en SSH au serveur :

```bash
# Tester avec curl
curl http://localhost:3000

# Ou ouvrir dans un navigateur texte (si disponible)
lynx http://localhost:3000
```

### Option 2 : Tunnel SSH (depuis votre machine locale)

Depuis votre machine Windows, créez un tunnel SSH :

```powershell
# Créer un tunnel SSH (remplacez par vos informations)
ssh -L 3000:localhost:3000 root@VOTRE_IP_SERVEUR

# Puis ouvrez dans votre navigateur :
# http://localhost:3000
```

---

## 🌍 Accès Public (depuis Internet)

### Option 1 : Accès direct par IP

Si votre serveur a une IP publique :

1. **Vérifier que le port 3000 est ouvert** :

```bash
# Sur le serveur, vérifier que l'application écoute
netstat -tulpn | grep 3000
# Ou
ss -tulpn | grep 3000
```

2. **Ouvrir le port dans le firewall** :

```bash
# Ubuntu/Debian avec UFW
sudo ufw allow 3000/tcp
sudo ufw reload

# Ou avec iptables
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
```

3. **Accéder depuis votre navigateur** :

```
http://VOTRE_IP_SERVEUR:3000
```

### Option 2 : Configuration avec un domaine (Recommandé)

#### A. Configurer un domaine

1. **Pointer votre domaine vers l'IP du serveur** :
   - Créez un enregistrement A dans votre DNS
   - Pointez `votre-domaine.com` vers l'IP de votre serveur

2. **Mettre à jour NEXTAUTH_URL** :

```bash
# Éditer le fichier .env
nano /var/www/influencecore/.env

# Modifier NEXTAUTH_URL
NEXTAUTH_URL="https://votre-domaine.com"
```

3. **Redémarrer l'application** :

```bash
pm2 restart influencecore
```

#### B. Installer un reverse proxy (Nginx)

Pour utiliser HTTPS et un domaine propre :

```bash
# Installer Nginx
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/influencecore
```

Contenu du fichier :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activer la configuration :

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/influencecore /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx

# Obtenir un certificat SSL avec Let's Encrypt
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

4. **Mettre à jour NEXTAUTH_URL avec HTTPS** :

```bash
nano /var/www/influencecore/.env
# NEXTAUTH_URL="https://votre-domaine.com"

pm2 restart influencecore
```

---

## 🔐 Accès à l'Application

### Première connexion

1. **Ouvrir l'application** dans votre navigateur :
   - Local : `http://localhost:3000`
   - Public : `http://VOTRE_IP:3000` ou `https://votre-domaine.com`

2. **Créer un compte** :
   - Cliquez sur "S'inscrire" ou "Register"
   - Remplissez le formulaire
   - Connectez-vous

3. **Créer le compte Founder (Admin)** :

```bash
# Se connecter à PostgreSQL
docker exec -it influencecore-postgres psql -U influencecore -d influencecore

# Vérifier les utilisateurs
SELECT id, email, "isAdmin" FROM users;

# Mettre à jour un utilisateur en admin (remplacez l'email)
UPDATE users SET "isAdmin" = true WHERE email = 'votre-email@example.com';

# Quitter
\q
```

Ou utiliser le script d'initialisation :

```bash
cd /var/www/influencecore
npm run db:generate
npx ts-node scripts/init-admin.ts
```

---

## 🛠️ Commandes Utiles

### Vérifier l'état de l'application

```bash
# Statut PM2
pm2 status

# Logs en temps réel
pm2 logs influencecore

# Informations détaillées
pm2 describe influencecore

# Monitorer
pm2 monit
```

### Redémarrer l'application

```bash
# Redémarrer
pm2 restart influencecore

# Arrêter
pm2 stop influencecore

# Démarrer
pm2 start influencecore
```

### Vérifier les ports

```bash
# Voir les ports ouverts
sudo netstat -tulpn | grep LISTEN

# Vérifier le port 3000 spécifiquement
sudo lsof -i :3000
```

### Tester la connexion

```bash
# Depuis le serveur
curl http://localhost:3000

# Depuis l'extérieur (remplacez par votre IP)
curl http://VOTRE_IP:3000
```

---

## 🐛 Dépannage

### L'application ne répond pas

1. **Vérifier que PM2 est actif** :
```bash
pm2 status
# Si "offline" ou "errored", voir les logs
pm2 logs influencecore
```

2. **Vérifier les erreurs dans les logs** :
```bash
pm2 logs influencecore --err
```

3. **Vérifier que le port 3000 est libre** :
```bash
sudo lsof -i :3000
# Si un autre processus utilise le port, arrêtez-le ou changez le port
```

### Erreur de connexion à la base de données

1. **Vérifier que PostgreSQL est en cours d'exécution** :
```bash
docker ps | grep postgres
```

2. **Vérifier DATABASE_URL dans .env** :
```bash
cat /var/www/influencecore/.env | grep DATABASE_URL
```

3. **Tester la connexion** :
```bash
docker exec influencecore-postgres pg_isready -U influencecore
```

### Le site ne charge pas depuis l'extérieur

1. **Vérifier le firewall** :
```bash
sudo ufw status
# Si le port 3000 n'est pas ouvert :
sudo ufw allow 3000/tcp
```

2. **Vérifier les règles iptables** :
```bash
sudo iptables -L -n | grep 3000
```

3. **Vérifier que le serveur écoute sur toutes les interfaces** :
```bash
netstat -tulpn | grep 3000
# Doit afficher 0.0.0.0:3000, pas seulement 127.0.0.1:3000
```

---

## 📋 Checklist d'Accès

- [ ] Application démarrée avec PM2 (`pm2 status`)
- [ ] PostgreSQL en cours d'exécution (`docker ps`)
- [ ] Port 3000 ouvert dans le firewall
- [ ] Application accessible localement (`curl http://localhost:3000`)
- [ ] Application accessible depuis l'extérieur (si IP publique)
- [ ] Domaine configuré (si applicable)
- [ ] Nginx configuré (si applicable)
- [ ] SSL/HTTPS configuré (si applicable)
- [ ] NEXTAUTH_URL mis à jour dans `.env`
- [ ] Compte utilisateur créé

---

## 🎯 URLs d'Accès

Selon votre configuration :

- **Local (serveur)** : `http://localhost:3000`
- **IP publique** : `http://VOTRE_IP:3000`
- **Domaine HTTP** : `http://votre-domaine.com`
- **Domaine HTTPS** : `https://votre-domaine.com` (recommandé)

---

**🎉 Une fois l'application accessible, vous pouvez créer votre compte et commencer à utiliser InfluenceCore !**

