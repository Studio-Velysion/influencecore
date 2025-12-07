# 🌐 Configurer l'URL avec une IP

Guide rapide pour configurer l'URL de l'application avec une adresse IP.

---

## 🚀 Configuration Rapide

### Méthode 1 : Script Automatique (Recommandé)

```bash
cd /var/www/influencecore
git pull origin main
chmod +x scripts/update-url-port.sh
./scripts/update-url-port.sh "http://82.165.93.126" 3000
```

### Méthode 2 : Modification Manuelle

```bash
cd /var/www/influencecore

# Modifier l'URL
sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL="http://82.165.93.126:3000"|' .env

# Vérifier
grep NEXTAUTH_URL .env

# Redémarrer l'application
pm2 restart influencecore --update-env
```

---

## ✅ Vérifications

### 1. Vérifier la configuration

```bash
cd /var/www/influencecore
grep -E "NEXTAUTH_URL|PORT" .env
```

Vous devriez voir :
```
NEXTAUTH_URL="http://82.165.93.126:3000"
PORT=3000
```

### 2. Vérifier que l'application écoute sur 0.0.0.0

```bash
# Vérifier le package.json
grep "start" package.json

# Devrait afficher : "start": "next start -H 0.0.0.0"
```

### 3. Vérifier le firewall

```bash
# Activer UFW si nécessaire
sudo ufw allow 22/tcp
sudo ufw allow 3000/tcp
sudo ufw enable

# Vérifier le statut
sudo ufw status
```

### 4. Vérifier que l'application tourne

```bash
pm2 status
pm2 logs influencecore --lines 20
```

### 5. Tester l'accès

```bash
# Depuis le serveur
curl http://localhost:3000

# Depuis votre ordinateur
# Ouvrez : http://82.165.93.126:3000
```

---

## 🔧 Script Tout-en-un

Pour configurer tout automatiquement :

```bash
cd /var/www/influencecore
git pull origin main
chmod +x scripts/*.sh

# Configurer URL et port
./scripts/update-url-port.sh "http://82.165.93.126" 3000

# Activer le firewall
./scripts/activate-firewall.sh 3000

# Vérifier l'accessibilité
./scripts/check-accessibility.sh
```

---

## 🐛 Dépannage

### L'application n'est pas accessible

1. **Vérifier que Next.js écoute sur 0.0.0.0** :
   ```bash
   grep "start" package.json
   # Doit contenir : "next start -H 0.0.0.0"
   ```

2. **Vérifier le firewall du serveur** :
   ```bash
   sudo ufw status
   ```

3. **Vérifier le firewall du provider** :
   - OVH : Vérifiez dans le panneau d'administration
   - AWS : Vérifiez les Security Groups
   - Autres : Vérifiez les règles de pare-feu

4. **Vérifier que le port écoute** :
   ```bash
   netstat -tlnp | grep 3000
   # Ou
   ss -tlnp | grep 3000
   ```

5. **Vérifier les logs** :
   ```bash
   pm2 logs influencecore --err
   ```

---

## 📝 Checklist

- [ ] URL configurée dans `.env` : `NEXTAUTH_URL="http://82.165.93.126:3000"`
- [ ] Port configuré : `PORT=3000`
- [ ] Next.js configuré pour écouter sur `0.0.0.0`
- [ ] Firewall UFW activé et port 3000 autorisé
- [ ] Firewall du provider autorise le port 3000
- [ ] Application redémarrée avec PM2
- [ ] Application accessible depuis l'extérieur

---

**🎉 Une fois configuré, votre application sera accessible sur : http://82.165.93.126:3000**

