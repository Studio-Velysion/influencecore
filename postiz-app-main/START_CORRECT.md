# 🚀 Guide de Démarrage Correct

## ⚠️ IMPORTANT : Toujours aller dans `postiz-app-main` !

Les scripts sont dans `postiz-app-main`, **PAS** dans `ic-billing-core`.

## ✅ Commandes Correctes

### Étape 1 : Aller dans le bon répertoire

```powershell
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"
```

### Étape 2 : Démarrer le frontend uniquement

**Avec pnpm** (recommandé) :
```powershell
pnpm run dev:frontend
```

**Ou avec npm** :
```powershell
npm run dev:frontend
```

## 📋 Commandes Complètes (Copier-Coller)

### Option 1 : Frontend Seul (Pour tester Chakra UI)

```powershell
# Aller dans le répertoire
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"

# Démarrer le frontend
pnpm run dev:frontend
```

### Option 2 : Tous les Services (Peut échouer à cause de l'extension)

```powershell
# Aller dans le répertoire
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"

# Démarrer tous les services
pnpm run dev
```

## 🎯 Vérification

Pour vérifier que vous êtes dans le bon répertoire :

```powershell
# Doit afficher : H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main
pwd

# Doit afficher les scripts disponibles
pnpm run
# ou
npm run
```

## ⚠️ Erreurs Communes

### ❌ MAUVAIS : Depuis ic-billing-core
```powershell
PS H:\Studio Velysion CreatorHub\ic-billing-core> npm run dev:frontend
# ❌ Erreur : Missing script
```

### ✅ BON : Depuis postiz-app-main
```powershell
PS H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main> pnpm run dev:frontend
# ✅ Fonctionne !
```

## 🎉 Après le Démarrage

Une fois le frontend démarré, accédez à :
- `http://localhost:4200` - Application principale
- `http://localhost:4200/workspaces` - Test Chakra UI Workspaces
- `http://localhost:4200/templates` - Test Chakra UI Templates
- `http://localhost:4200/queues` - Test Chakra UI Queues
- `http://localhost:4200/hashtag-groups` - Test Chakra UI Hashtag Groups
- `http://localhost:4200/dynamic-variables` - Test Chakra UI Dynamic Variables

