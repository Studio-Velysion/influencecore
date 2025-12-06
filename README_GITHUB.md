# 📦 Initialiser le projet sur GitHub

## 🚀 Étapes pour mettre le projet sur GitHub

### 1. Créer un repository sur GitHub

1. Allez sur https://github.com/new
2. Nommez votre repository (ex: `influencecore`)
3. Choisissez **Private** (recommandé pour un projet privé)
4. Ne cochez **PAS** "Initialize with README"
5. Cliquez sur **Create repository**

### 2. Initialiser Git dans votre projet

```bash
# Dans le répertoire du projet
cd "H:\Studio Velysion CreatorHub\InfluenceCore"

# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - InfluenceCore V1"

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE-USERNAME/influencecore.git

# Pousser sur GitHub
git branch -M main
git push -u origin main
```

### 3. Configuration future

Après chaque modification :

```bash
# Voir les changements
git status

# Ajouter les fichiers modifiés
git add .

# Commiter avec un message descriptif
git commit -m "Description de vos modifications"

# Pousser sur GitHub
git push origin main
```

### 4. Déploiement automatique

Une fois sur GitHub, suivez le guide `DEPLOYMENT_AUTOMATION.md` pour configurer le déploiement automatique sur votre serveur VPS.

---

## 🔐 Fichiers à ne PAS commiter

Le fichier `.gitignore` est déjà configuré pour exclure :
- `.env` (variables d'environnement sensibles)
- `node_modules/`
- `.next/`
- Fichiers de build

**⚠️ Important** : Ne commitez JAMAIS votre fichier `.env` contenant vos clés secrètes !

---

## 📝 Bonnes pratiques

1. **Commits réguliers** : Commitez souvent avec des messages clairs
2. **Branches** : Créez des branches pour tester des fonctionnalités
3. **Messages de commit** : Utilisez des messages descriptifs
   - ✅ `git commit -m "Ajout du système de paiement Stripe"`
   - ❌ `git commit -m "fix"`

---

**C'est prêt !** Votre code est maintenant sur GitHub et peut être déployé automatiquement. 🎉

