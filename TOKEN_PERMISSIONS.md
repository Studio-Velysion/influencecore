# ⚠️ Problème de Permissions Token GitHub

## 🔍 Diagnostic

Le token GitHub que vous avez fourni n'a **pas les permissions d'écriture** sur le repository `Studio-Velysion/influencecore`.

---

## ✅ Solution : Créer un nouveau token avec les bonnes permissions

### Étapes :

1. **Allez sur GitHub** : https://github.com/settings/tokens
2. **Cliquez sur** : "Generate new token" → "Generate new token (classic)"
3. **Configurez le token** :
   - **Note** : "InfluenceCore Deploy"
   - **Expiration** : Choisissez une durée (90 jours recommandé)
   - **Scopes** : Cochez **`repo`** (accès complet aux repositories)
     - Cela inclut automatiquement : `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
4. **Générez le token** et **copiez-le immédiatement** (vous ne le reverrez plus !)

### ⚠️ Important pour les organisations

Si le repository appartient à l'organisation `Studio-Velysion`, le token doit avoir :
- Le scope `repo` complet
- Les permissions d'organisation activées (si l'organisation le requiert)

---

## 🚀 Une fois le nouveau token créé

### Option 1 : Utiliser le script

```powershell
# Modifiez le token dans scripts/push-with-token.ps1
# Puis exécutez :
.\scripts\push-with-token.ps1
```

### Option 2 : Commandes manuelles

```powershell
# Remplacer NOUVEAU_TOKEN par votre nouveau token
$token = "NOUVEAU_TOKEN"
git remote set-url origin https://$token@github.com/Studio-Velysion/influencecore.git
git push -u origin main
```

### Option 3 : Avec authentification interactive

```powershell
git remote set-url origin https://github.com/Studio-Velysion/influencecore.git
git push -u origin main
```

Quand Git demande :
- **Username** : `Studio-Velysion`
- **Password** : Votre **nouveau token** (pas votre mot de passe)

---

## 🔒 Sécurité

⚠️ **Ne partagez jamais votre token** publiquement. Une fois utilisé, il sera stocké dans Git Credential Manager de manière sécurisée.

---

## 📝 Vérification

Pour vérifier les scopes de votre token actuel, vous pouvez utiliser :

```powershell
$headers = @{ "Authorization" = "token VOTRE_TOKEN"; "Accept" = "application/vnd.github.v3+json" }
$response = Invoke-WebRequest -Uri "https://api.github.com/user" -Headers $headers
$response.Headers['X-OAuth-Scopes']
```

Les scopes doivent inclure `repo` pour pouvoir pousser du code.

