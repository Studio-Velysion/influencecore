# 🔧 Résolution des Problèmes de Démarrage

## ❌ Problèmes Détectés

1. **Extension échoue** : La commande `rm -rf` n'existe pas sur Windows
2. **node_modules manquant** : L'extension n'a pas ses dépendances installées
3. **Tous les services démarrent** : Cela peut causer des problèmes

## ✅ Solutions

### Option 1 : Démarrer uniquement le Frontend (Recommandé)

Pour tester Chakra UI, vous n'avez besoin que du frontend :

```powershell
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"
npm run dev:frontend
```

Ou avec pnpm :

```powershell
pnpm run dev:frontend
```

### Option 2 : Utiliser le Script PowerShell

Exécutez le script fourni :

```powershell
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"
.\START_FRONTEND_ONLY.ps1
```

### Option 3 : Installer les Dépendances Manquantes

Si vous voulez démarrer tous les services :

```powershell
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"

# Installer toutes les dépendances
pnpm install
# ou
npm install

# Installer les dépendances de l'extension spécifiquement
cd apps/extension
pnpm install
# ou
npm install
cd ../..
```

## 🎯 Pour Tester Chakra UI

Pour tester les composants Chakra UI, vous avez seulement besoin du frontend :

```powershell
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"
npm run dev:frontend
```

L'application démarrera sur `http://localhost:4200`

## 📝 Commandes Disponibles

- `npm run dev:frontend` - Démarrer uniquement le frontend
- `npm run dev:backend` - Démarrer uniquement le backend
- `npm run dev` - Démarrer tous les services (peut échouer à cause de l'extension)

## ⚠️ Note sur l'Extension

L'extension utilise des commandes Unix (`rm -rf`) qui ne fonctionnent pas sur Windows. Pour corriger cela, il faudrait modifier le script dans `apps/extension/package.json` pour utiliser des commandes Windows ou un outil cross-platform.

Pour l'instant, ignorez l'erreur de l'extension et utilisez `dev:frontend` pour tester Chakra UI.

