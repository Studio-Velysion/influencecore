# 🔧 Modifier l'URL et le Port dans le VPS

Guide pour modifier l'URL (NEXTAUTH_URL) et le port de l'application sur le serveur VPS.

---

## 🚀 Méthode 1 : Script Automatique URL + Port (Recommandé)

### Script Complet (URL + Port)

```bash
cd /var/www/influencecore
chmod +x scripts/update-url-port.sh
./scripts/update-url-port.sh
```

Le script va :
- ✅ Afficher l'URL et le port actuels
- ✅ Vous demander la nouvelle URL et le nouveau port
- ✅ Mettre à jour le fichier `.env` (NEXTAUTH_URL et PORT)
- ✅ Mettre à jour `ecosystem.config.js` si présent
- ✅ Créer une sauvegarde automatique
- ✅ Démarrer/redémarrer l'application avec PM2 si nécessaire

### Avec paramètres

```bash
# URL et port en paramètres
./scripts/update-url-port.sh "https://votre-domaine.com" 3000

# Seulement l'URL (le port sera demandé)
./scripts/update-url-port.sh "https://votre-domaine.com"
```

### Script Simple (URL seulement)

```bash
cd /var/www/influencecore
chmod +x scripts/update-url.sh
./scripts/update-url.sh
```

### Avec URL en paramètre

```bash
./scripts/update-url.sh "https://votre-domaine.com"
```

---

## 🎯 Méthode 2 : Script Interactif (Menu)

Pour une interface plus conviviale :

```bash
cd /var/www/influencecore
chmod +x scripts/update-url-interactive.sh
./scripts/update-url-interactive.sh
```

Le menu interactif permet de :
- ✅ Modifier l'URL
- ✅ Utiliser des URLs prédéfinies
- ✅ Voir toutes les variables d'environnement
- ✅ Redémarrer l'application
- ✅ Navigation facile

---

## 📝 Méthode 3 : Modification Manuelle

### Étape 1 : Éditer le fichier .env

```bash
cd /var/www/influencecore
nano .env
```

### Étape 2 : Modifier NEXTAUTH_URL et PORT

Trouvez les lignes :
```env
NEXTAUTH_URL="http://localhost:3000"
PORT=3000
```

Modifiez-les avec votre nouvelle URL et port :
```env
NEXTAUTH_URL="https://votre-domaine.com"
PORT=3000
```

**Note** : Si votre URL contient déjà le port (ex: `http://123.45.67.89:3000`), assurez-vous que le PORT dans `.env` correspond.

### Étape 3 : Sauvegarder

- Appuyez sur `Ctrl + X`
- Puis `Y` pour confirmer
- Puis `Entrée` pour sauvegarder

### Étape 4 : Redémarrer l'application

```bash
pm2 restart influencecore
```

---

## 🔍 Vérification

### Vérifier l'URL actuelle

```bash
cd /var/www/influencecore
grep NEXTAUTH_URL .env
```

### Vérifier que l'application fonctionne

```bash
# Voir les logs
pm2 logs influencecore

# Vérifier le statut
pm2 status
```

---

## 📋 Exemples d'URLs

### Développement Local
```env
NEXTAUTH_URL="http://localhost:3000"
```

### Production avec IP
```env
NEXTAUTH_URL="http://123.45.67.89:3000"
```

### Production avec Domaine (HTTP)
```env
NEXTAUTH_URL="http://votre-domaine.com"
```

### Production avec Domaine (HTTPS - Recommandé)
```env
NEXTAUTH_URL="https://votre-domaine.com"
```

---

## ⚠️ Important

### Après modification de l'URL

1. **Redémarrer l'application** :
   ```bash
   pm2 restart influencecore
   ```

2. **Vérifier les logs** pour s'assurer qu'il n'y a pas d'erreurs :
   ```bash
   pm2 logs influencecore --lines 50
   ```

3. **Tester l'accès** :
   ```bash
   curl http://localhost:3000
   # Ou depuis l'extérieur
   curl https://votre-domaine.com
   ```

### Si vous utilisez HTTPS

Assurez-vous que :
- ✅ Votre certificat SSL est configuré (Let's Encrypt, etc.)
- ✅ Nginx/Apache est configuré pour rediriger vers l'application
- ✅ Le port 443 est ouvert dans le firewall

---

## 🔄 Redémarrage Automatique

Les scripts proposent automatiquement de redémarrer l'application. Si vous choisissez "Non", redémarrez manuellement :

```bash
pm2 restart influencecore
```

---

## 🐛 Dépannage

### L'URL ne se met pas à jour

1. Vérifiez que le fichier `.env` a été modifié :
   ```bash
   cat /var/www/influencecore/.env | grep NEXTAUTH_URL
   ```

2. Vérifiez que l'application a été redémarrée :
   ```bash
   pm2 status
   ```

3. Vérifiez les logs pour les erreurs :
   ```bash
   pm2 logs influencecore --err
   ```

### Erreur "Invalid URL"

- Assurez-vous que l'URL commence par `http://` ou `https://`
- Vérifiez qu'il n'y a pas d'espaces dans l'URL
- Vérifiez que les guillemets sont corrects dans le fichier `.env`

---

## 📝 Commandes Utiles

```bash
# Voir l'URL actuelle
grep NEXTAUTH_URL /var/www/influencecore/.env

# Modifier avec le script
cd /var/www/influencecore
./scripts/update-url.sh "https://nouvelle-url.com"

# Redémarrer l'application
pm2 restart influencecore

# Voir les logs
pm2 logs influencecore

# Vérifier le statut
pm2 status
```

---

## ✅ Checklist

- [ ] URL modifiée dans le fichier `.env`
- [ ] Application redémarrée avec PM2
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Application accessible avec la nouvelle URL
- [ ] Certificat SSL configuré (si HTTPS)

---

**🎉 Votre URL est maintenant mise à jour !**

