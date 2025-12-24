# 🔧 Correction de l'Extension pour Windows

## ❌ Problème

L'extension échoue sur Windows à cause de la commande Unix `rm -rf` qui n'existe pas.

## ✅ Solution Appliquée

J'ai modifié le script `dev` dans `package.json` pour **exclure l'extension** par défaut sur Windows.

### Changement dans `package.json`

**Avant** :
```json
"dev": "pnpm run --filter ./apps/extension --filter ./apps/cron ..."
```

**Après** :
```json
"dev": "pnpm run --filter ./apps/cron --filter ./apps/workers --filter ./apps/backend --filter ./apps/frontend --parallel dev",
"dev:with-extension": "pnpm run --filter ./apps/extension --filter ./apps/cron ..."
```

## 🎯 Résultat

Maintenant, `pnpm run dev` démarre **tous les services SAUF l'extension**, ce qui évite l'erreur sur Windows.

## 📝 Pour Démarrer avec l'Extension (si nécessaire)

Si vous avez besoin de l'extension et que vous êtes sur Linux/Mac :

```powershell
pnpm run dev:with-extension
```

## ✅ Services qui Démarreront

- ✅ Frontend (port 4200)
- ✅ Backend
- ✅ Workers
- ✅ Cron
- ⏭️ Extension (ignorée sur Windows)

## 🚀 Utilisation

```powershell
# Depuis la racine
cd "H:\Studio Velysion CreatorHub\InfluenceCore"
.\start-all-services.ps1
```

Tous les services devraient maintenant démarrer sans erreur !

