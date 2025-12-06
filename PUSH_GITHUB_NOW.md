# 🚀 Pousser sur GitHub MAINTENANT

## ✅ Tout est prêt !

Votre token GitHub est configuré. Il ne reste qu'à exécuter le script.

---

## 📋 Étape 1 : Créer le repository (si pas déjà fait)

1. Allez sur **https://github.com/new**
2. Nommez : `influencecore`
3. Choisissez **Private**
4. **Ne cochez PAS** "Initialize with README"
5. Cliquez sur **Create repository**

---

## 🚀 Étape 2 : Pousser le code

Exécutez simplement :

```powershell
.\scripts\push-to-github.ps1
```

Le script va vous demander votre nom d'utilisateur GitHub et pousser automatiquement le code !

**Ou avec le nom d'utilisateur en paramètre :**

```powershell
.\scripts\push-to-github.ps1 -GitHubUsername "VOTRE_USERNAME"
```

---

## ✅ C'est tout !

Après exécution, votre projet sera sur GitHub et le déploiement automatique sera prêt.

---

## 🔒 Sécurité du token

⚠️ **Important** : Votre token a été utilisé pour configurer Git. Pour les prochains pushs, Git Credential Manager le gérera automatiquement.

Si vous voulez changer le token plus tard :
1. Créez un nouveau token sur GitHub
2. Utilisez-le dans l'URL : `https://NOUVEAU_TOKEN@github.com/...`

---

**Prêt ? Exécutez le script !** 🎉

