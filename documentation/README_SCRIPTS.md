# 🚀 Scripts de Démarrage

## 📋 Scripts Disponibles

### 1. `start-all-services.ps1` ⭐
**Démarre TOUS les services en même temps**

```powershell
.\start-all-services.ps1
```

**Services démarrés :**
- ✅ Frontend (port 4200)
- ✅ Backend
- ✅ Workers
- ✅ Cron
- ⚠️ Extension (peut échouer sur Windows)

### 2. `start-frontend-only.ps1`
**Démarre uniquement le Frontend** (pour tester Chakra UI)

```powershell
.\start-frontend-only.ps1
```

## 🎯 Utilisation

### Depuis la Racine (InfluenceCore)

```powershell
# Aller dans le répertoire racine
cd "H:\Studio Velysion CreatorHub\InfluenceCore"

# Démarrer tous les services
.\start-all-services.ps1

# OU démarrer uniquement le frontend
.\start-frontend-only.ps1
```

### Depuis n'importe où

Les scripts trouvent automatiquement le répertoire `postiz-app-main` !

```powershell
# Depuis n'importe quel répertoire
cd "H:\Studio Velysion CreatorHub\InfluenceCore"
.\start-all-services.ps1
```

## ✅ Ce que font les Scripts

1. **Trouvent automatiquement** `postiz-app-main`
2. **Vérifient pnpm** et l'installent si nécessaire
3. **Installent les dépendances** si `node_modules` n'existe pas
4. **Installent Chakra UI** si pas déjà installé
5. **Démarrent les services** demandés

## 🛑 Arrêter les Services

Appuyez sur **Ctrl+C** dans le terminal pour arrêter.

## 📝 Commandes Manuelles (Alternative)

Si vous préférez démarrer manuellement :

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"

# Tous les services
pnpm run dev

# Frontend uniquement
pnpm run dev:frontend

# Backend uniquement
pnpm run dev:backend
```

## 🎉 Après le Démarrage

- **Frontend** : http://localhost:4200
- **Pages Chakra UI** :
  - http://localhost:4200/workspaces
  - http://localhost:4200/templates
  - http://localhost:4200/queues
  - http://localhost:4200/hashtag-groups
  - http://localhost:4200/dynamic-variables

## ⚠️ Notes

- L'extension peut échouer sur Windows (normal, ignorez l'erreur)
- Les autres services continueront de fonctionner
- Pour tester Chakra UI, le frontend seul suffit

