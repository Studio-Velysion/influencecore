# 🔧 Résolution du Problème de Dépendances

## ❌ Problème Actuel

Vous essayez d'exécuter `npm run dev` depuis le mauvais répertoire ou les dépendances ne sont pas installées.

## ✅ Solution

### Option 1 : Script Automatique (Recommandé)

Exécutez le script PowerShell :

```powershell
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"
.\setup-and-run.ps1
```

### Option 2 : Installation Manuelle

#### Étape 1 : Aller dans le bon répertoire

```powershell
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"
```

#### Étape 2 : Installer les dépendances du projet

**Avec pnpm (recommandé)** :
```powershell
pnpm install
```

**Ou avec npm** :
```powershell
npm install
```

#### Étape 3 : Installer Chakra UI

**Avec pnpm** :
```powershell
pnpm add @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
```

**Ou avec npm** :
```powershell
npm install @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
```

#### Étape 4 : Démarrer l'application

**Avec pnpm** :
```powershell
pnpm run dev
```

**Ou avec npm** :
```powershell
npm run dev
```

## 📋 Commandes Complètes (Copier-Coller)

### Avec pnpm

```powershell
# Aller dans le répertoire
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"

# Installer toutes les dépendances
pnpm install

# Installer Chakra UI
pnpm add @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0

# Démarrer l'application
pnpm run dev
```

### Avec npm

```powershell
# Aller dans le répertoire
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"

# Installer toutes les dépendances
npm install

# Installer Chakra UI
npm install @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0

# Démarrer l'application
npm run dev
```

## 🔍 Vérification

Pour vérifier que tout est installé correctement :

```powershell
cd "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"

# Vérifier les dépendances
pnpm list
# ou
npm list

# Vérifier Chakra UI spécifiquement
pnpm list @chakra-ui/react
# ou
npm list @chakra-ui/react
```

## ⚠️ Notes Importantes

1. **Toujours aller dans `postiz-app-main`** avant d'exécuter les commandes
2. **Installer d'abord les dépendances du projet** (`pnpm install` ou `npm install`)
3. **Ensuite installer Chakra UI** si nécessaire
4. **Utiliser le même gestionnaire de paquets** (pnpm ou npm) pour toutes les commandes

## 🎉 Après l'Installation

Une fois tout installé, l'application devrait démarrer sur `http://localhost:4200` (ou le port configuré).

Tous les composants Chakra UI seront fonctionnels ! 🚀

