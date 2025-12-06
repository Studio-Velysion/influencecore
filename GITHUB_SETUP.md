# 🚀 Déployer sur GitHub - Guide Rapide

## ⚠️ Important

Je ne peux pas créer le repository GitHub ou pousser le code à votre place car cela nécessite vos identifiants GitHub. Mais j'ai préparé tout ce qu'il faut pour que vous puissiez le faire facilement !

---

## 📋 Étapes simples

### 1. Créer le repository sur GitHub

1. Allez sur https://github.com/new
2. Nommez votre repository (ex: `influencecore`)
3. Choisissez **Private** (recommandé)
4. **Ne cochez PAS** "Initialize with README"
5. Cliquez sur **Create repository**

### 2. Copier l'URL du repository

Après création, GitHub vous montre l'URL. Elle ressemble à :
```
https://github.com/VOTRE-USERNAME/influencecore.git
```

### 3. Exécuter le script automatique

#### Sur Windows (PowerShell) :

```powershell
.\scripts\setup-github.ps1
```

Le script va :
- ✅ Initialiser Git (si pas déjà fait)
- ✅ Ajouter tous les fichiers
- ✅ Créer le commit initial
- ✅ Configurer le remote GitHub
- ✅ Vous demander l'URL du repository
- ✅ Pousser le code sur GitHub

#### Sur Linux/Mac :

```bash
chmod +x scripts/setup-github.sh
./scripts/setup-github.sh
```

### 4. Ou faire manuellement

Si vous préférez faire manuellement :

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le commit
git commit -m "Initial commit - InfluenceCore V1 avec Stripe"

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE-USERNAME/influencecore.git

# Pousser sur GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 Authentification GitHub

### Option 1 : Token Personnel (Recommandé)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Donnez-lui un nom (ex: "InfluenceCore")
4. Cochez `repo` (accès complet aux repositories)
5. Générer et **copier le token** (vous ne le reverrez plus !)
6. Quand Git vous demande le mot de passe, utilisez le token

### Option 2 : GitHub CLI

```bash
# Installer GitHub CLI
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: sudo apt install gh

# Se connecter
gh auth login

# Pousser devient plus simple
git push
```

### Option 3 : SSH (Avancé)

1. Générer une clé SSH : `ssh-keygen -t ed25519 -C "votre-email@example.com"`
2. Ajouter la clé publique à GitHub : Settings → SSH and GPG keys
3. Utiliser l'URL SSH : `git@github.com:USERNAME/influencecore.git`

---

## ✅ Vérification

Après le push, allez sur votre repository GitHub. Vous devriez voir :
- ✅ Tous vos fichiers
- ✅ Le README.md
- ✅ Les workflows GitHub Actions (`.github/workflows/`)
- ✅ Les scripts de déploiement

---

## 🎯 Prochaines étapes

Une fois sur GitHub :

1. **Configurer les secrets** pour le déploiement automatique
   - Voir `DEPLOYMENT_AUTOMATION.md`

2. **Tester le déploiement**
   - Faites une petite modification
   - Commitez et poussez
   - Vérifiez que GitHub Actions fonctionne

3. **Configurer le serveur VPS**
   - Suivez `DEPLOYMENT_AUTOMATION.md` pour configurer le déploiement automatique

---

## 🐛 Problèmes courants

### Erreur : "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/VOTRE-USERNAME/influencecore.git
```

### Erreur : "authentication failed"
- Utilisez un token personnel au lieu du mot de passe
- Ou configurez GitHub CLI

### Erreur : "dubious ownership"
```bash
git config --global --add safe.directory "H:/Studio Velysion CreatorHub/InfluenceCore"
```

---

## 📝 Commandes utiles

```bash
# Voir l'état
git status

# Voir les remotes
git remote -v

# Changer l'URL du remote
git remote set-url origin https://github.com/NOUVELLE-URL.git

# Pousser les modifications
git add .
git commit -m "Description des changements"
git push origin main
```

---

**C'est tout !** Votre projet sera sur GitHub en quelques minutes. 🎉

