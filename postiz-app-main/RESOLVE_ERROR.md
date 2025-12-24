# 🔧 Résolution de l'Erreur "Cannot find module"

## ❌ Problème

Vous essayez d'exécuter `npm run dev` depuis le répertoire `InfluenceCore` au lieu de `postiz-app-main`.

**Erreur** :
```
Error: Cannot find module 'H:\Studio Velysion CreatorHub\InfluenceCore\node_modules\next\dist\bin\next'
```

## ✅ Solution Simple

### Étape 1 : Aller dans le bon répertoire

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
```

### Étape 2 : Installer Chakra UI (si pas déjà fait)

**Avec pnpm** :
```powershell
pnpm add @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
```

**Ou avec npm** :
```powershell
npm install @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
```

### Étape 3 : Démarrer l'application

**Avec pnpm** :
```powershell
pnpm run dev
```

**Ou avec npm** :
```powershell
npm run dev
```

## 📋 Commandes Complètes (Copier-Coller)

### Option 1 : Avec pnpm (Recommandé)

```powershell
# Aller dans le répertoire du projet
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"

# Installer Chakra UI
pnpm add @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0

# Démarrer l'application
pnpm run dev
```

### Option 2 : Avec npm

```powershell
# Aller dans le répertoire du projet
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"

# Installer Chakra UI
npm install @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0

# Démarrer l'application
npm run dev
```

## 🎯 Script Automatique

Vous pouvez aussi utiliser le script PowerShell fourni :

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
.\setup-and-run.ps1
```

## ⚠️ Important

**Toujours exécuter les commandes depuis `postiz-app-main`**, pas depuis `InfluenceCore` !

## ✅ Vérification

Pour vérifier que vous êtes dans le bon répertoire :

```powershell
# Doit afficher : H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main
pwd

# Doit afficher : gitroom
Get-Content package.json | Select-String '"name"'
```

## 🎉 Après le Démarrage

Une fois l'application démarrée, vous pouvez accéder à :
- `http://localhost:4200` (frontend)
- Les composants Chakra UI seront fonctionnels sur toutes les pages migrées !

