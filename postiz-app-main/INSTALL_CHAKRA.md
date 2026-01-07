# 📦 Installation de Chakra UI v3

## 🚀 Installation Rapide

### Option 1 : Script PowerShell (Recommandé)

Exécutez le script PowerShell fourni :

```powershell
cd postiz-app-main
.\install-chakra-ui.ps1
```

### Option 2 : Installation Manuelle

Si pnpm n'est pas installé, installez-le d'abord :

```powershell
npm install -g pnpm
```

Ensuite, installez les dépendances :

```powershell
cd postiz-app-main
pnpm add @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
```

### Option 3 : Utiliser npm (si pnpm ne fonctionne pas)

```powershell
cd postiz-app-main
npm install @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
```

## ✅ Vérification

Après l'installation, vérifiez que les dépendances sont bien installées :

```powershell
cd postiz-app-main
pnpm list @chakra-ui/react
```

## 🔧 Résolution de Problèmes

### pnpm n'est pas reconnu

Si PowerShell ne reconnaît pas `pnpm`, essayez :

1. **Réinstaller pnpm** :
   ```powershell
   npm install -g pnpm
   ```

2. **Vérifier le PATH** :
   ```powershell
   $env:Path
   ```

3. **Redémarrer PowerShell** après l'installation

### Erreur de permissions

Si vous avez des erreurs de permissions :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Utiliser npm à la place

Si pnpm continue à poser problème, vous pouvez utiliser npm :

```powershell
cd postiz-app-main
npm install @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
```

## 📝 Notes

- Les dépendances seront installées dans `node_modules/`
- Le fichier `package.json` sera mis à jour automatiquement
- Tous les composants Chakra UI sont déjà migrés et prêts à être utilisés

## 🎉 Après l'Installation

Une fois les dépendances installées, vous pouvez :

1. **Démarrer le serveur de développement** :
   ```powershell
   pnpm run dev
   ```

2. **Tester les composants** :
   - Accédez à `/workspaces`
   - Accédez à `/templates`
   - Accédez à `/queues`
   - Accédez à `/hashtag-groups`
   - Accédez à `/dynamic-variables`

Tous ces composants utilisent maintenant Chakra UI v3 ! 🚀

