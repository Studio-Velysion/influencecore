# 🔧 Résoudre les Problèmes Courants

Guide rapide pour résoudre les problèmes les plus fréquents.

---

## 🚨 Problème 1 : Conflit Git lors du pull

### Erreur
```
error: Your local changes to the following files would be overwritten by merge
```

### Solution Rapide

```bash
cd /var/www/influencecore

# Option 1 : Sauvegarder les modifications (recommandé)
git stash
git pull origin main

# Option 2 : Écraser les modifications locales
git reset --hard HEAD
git pull origin main
```

### Solution Automatique

```bash
cd /var/www/influencecore
git pull origin main
chmod +x scripts/fix-git-and-update.sh
./scripts/fix-git-and-update.sh
```

---

## 🚨 Problème 2 : Scripts introuvables

### Erreur
```
-bash: ./scripts/update-url-port.sh: No such file or directory
```

### Solution

```bash
cd /var/www/influencecore

# Résoudre le conflit Git d'abord
git stash
git pull origin main

# Rendre les scripts exécutables
chmod +x scripts/*.sh
```

---

## 🚨 Problème 3 : Application non accessible depuis l'extérieur

### Symptômes
- L'application fonctionne en local (`localhost:3000`)
- Timeout ou erreur de connexion depuis l'extérieur
- PM2 montre que l'application tourne

### Causes possibles
1. Next.js écoute sur `127.0.0.1` au lieu de `0.0.0.0`
2. Le firewall bloque le port
3. Le port n'est pas ouvert dans le provider (OVH, AWS, etc.)

### Solution Automatique (Tout-en-un)

```bash
cd /var/www/influencecore
git pull origin main
chmod +x scripts/fix-all.sh
./scripts/fix-all.sh
```

Ce script va :
- ✅ Résoudre les conflits Git
- ✅ Mettre à jour le code
- ✅ Configurer Next.js pour écouter sur `0.0.0.0`
- ✅ Vérifier et ouvrir le port dans le firewall
- ✅ Redémarrer l'application

### Solution Manuelle

#### 1. Configurer Next.js pour écouter sur 0.0.0.0

Le `package.json` a déjà été mis à jour, mais si besoin :

```bash
cd /var/www/influencecore
sed -i 's/"start": "next start"/"start": "next start -H 0.0.0.0"/' package.json
```

#### 2. Ouvrir le port dans le firewall

```bash
# Pour UFW (Ubuntu/Debian)
sudo ufw allow 3000/tcp
sudo ufw reload

# Vérifier
sudo ufw status
```

#### 3. Redémarrer l'application

```bash
pm2 restart influencecore --update-env
```

---

## 🚨 Problème 4 : PM2 ne trouve pas l'application

### Erreur
```
[PM2][ERROR] Process or Namespace influencecore not found
```

### Solution

```bash
cd /var/www/influencecore

# Démarrer l'application
./scripts/start-app.sh

# Ou manuellement
pm2 start npm --name influencecore -- start
pm2 save
```

---

## 🔍 Vérifier l'Accessibilité

### Script de Vérification

```bash
cd /var/www/influencecore
chmod +x scripts/check-accessibility.sh
./scripts/check-accessibility.sh
```

Ce script vérifie :
- ✅ Configuration (URL, Port)
- ✅ Statut PM2
- ✅ Port en écoute
- ✅ Configuration du firewall
- ✅ Connexion locale
- ✅ IP publique

---

## 📋 Checklist de Dépannage

### 1. Vérifier Git
```bash
cd /var/www/influencecore
git status
git pull origin main
```

### 2. Vérifier les scripts
```bash
ls -la scripts/*.sh
chmod +x scripts/*.sh
```

### 3. Vérifier la configuration
```bash
cat .env | grep -E "NEXTAUTH_URL|PORT|HOSTNAME"
```

### 4. Vérifier PM2
```bash
pm2 status
pm2 logs influencecore --lines 50
```

### 5. Vérifier le port
```bash
# Voir si le port écoute
netstat -tlnp | grep 3000
# Ou
ss -tlnp | grep 3000
```

### 6. Vérifier le firewall
```bash
sudo ufw status
# Si le port n'est pas ouvert
sudo ufw allow 3000/tcp
```

### 7. Tester localement
```bash
curl http://localhost:3000
```

---

## 🚀 Solution Rapide (Tout Corriger)

Si vous avez plusieurs problèmes, utilisez le script tout-en-un :

```bash
cd /var/www/influencecore

# Résoudre le conflit Git
git stash
git pull origin main

# Exécuter le script de correction
chmod +x scripts/fix-all.sh
./scripts/fix-all.sh
```

---

## 📝 Commandes Utiles

```bash
# Voir les logs
pm2 logs influencecore

# Redémarrer
pm2 restart influencecore --update-env

# Voir le statut
pm2 status

# Vérifier l'accessibilité
./scripts/check-accessibility.sh

# Modifier URL et port
./scripts/update-url-port.sh "http://123.45.67.89" 3000
```

---

## 🆘 Si Rien ne Fonctionne

1. **Vérifier les logs** :
   ```bash
   pm2 logs influencecore --err
   ```

2. **Vérifier que l'application build correctement** :
   ```bash
   cd /var/www/influencecore
   npm run build
   ```

3. **Vérifier la base de données** :
   ```bash
   docker ps | grep postgres
   ```

4. **Redémarrer complètement** :
   ```bash
   pm2 delete influencecore
   cd /var/www/influencecore
   ./scripts/start-app.sh
   ```

---

**💡 Astuce** : Le script `fix-all.sh` résout automatiquement la plupart des problèmes courants !

