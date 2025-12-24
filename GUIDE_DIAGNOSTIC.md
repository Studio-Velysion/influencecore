# 🔍 Guide de Diagnostic - InfluenceCore

## 🚨 Problème : Rien ne s'affiche / Chargement infini

### Étape 1 : Vérifier que le serveur fonctionne

1. Ouvrez votre terminal
2. Vérifiez que vous voyez :
   ```
   ✓ Ready in X.Xs
   ○ Compiling / ...
   ```

### Étape 2 : Tester la page de test simple

1. Allez sur : **http://localhost:3001/test**
2. Si cette page s'affiche → Next.js fonctionne, le problème vient de la page d'accueil
3. Si cette page ne s'affiche pas → Problème avec Next.js lui-même

### Étape 3 : Vérifier la console du navigateur

1. Ouvrez votre navigateur sur **http://localhost:3001**
2. Appuyez sur **F12** pour ouvrir les outils de développement
3. Allez dans l'onglet **Console**
4. Regardez les erreurs (en rouge)

**Erreurs courantes :**

- `Module not found` → Problème d'import
- `Cannot read property` → Problème avec un objet undefined
- `Hydration error` → Problème de rendu côté serveur/client
- `ReferenceError` → Variable non définie

### Étape 4 : Vérifier l'onglet Network

1. Dans les outils de développement (F12)
2. Allez dans l'onglet **Network**
3. Rechargez la page (F5)
4. Regardez les requêtes :
   - Si `/` retourne 200 → La page se charge
   - Si `/` retourne 500 → Erreur serveur
   - Si `/` reste en "pending" → Blocage/Timeout

### Étape 5 : Activer les logs

```powershell
# Dans le terminal PowerShell
.\scripts\enable-logs.ps1
```

Puis redémarrez le serveur :
```powershell
npm run dev
```

Dans la console du navigateur (F12), tapez :
```javascript
showLogs()
```

### Étape 6 : Vérifier les fichiers de configuration

1. **Vérifier `.env.local`** existe et contient :
   ```
   ENABLE_LOGS=true
   ```

2. **Vérifier `next.config.js`** n'a pas d'erreurs

3. **Vérifier `package.json`** que toutes les dépendances sont installées

### Étape 7 : Nettoyer et réinstaller

Si rien ne fonctionne :

```powershell
# Arrêter le serveur (Ctrl+C)

# Supprimer les caches
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Réinstaller
npm install

# Redémarrer
npm run dev
```

## 📋 Checklist de Diagnostic

- [ ] Le serveur Next.js démarre sans erreur
- [ ] La page `/test` s'affiche correctement
- [ ] La console du navigateur ne montre pas d'erreurs rouges
- [ ] L'onglet Network montre que `/` retourne 200
- [ ] Les logs sont activés et fonctionnent
- [ ] Le fichier `.env.local` existe avec `ENABLE_LOGS=true`

## 🆘 Si rien ne fonctionne

1. **Copiez toutes les erreurs** de la console du navigateur
2. **Copiez les erreurs** du terminal
3. **Vérifiez la page `/test`** fonctionne
4. Partagez ces informations pour un diagnostic approfondi

---

**Dernière mise à jour** : 2024-12-21

