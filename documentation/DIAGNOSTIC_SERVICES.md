# 🔍 Diagnostic des Services qui Échouent

## ❌ Problème Actuel

Tous les services échouent au démarrage. Voici les causes possibles :

### 1. Fichier .env Manquant ou Incorrect

Les services utilisent `dotenv -e ../../.env` pour charger les variables d'environnement.

**Vérification :**
```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
Test-Path "..\..\.env"
```

**Solution :**
- Créer un fichier `.env` à la racine (`H:\Studio Velysion CreatorHub\InfluenceCore\.env`)
- Ou copier depuis `.env.example` si disponible

### 2. Dépendances Non Installées dans les Sous-Projets

Chaque app (frontend, backend, etc.) doit avoir ses propres `node_modules`.

**Vérification :**
```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
Test-Path "apps\frontend\node_modules"
Test-Path "apps\backend\node_modules"
```

**Solution :**
```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
pnpm install
```

### 3. dotenv-cli Non Installé

Les scripts utilisent `dotenv-cli` pour charger le fichier .env.

**Vérification :**
```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
pnpm list dotenv-cli
```

**Solution :**
```powershell
pnpm add -D dotenv-cli
```

### 4. Extension Échoue (Normal sur Windows)

L'extension utilise `rm -rf` qui n'existe pas sur Windows. C'est normal, les autres services continuent.

## ✅ Solution Rapide : Démarrer le Frontend Seul

Pour tester Chakra UI, vous n'avez besoin que du frontend :

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
pnpm run dev:frontend
```

## 🔧 Script de Diagnostic

J'ai créé `start-all-services-v2.ps1` qui :
- Vérifie mieux les prérequis
- Donne des messages d'erreur plus clairs
- Gère mieux les cas d'erreur

## 📝 Commandes de Diagnostic

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"

# Vérifier le fichier .env
Test-Path "..\..\.env"

# Vérifier les dépendances
Test-Path "node_modules"
Test-Path "apps\frontend\node_modules"

# Installer toutes les dépendances
pnpm install

# Vérifier dotenv-cli
pnpm list dotenv-cli
```

## 🎯 Pour Tester Chakra UI Rapidement

Utilisez le script frontend-only :

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore"
.\start-frontend-only.ps1
```

Cela démarre uniquement le frontend sans les autres services.

