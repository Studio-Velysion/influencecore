# 🔧 Résolution : Services qui Échouent

## ❌ Problème

Tous les services échouent au démarrage avec `Failed`.

## 🔍 Causes Possibles

### 1. Fichier .env Manquant ⚠️ (Le Plus Probable)

Les services ont besoin d'un fichier `.env` à la racine du projet pour fonctionner.

**Solution** :
```powershell
# Vérifier si le fichier .env existe
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
Test-Path "..\.env"

# Si False, créer le fichier .env ou copier depuis .env.example
```

### 2. Base de Données Non Configurée

Les services backend nécessitent une base de données PostgreSQL configurée.

**Solution** :
- Vérifier que PostgreSQL est démarré
- Vérifier les variables `DATABASE_URL` dans `.env`
- Exécuter les migrations : `pnpm run prisma-db-push`

### 3. Redis Non Démarré

Les workers et queues nécessitent Redis.

**Solution** :
- Démarrer Redis
- Vérifier `REDIS_URL` dans `.env`

### 4. Ports Déjà Utilisés

Les ports peuvent être déjà utilisés par d'autres applications.

**Solution** :
- Vérifier les ports dans `.env`
- Arrêter les autres applications qui utilisent ces ports

## ✅ Solution Rapide : Démarrer Uniquement le Frontend

Pour tester Chakra UI, vous n'avez besoin que du frontend :

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
pnpm run dev:frontend
```

Le frontend fonctionne sans backend pour tester l'interface Chakra UI !

## 🔧 Solution Complète : Configurer l'Environnement

### Étape 1 : Vérifier/Créer le fichier .env

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"

# Vérifier si .env existe
if (-not (Test-Path "..\.env")) {
    Write-Host "Le fichier .env n'existe pas!"
    Write-Host "Créez-le à la racine: H:\Studio Velysion CreatorHub\InfluenceCore\.env"
}
```

### Étape 2 : Variables .env Minimales pour le Frontend

Pour que le frontend fonctionne seul, vous avez besoin au minimum :

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:4200
NODE_ENV=development
```

### Étape 3 : Démarrer le Frontend Seul

```powershell
.\start-frontend-only.ps1
```

## 📝 Scripts Disponibles

1. **`start-all-services.ps1`** - Tous les services (nécessite .env complet)
2. **`start-frontend-only.ps1`** - Frontend uniquement (pour tester Chakra UI)

## 🎯 Pour Tester Chakra UI Maintenant

Utilisez le script frontend-only qui ne nécessite pas de configuration complète :

```powershell
cd "H:\Studio Velysion CreatorHub\InfluenceCore"
.\start-frontend-only.ps1
```

Cela démarrera uniquement le frontend sur `http://localhost:4200` et vous pourrez tester tous les composants Chakra UI !

## ⚠️ Note

L'erreur de l'extension est normale sur Windows (commande `rm -rf` Unix). Les autres services devraient fonctionner une fois le `.env` configuré.

