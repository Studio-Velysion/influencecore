# 🔄 Commandes pour Actualiser la Base de Données Locale

## 📋 Réinitialisation Complète

### 1. Nettoyer l'ancienne base de données

```powershell
npm run test:cleanup
```

Cette commande va :
- ✅ Supprimer le fichier `test.db`
- ✅ Supprimer les fichiers temporaires SQLite (`test.db-wal`, `test.db-shm`)
- ✅ Restaurer l'ancien `.env.local` (s'il existait)
- ✅ Nettoyer tous les fichiers de test

### 2. Recréer la base de données avec les bons IDs

```powershell
npm run test:setup
```

Cette commande va :
- ✅ Créer une nouvelle base de données SQLite (`test.db`)
- ✅ Générer le client Prisma
- ✅ Créer toutes les tables
- ✅ Créer les utilisateurs de test avec les bons IDs :
  - `test-user-id` (test@example.com / test123)
  - `test-admin-id` (admin@example.com / test123)
- ✅ Configurer `.env.local` pour les tests

## ⚙️ Configuration .env.local

Après le setup, votre `.env.local` devrait contenir :

```env
DATABASE_URL="file:./test.db"
BYPASS_AUTH=true
TEST_USER_TYPE=admin
```

**Options pour `TEST_USER_TYPE` :**
- `normal` : Utilisateur normal (pas d'accès admin)
- `admin` : Utilisateur admin (accès complet)

## 🚀 Lancer l'Application

```powershell
npm run dev
```

## 🌐 URLs de Test

Une fois l'application lancée :

- **Page publique** : http://localhost:3000
- **Dashboard** : http://localhost:3000/dashboard
- **Admin** : http://localhost:3000/admin (si `TEST_USER_TYPE=admin`)

## 📝 Commandes Utiles

### Nettoyer la base de données
```powershell
npm run test:cleanup
```

### Recréer la base de données
```powershell
npm run test:setup
```

### Lancer l'application
```powershell
npm run dev
```

### Ouvrir Prisma Studio (visualiser la base)
```powershell
npm run db:studio
```

## 🔧 Résolution de Problèmes

### Si l'admin ne fonctionne pas

1. Vérifiez que `.env.local` contient :
   ```env
   TEST_USER_TYPE=admin
   ```

2. Relancez le setup :
   ```powershell
   npm run test:cleanup
   npm run test:setup
   ```

3. Redémarrez le serveur :
   ```powershell
   # Arrêtez le serveur (Ctrl+C)
   npm run dev
   ```

### Si la page publique n'est pas visible

1. Vérifiez que `.env.local` contient :
   ```env
   BYPASS_AUTH=true
   ```

2. La page publique devrait être accessible même en mode test

### Si les utilisateurs n'existent pas

Relancez le setup pour recréer les utilisateurs :
```powershell
npm run test:cleanup
npm run test:setup
```

## ✅ Checklist de Vérification

Après le setup, vérifiez :

- [ ] Le fichier `test.db` existe
- [ ] `.env.local` contient `BYPASS_AUTH=true`
- [ ] `.env.local` contient `TEST_USER_TYPE=admin` (si besoin)
- [ ] Les utilisateurs existent dans la base (via Prisma Studio)
- [ ] La page publique est accessible
- [ ] Le dashboard est accessible
- [ ] L'admin est accessible (si `TEST_USER_TYPE=admin`)

## 🎯 Workflow Complet

```powershell
# 1. Nettoyer
npm run test:cleanup

# 2. Recréer
npm run test:setup

# 3. Vérifier la configuration
# Ouvrir .env.local et vérifier :
# - BYPASS_AUTH=true
# - TEST_USER_TYPE=admin (ou normal)

# 4. Lancer l'application
npm run dev

# 5. Tester
# - http://localhost:3000 (page publique)
# - http://localhost:3000/dashboard
# - http://localhost:3000/admin (si admin)
```

---

**Dernière mise à jour :** 2024-12-21

