# 🔧 Modifier l'URL sur le Serveur VPS

Guide rapide pour modifier l'URL directement sur le serveur.

---

## 🚀 Méthode Rapide (Tout-en-un)

Si le script n'existe pas encore sur le serveur, utilisez ce script qui met à jour le code puis modifie l'URL :

```bash
cd /var/www/influencecore

# Créer le script si nécessaire
cat > scripts/update-and-change-url.sh << 'EOF'
#!/bin/bash
set -e
APP_DIR="/var/www/influencecore"
cd "$APP_DIR"
git pull origin main
chmod +x scripts/update-url.sh
./scripts/update-url.sh "$@"
EOF

chmod +x scripts/update-and-change-url.sh
./scripts/update-and-change-url.sh
```

---

## 📥 Méthode 1 : Mettre à jour depuis GitHub

### Étape 1 : Récupérer les nouveaux scripts

```bash
cd /var/www/influencecore
git pull origin main
```

### Étape 2 : Rendre les scripts exécutables

```bash
chmod +x scripts/update-url.sh
chmod +x scripts/update-url-interactive.sh
```

### Étape 3 : Exécuter le script

```bash
./scripts/update-url.sh
```

---

## 🎯 Méthode 2 : Modification Manuelle Directe

Si vous voulez modifier l'URL immédiatement sans attendre le pull :

```bash
cd /var/www/influencecore

# Voir l'URL actuelle
grep NEXTAUTH_URL .env

# Modifier l'URL (remplacez par votre URL)
sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL="https://votre-domaine.com"|' .env

# Vérifier la modification
grep NEXTAUTH_URL .env

# Redémarrer l'application
pm2 restart influencecore
```

---

## 🔄 Script Complet en Une Ligne

Pour mettre à jour le code ET modifier l'URL en une seule commande :

```bash
cd /var/www/influencecore && git pull origin main && chmod +x scripts/update-url.sh && ./scripts/update-url.sh
```

---

## 📋 Exemples d'URLs

### Avec domaine HTTPS
```bash
sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL="https://votre-domaine.com"|' .env
pm2 restart influencecore
```

### Avec IP
```bash
sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL="http://123.45.67.89:3000"|' .env
pm2 restart influencecore
```

### Localhost (développement)
```bash
sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL="http://localhost:3000"|' .env
pm2 restart influencecore
```

---

## ✅ Vérification

```bash
# Vérifier l'URL
grep NEXTAUTH_URL /var/www/influencecore/.env

# Vérifier que l'application fonctionne
pm2 status
pm2 logs influencecore --lines 20
```

---

## 🐛 Si git pull échoue

### Vérifier la connexion GitHub

```bash
cd /var/www/influencecore
git remote -v
```

### Forcer la mise à jour

```bash
git fetch origin
git reset --hard origin/main
```

---

**💡 Astuce** : Après le premier `git pull`, les scripts seront disponibles et vous pourrez utiliser `./scripts/update-url.sh` normalement.

