# 🚀 Démarrer l'Application sur le Serveur

Guide pour démarrer l'application InfluenceCore avec PM2 sur le serveur VPS.

---

## ⚡ Démarrage Rapide

```bash
cd /var/www/influencecore
chmod +x scripts/start-app.sh
./scripts/start-app.sh
```

---

## 📋 Méthodes de Démarrage

### Méthode 1 : Script Automatique (Recommandé)

```bash
cd /var/www/influencecore
chmod +x scripts/start-app.sh
./scripts/start-app.sh
```

Le script va :
- ✅ Vérifier que le fichier `.env` existe
- ✅ Vérifier si PM2 est installé
- ✅ Démarrer l'application si elle n'est pas en cours
- ✅ Redémarrer l'application si elle tourne déjà (optionnel)
- ✅ Afficher le statut et les commandes utiles

---

### Méthode 2 : Avec ecosystem.config.js

Si vous avez un fichier `ecosystem.config.js` :

```bash
cd /var/www/influencecore
pm2 start ecosystem.config.js
pm2 save
```

---

### Méthode 3 : Avec npm start

```bash
cd /var/www/influencecore

# Charger les variables d'environnement
export $(cat .env | grep -v '^#' | xargs)

# Démarrer avec PM2
pm2 start npm --name influencecore -- start
pm2 save
```

---

## 🔍 Vérifier le Statut

### Voir si l'application tourne

```bash
pm2 status
```

### Voir les logs

```bash
# Tous les logs
pm2 logs influencecore

# Dernières lignes
pm2 logs influencecore --lines 50

# Logs en temps réel
pm2 logs influencecore --lines 0
```

### Voir les informations détaillées

```bash
pm2 show influencecore
```

---

## 🔄 Redémarrer l'Application

### Redémarrer avec mise à jour des variables d'environnement

```bash
pm2 restart influencecore --update-env
```

### Redémarrer normalement

```bash
pm2 restart influencecore
```

---

## 🛑 Arrêter l'Application

```bash
pm2 stop influencecore
```

Pour arrêter et supprimer de PM2 :

```bash
pm2 delete influencecore
```

---

## 🐛 Dépannage

### Erreur : "Process or Namespace influencecore not found"

L'application n'est pas démarrée. Démarrez-la avec :

```bash
cd /var/www/influencecore
./scripts/start-app.sh
```

Ou manuellement :

```bash
cd /var/www/influencecore
pm2 start npm --name influencecore -- start
pm2 save
```

---

### Erreur : "PM2 is not installed"

Installez PM2 :

```bash
npm install -g pm2
```

---

### L'application ne démarre pas

1. **Vérifier les logs** :
   ```bash
   pm2 logs influencecore --err
   ```

2. **Vérifier le fichier .env** :
   ```bash
   cat /var/www/influencecore/.env
   ```

3. **Vérifier que les dépendances sont installées** :
   ```bash
   cd /var/www/influencecore
   npm install
   ```

4. **Vérifier que le build est à jour** :
   ```bash
   cd /var/www/influencecore
   npm run build
   ```

---

### L'application démarre mais n'est pas accessible

1. **Vérifier que le port est correct** :
   ```bash
   grep PORT /var/www/influencecore/.env
   ```

2. **Vérifier que le firewall autorise le port** :
   ```bash
   # Pour Ubuntu/Debian
   sudo ufw status
   sudo ufw allow 3000/tcp
   ```

3. **Vérifier que l'application écoute sur le bon port** :
   ```bash
   netstat -tlnp | grep 3000
   # Ou
   ss -tlnp | grep 3000
   ```

---

## 📊 Monitoring

### Dashboard PM2

```bash
pm2 monit
```

### Informations système

```bash
pm2 info influencecore
```

---

## 🔧 Configuration PM2 au Démarrage

Pour que PM2 démarre automatiquement au boot du serveur :

```bash
pm2 startup
pm2 save
```

Suivez les instructions affichées (généralement une commande `sudo` à exécuter).

---

## ✅ Checklist de Démarrage

- [ ] Fichier `.env` existe et est configuré
- [ ] Dépendances installées (`npm install`)
- [ ] Application buildée (`npm run build`)
- [ ] Base de données accessible (PostgreSQL)
- [ ] PM2 installé (`npm install -g pm2`)
- [ ] Application démarrée avec PM2
- [ ] Port ouvert dans le firewall
- [ ] Application accessible via l'URL configurée

---

## 📝 Commandes Utiles

```bash
# Démarrer
./scripts/start-app.sh

# Redémarrer
pm2 restart influencecore --update-env

# Arrêter
pm2 stop influencecore

# Voir les logs
pm2 logs influencecore

# Voir le statut
pm2 status

# Monitoring
pm2 monit

# Sauvegarder la configuration PM2
pm2 save
```

---

**🎉 Votre application est maintenant démarrée !**

