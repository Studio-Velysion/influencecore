# 🔧 Push GitHub - Instructions Manuelles

## ⚠️ Problème d'authentification

Le token GitHub semble ne pas avoir les permissions nécessaires ou le repository n'existe pas encore.

---

## ✅ Solutions

### Option 1 : Vérifier le token

1. Allez sur GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Vérifiez que votre token a le scope **`repo`** (accès complet aux repositories)
3. Si non, créez un nouveau token avec le scope `repo`

### Option 2 : Utiliser GitHub CLI (Plus simple)

```powershell
# Installer GitHub CLI
winget install GitHub.cli

# Se connecter
gh auth login

# Pousser
git push -u origin main
```

### Option 3 : Vérifier que le repository existe

1. Allez sur **https://github.com/Studio-Velysion/influencecore**
2. Si le repository n'existe pas, créez-le :
   - Allez sur **https://github.com/new**
   - Nom : `influencecore`
   - Propriétaire : `Studio-Velysion`
   - **Ne cochez PAS** "Initialize with README"
   - Créez le repository

### Option 4 : Push manuel avec authentification

```powershell
# Configurer le remote (sans token dans l'URL)
git remote set-url origin https://github.com/Studio-Velysion/influencecore.git

# Pousser (Git vous demandera vos identifiants)
git push -u origin main
```

Quand Git vous demande :
- **Username** : Votre nom d'utilisateur GitHub
- **Password** : Utilisez votre **token** (pas votre mot de passe)

---

## 🔍 Vérification

Vérifiez que le repository existe :
- **https://github.com/Studio-Velysion/influencecore**

Si vous voyez une page 404, le repository n'existe pas encore.

---

## ✅ Une fois le repository créé

Exécutez simplement :

```powershell
git push -u origin main
```

Git vous demandera vos identifiants. Utilisez votre token comme mot de passe.

