# ⚡ Commandes Exactes à Exécuter

## 🎯 Copier-Coller Ces Commandes

### Pour Démarrer le Frontend (Test Chakra UI)

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
pnpm run dev:frontend
```

**OU avec npm** :

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
npm run dev:frontend
```

## 📝 Explication

1. **`cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"`**
   - Va dans le répertoire du projet Postiz
   - **OBLIGATOIRE** avant toute commande

2. **`pnpm run dev:frontend`** ou **`npm run dev:frontend`**
   - Démarre uniquement le frontend
   - Évite l'erreur de l'extension
   - Parfait pour tester Chakra UI

## ✅ Vérification

Après avoir exécuté les commandes, vous devriez voir :

```
apps/frontend dev$ dotenv -e ../../.env -- next dev -p 4200
```

Puis l'application démarre sur `http://localhost:4200`

## 🚨 Si Ça Ne Fonctionne Pas

### Vérifier le répertoire actuel :

```powershell
pwd
```

**Doit afficher** : `H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main`

### Si vous êtes dans InfluenceCore :

```powershell
# Vous êtes ici : H:\Studio Velysion CreatorHub\InfluenceCore
# ❌ Les scripts ne fonctionnent pas ici

# Allez dans postiz-app-main
cd postiz-app-main

# Maintenant les scripts fonctionnent
pnpm run dev:frontend
```

## 🎉 C'est Tout !

Une fois démarré, ouvrez votre navigateur sur `http://localhost:4200` et testez les pages Chakra UI !

