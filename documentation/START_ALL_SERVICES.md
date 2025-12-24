# 🚀 Script de Démarrage de Tous les Services

## 📋 Scripts Disponibles

J'ai créé **2 scripts PowerShell** pour démarrer tous les services :

### 1. `start-all-services.ps1` (Complet)
- Détection automatique du répertoire
- Installation automatique des dépendances
- Gestion d'erreurs complète
- Peut être lancé depuis n'importe où

### 2. `start-all-services-simple.ps1` (Simple)
- Version simplifiée
- Plus rapide à exécuter
- Détection automatique du répertoire

## 🎯 Utilisation

### Depuis la Racine (InfluenceCore)

```powershell
# Depuis H:\Studio Velysion CreatorHub\InfluenceCore
.\start-all-services-simple.ps1
```

### Depuis n'importe où

```powershell
# Le script trouve automatiquement postiz-app-main
cd "H:\Studio Velysion CreatorHub\InfluenceCore"
.\start-all-services-simple.ps1
```

## ✅ Ce que fait le Script

1. **Trouve automatiquement** le répertoire `postiz-app-main`
2. **Vérifie pnpm** et l'installe si nécessaire
3. **Installe les dépendances** si `node_modules` n'existe pas
4. **Installe Chakra UI** si pas déjà installé
5. **Démarre tous les services** en parallèle :
   - Frontend (port 4200)
   - Backend
   - Workers
   - Cron
   - Extension (peut échouer sur Windows)

## ⚠️ Note sur l'Extension

L'extension peut échouer sur Windows à cause de la commande `rm -rf`. C'est normal, les autres services continueront de fonctionner.

## 🛑 Arrêter les Services

Appuyez sur **Ctrl+C** dans le terminal pour arrêter tous les services.

## 📝 Commandes Manuelles (Alternative)

Si le script ne fonctionne pas, vous pouvez démarrer les services individuellement :

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"

# Frontend uniquement
pnpm run dev:frontend

# Backend uniquement
pnpm run dev:backend

# Workers uniquement
pnpm run dev:workers

# Cron uniquement
pnpm run dev:cron
```

## 🎉 Après le Démarrage

Une fois démarré, accédez à :
- **Frontend** : `http://localhost:4200`
- **Backend API** : Port configuré dans `.env`

Tous les composants Chakra UI seront disponibles sur les pages migrées !

