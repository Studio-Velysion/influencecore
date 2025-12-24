# 📋 Système de Logs - InfluenceCore

## 🚀 Activation Rapide

### Option 1 : Script PowerShell (Recommandé)

```powershell
.\scripts\enable-logs.ps1
```

Puis redémarrez le serveur :
```powershell
npm run dev
```

### Option 2 : Variable d'environnement

Créez un fichier `.env.local` avec :
```
ENABLE_LOGS=true
```

## 🎯 Utilisation dans le Navigateur

Une fois les logs activés, ouvrez la console du navigateur (F12) et utilisez :

### Commandes Disponibles

```javascript
// Afficher tous les logs dans la console
showLogs()

// Télécharger les logs au format JSON
downloadLogs()

// Voir les statistiques des logs
getLogStats()

// Activer les logs manuellement
logger.enable()

// Désactiver les logs
logger.disable()

// Vider les logs
logger.clear()

// Obtenir tous les logs
logger.getLogs()

// Obtenir les logs d'un composant spécifique
logger.getLogsByComponent('DashboardContent')

// Obtenir les logs d'un niveau spécifique
logger.getLogsByLevel('error')
```

## 📊 Visualisation en Temps Réel

Un widget de logs s'affiche automatiquement en bas à droite de l'écran en mode développement. Il montre :
- Les 10 derniers logs
- Les statistiques (total, info, warn, error)
- Des boutons pour afficher, télécharger ou effacer les logs

## 🔍 Niveaux de Logs

- **debug** : Informations de débogage détaillées
- **info** : Informations générales sur le fonctionnement
- **warn** : Avertissements (problèmes non critiques)
- **error** : Erreurs (problèmes critiques)

## 📝 Composants avec Logs

Les logs sont automatiquement ajoutés dans :
- ✅ `RootLayout` - Rendu du layout racine
- ✅ `HomePage` - Page d'accueil
- ✅ `DashboardContent` - Contenu du tableau de bord
- ✅ `ClientChakraProvider` - Initialisation de Chakra UI
- ✅ `ClientSidebar` - Barre latérale
- ✅ Tous les appels API

## 🛠️ Désactivation

```powershell
.\scripts\disable-logs.ps1
```

Ou supprimez `ENABLE_LOGS=true` du fichier `.env.local`.

## 📥 Export des Logs

Les logs peuvent être exportés au format JSON pour analyse :
1. Ouvrez la console (F12)
2. Tapez : `downloadLogs()`
3. Un fichier JSON sera téléchargé avec tous les logs

## 🎨 Format des Logs

Chaque log contient :
- **timestamp** : Date et heure ISO
- **level** : Niveau du log (debug, info, warn, error)
- **component** : Nom du composant qui a généré le log
- **message** : Message du log
- **data** : Données supplémentaires (optionnel)

## 💡 Conseils

1. **Activez les logs uniquement en développement** pour éviter d'affecter les performances
2. **Utilisez `logger.debug()`** pour les informations très détaillées
3. **Utilisez `logger.error()`** pour capturer toutes les erreurs avec leur stack trace
4. **Téléchargez les logs** avant de fermer le navigateur pour conserver l'historique

---

**Dernière mise à jour** : 2024-12-21

