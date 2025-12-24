# 📋 Système de Logs Automatiques - InfluenceCore

## ✅ Fonctionnement Automatique

Les logs sont **automatiquement enregistrés** dans le dossier `logs/` sans aucune commande à taper !

## 📁 Structure des Fichiers de Logs

Le dossier `logs/` est créé automatiquement à la racine du projet et contient :

### Fichiers de logs quotidiens
- `app-YYYY-MM-DD.log` - Un fichier par jour avec tous les logs (info, debug, warn, error)
- Exemple : `app-2024-12-21.log`

### Fichier d'erreurs
- `errors.log` - Toutes les erreurs avec stack traces et contexte

## 🔄 Enregistrement Automatique

### Côté Serveur (API, Pages Server Components)
✅ **Tous les logs sont automatiquement enregistrés** dans les fichiers :
- `logger.info()` → Enregistré dans `app-YYYY-MM-DD.log`
- `logger.warn()` → Enregistré dans `app-YYYY-MM-DD.log`
- `logger.error()` → Enregistré dans `app-YYYY-MM-DD.log` ET `errors.log`
- `logger.debug()` → Enregistré dans `app-YYYY-MM-DD.log`

### Côté Client (Navigateur)
✅ Les logs sont affichés dans la console du navigateur
✅ Les logs peuvent être téléchargés via `downloadLogs()` dans la console

## 📝 Format des Logs

Chaque ligne de log contient :
```
[2024-12-21T15:30:45.123Z] [INFO] [ComponentName] Message du log | Data: {"key":"value"}
```

## 🗑️ Nettoyage Automatique

Les fichiers de logs de plus de **30 jours** sont automatiquement supprimés au démarrage du serveur.

## 📍 Emplacement

```
InfluenceCore/
├── logs/                    ← Dossier créé automatiquement
│   ├── app-2024-12-21.log   ← Logs du jour
│   ├── app-2024-12-20.log   ← Logs d'hier
│   └── errors.log           ← Toutes les erreurs
├── lib/
│   ├── logger.ts            ← Logger principal
│   └── file-logger.ts       ← Système d'écriture dans fichiers
└── ...
```

## 🔍 Comment Voir les Logs

### 1. Dans les fichiers
Ouvrez simplement les fichiers dans le dossier `logs/` avec un éditeur de texte.

### 2. Dans la console du navigateur (F12)
```javascript
// Voir tous les logs en mémoire
showLogs()

// Télécharger les logs
downloadLogs()

// Voir les statistiques
getLogStats()
```

### 3. Via l'interface Admin
Allez sur `/admin/logs` pour voir les logs d'erreurs stockés en base de données.

## ⚙️ Configuration

Le système fonctionne automatiquement, mais vous pouvez :

### Activer/Désactiver les logs
```javascript
// Dans la console du navigateur
logger.enable()   // Activer
logger.disable()  // Désactiver
```

### Variables d'environnement
Dans `.env.local` :
```
ENABLE_LOGS=true  # Activer les logs côté serveur
```

## 🚫 Fichiers Ignorés par Git

Le dossier `logs/` est automatiquement ignoré par Git (dans `.gitignore`) pour éviter de commiter les fichiers de logs.

## ✨ Avantages

- ✅ **Aucune commande à taper** - Tout est automatique
- ✅ **Un fichier par jour** - Facile à retrouver les logs d'une date précise
- ✅ **Erreurs séparées** - Fichier `errors.log` dédié aux erreurs
- ✅ **Nettoyage automatique** - Suppression des vieux logs après 30 jours
- ✅ **Pas de configuration** - Fonctionne dès le démarrage

---

**Dernière mise à jour** : 2024-12-21

