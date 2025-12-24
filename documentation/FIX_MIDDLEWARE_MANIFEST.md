# 🔧 Correction de l'Erreur middleware-manifest.json

## ❌ Erreur

```
Error: Cannot find module 'H:\Studio Velysion CreatorHub\InfluenceCore\.next\server\middleware-manifest.json'
```

## 🔍 Cause

Le fichier `middleware-manifest.json` est généré par Next.js lors de la compilation. Il est manquant car :
1. Le dossier `.next` est corrompu ou incomplet
2. La compilation Next.js n'a pas été complétée
3. Le serveur a été arrêté pendant la compilation

## ✅ Solution

### Étape 1 : Arrêter le Serveur
Appuyez sur **Ctrl+C** dans le terminal où tourne `npm run dev`

### Étape 2 : Nettoyer le Cache
```powershell
# Supprimer le dossier .next
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

**OU** utilisez le script automatique :
```powershell
.\scripts\clean-restart.ps1
```

### Étape 3 : Redémarrer le Serveur
```powershell
npm run dev
```

Next.js va régénérer automatiquement le fichier `middleware-manifest.json` lors de la compilation.

## 🔍 Vérification

Après le redémarrage, vérifiez que le fichier existe :
```powershell
Test-Path ".next\server\middleware-manifest.json"
```

## ⚠️ Si le Problème Persiste

1. **Vérifier que le middleware.ts est valide**
   - Le fichier `middleware.ts` doit exporter une fonction `default`
   - Le fichier `middleware.ts` doit avoir un `export const config`

2. **Vérifier les dépendances**
   ```powershell
   npm install
   ```

3. **Vérifier les erreurs de compilation**
   - Regardez les erreurs dans le terminal
   - Vérifiez que TypeScript compile correctement

---

**Dernière mise à jour** : 2024-12-23

