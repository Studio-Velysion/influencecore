# 🚀 Guide de Démarrage - InfluenceCore

## Démarrage Rapide

### Option 1 : Script PowerShell (Recommandé)

```powershell
.\start-influencecore-only.ps1
```

Ce script :
- ✅ Trouve automatiquement le répertoire InfluenceCore
- ✅ Vérifie que Node.js et npm sont installés
- ✅ Installe les dépendances si nécessaire
- ✅ Démarre le serveur de développement

### Option 2 : Commande npm directe

```powershell
npm install
npm run dev
```

## 📋 Prérequis

- **Node.js** v18 ou supérieur
- **npm** (inclus avec Node.js)

Vérifier l'installation :
```powershell
node --version
npm --version
```

## 🌐 Accès à l'Application

Une fois démarré, l'application est accessible sur :
- **URL locale** : http://localhost:3000
- **Dashboard** : http://localhost:3000/dashboard
- **Page de connexion** : http://localhost:3000/login

## 🔧 Commandes Disponibles

```bash
# Développement
npm run dev              # Démarre le serveur de développement

# Production
npm run build            # Compile l'application pour la production
npm run start            # Démarre le serveur de production

# Base de données
npm run db:generate      # Génère le client Prisma
npm run db:push          # Pousse le schéma vers la base de données
npm run db:migrate       # Exécute les migrations
npm run db:studio        # Ouvre Prisma Studio

# Tests
npm run test:setup       # Configure la base de données de test
npm run test:create-users # Crée des utilisateurs de test
```

## ⚠️ Dépannage

### Erreur : "Cannot find module 'next'"

**Solution** : Les dépendances ne sont pas installées
```powershell
npm install
```

### Erreur : "Port 3000 already in use"

**Solution** : Un autre processus utilise le port 3000
- Arrêtez l'autre processus
- Ou changez le port dans `package.json` : `"dev": "next dev -p 3001"`

### Erreur : "Cannot find module '@chakra-ui/react'"

**Solution** : Réinstallez les dépendances
```powershell
rm -r node_modules
npm install
```

## 📝 Notes

- Le serveur de développement redémarre automatiquement lors des modifications
- Les erreurs de compilation s'affichent dans le terminal et le navigateur
- Utilisez `Ctrl+C` pour arrêter le serveur

---

**Dernière mise à jour** : 2024-12-21

