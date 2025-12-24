# 🔍 Commandes de Diagnostic - InfluenceCore

## 🚀 Commandes Rapides

### 1. Diagnostic Complet
```powershell
.\scripts\diagnostic.ps1
```

### 2. Activer les Logs
```powershell
.\scripts\enable-logs.ps1
```

### 3. Démarrer le Serveur
```powershell
npm run dev
```

### 4. Tester la Page Simple
Ouvrez dans le navigateur : **http://localhost:3001/test**

## 📋 Checklist de Diagnostic

### Étape 1 : Vérifier le Serveur
- [ ] Le serveur démarre sans erreur
- [ ] Vous voyez "✓ Ready in X.Xs" dans le terminal
- [ ] Le port 3001 est utilisé (ou 3000)

### Étape 2 : Tester la Page de Test
- [ ] Allez sur **http://localhost:3001/test**
- [ ] La page s'affiche avec "✅ Page de Test"
- [ ] Si OUI → Next.js fonctionne, problème avec la page d'accueil
- [ ] Si NON → Problème avec Next.js lui-même

### Étape 3 : Vérifier la Console du Navigateur
1. Ouvrez **http://localhost:3001**
2. Appuyez sur **F12**
3. Allez dans l'onglet **Console**
4. Regardez les erreurs (en rouge)

**Commandes utiles dans la console :**
```javascript
// Voir tous les logs
showLogs()

// Voir les statistiques
getLogStats()

// Télécharger les logs
downloadLogs()

// Activer les logs manuellement
logger.enable()
```

### Étape 4 : Vérifier l'Onglet Network
1. Dans F12, allez dans **Network**
2. Rechargez la page (F5)
3. Regardez la requête `/` :
   - **200** → Page chargée
   - **500** → Erreur serveur
   - **Pending** → Blocage/Timeout

### Étape 5 : Vérifier les Erreurs Serveur
Dans le terminal où tourne `npm run dev`, regardez :
- Les erreurs de compilation
- Les erreurs de runtime
- Les timeouts

## 🛠️ Solutions Rapides

### Problème : Page blanche / Chargement infini

**Solution 1 : Nettoyer le cache**
```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

**Solution 2 : Vérifier les erreurs dans la console**
- Ouvrez F12 → Console
- Copiez toutes les erreurs rouges
- Partagez-les pour diagnostic

**Solution 3 : Tester la page simple**
- Allez sur `/test`
- Si ça fonctionne → Problème avec la page d'accueil
- Si ça ne fonctionne pas → Problème avec Next.js

### Problème : Logs ne fonctionnent pas

**Solution :**
```powershell
# Activer les logs
.\scripts\enable-logs.ps1

# Redémarrer le serveur
npm run dev

# Dans la console du navigateur (F12)
logger.enable()
showLogs()
```

## 📝 Informations à Partager pour Diagnostic

Si le problème persiste, partagez :

1. **Erreurs de la console** (F12 → Console)
2. **Erreurs du terminal** (où tourne npm run dev)
3. **Résultat de `/test`** (fonctionne ou non)
4. **Résultat du diagnostic** (`.\scripts\diagnostic.ps1`)

---

**Dernière mise à jour** : 2024-12-21

