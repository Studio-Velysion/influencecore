# 🚀 Déployer sur GitHub - Instructions Finales

## ✅ Ce qui a été fait

J'ai préparé votre projet pour GitHub :
- ✅ Repository Git initialisé
- ✅ Tous les fichiers ajoutés
- ✅ Commit initial créé
- ✅ Scripts de déploiement automatique prêts
- ✅ Configuration GitHub Actions prête

---

## 📋 Il vous reste 2 étapes simples

### Étape 1 : Créer le repository sur GitHub

1. Allez sur **https://github.com/new**
2. Nommez votre repository : `influencecore` (ou un autre nom)
3. Choisissez **Private** (recommandé pour un projet privé)
4. **⚠️ IMPORTANT** : Ne cochez **PAS** "Initialize with README"
5. Cliquez sur **Create repository**

### Étape 2 : Pousser le code

Après création, GitHub vous montre des instructions. Utilisez ces commandes :

```powershell
# Ajouter le remote GitHub (remplacez par votre URL)
git remote add origin https://github.com/VOTRE-USERNAME/influencecore.git

# Renommer la branche en 'main'
git branch -M main

# Pousser sur GitHub
git push -u origin main
```

**Ou utilisez le script automatique :**

```powershell
.\scripts\setup-github.ps1
```

Le script vous demandera l'URL du repository et fera tout automatiquement !

---

## 🔐 Authentification GitHub

Quand Git vous demande vos identifiants :

### Option 1 : Token Personnel (Recommandé)

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. Donnez un nom (ex: "InfluenceCore")
4. Cochez `repo` (accès complet)
5. **Générer** et **copier le token**
6. Utilisez le **token** comme mot de passe (pas votre mot de passe GitHub)

### Option 2 : GitHub CLI (Plus simple)

```powershell
# Installer GitHub CLI
winget install GitHub.cli

# Se connecter
gh auth login

# Maintenant git push fonctionnera sans authentification
```

---

## ✅ Vérification

Après le push, allez sur votre repository GitHub. Vous devriez voir :
- ✅ Tous vos fichiers
- ✅ Le dossier `.github/workflows/` (déploiement automatique)
- ✅ Tous les scripts et la documentation

---

## 🎯 Prochaines étapes

Une fois sur GitHub :

1. **Configurer les secrets GitHub** pour le déploiement automatique
   - Voir `DEPLOYMENT_AUTOMATION.md` section "Configuration des secrets GitHub"

2. **Tester le déploiement**
   - Faites une petite modification
   - Commitez et poussez
   - Vérifiez que GitHub Actions fonctionne

---

## 📝 Commandes utiles

```powershell
# Voir l'état
git status

# Voir les remotes
git remote -v

# Pousser les futures modifications
git add .
git commit -m "Description des changements"
git push origin main
```

---

## 🆘 Besoin d'aide ?

Consultez `GITHUB_SETUP.md` pour un guide plus détaillé.

---

**C'est tout !** Votre projet est prêt à être poussé sur GitHub. 🎉

